/* eslint-disable new-cap */
/* global require, Buffer, BrowserFS */
class SysFileSystem {

    constructor() {
        this.initialized = false;
        return this;
    }

    initialize(jor1kFS) {
        this.initialized = true;
        BrowserFS.install(window);
        BrowserFS.initialize(new BrowserFS.FileSystem.LocalStorage());

        this.localFS = BrowserFS.BFSRequire('fs');
        this.jor1kFS = jor1kFS;
        this.listeners = [];

        this.syncVM();

        this.jor1kFS.WatchDirectory('home/user', this.Jor1kNotifyCallBack.bind(this), this);
    }

    /*------------------------------------------------------------------------------------------------*/
    /**
    *   API for interating with the joined file system
    **/

    writeFile(path, buf) {
        if (path.charAt(0) !== '/') {
            path = '/' + path;
        }

        if (typeof buf === 'string') {
            buf = new Buffer(buf);
        }

        this.jor1kFS.MergeBinaryFile('home/user' + path, new Uint8Array(buf.toArrayBuffer()));
        this.localFS.writeFileSync(path, buf);
    }

    readFile(path, cb) {
        if (this.localFS.statSync(path).isDirectory()) {
            return;
        }

        this.localFS.readFile(path, cb);
    }

    /*
    *   This is a blocking call, user readFile for async.
    */
    readFileSync(path) {
        if (this.localFS.statSync(path).isDirectory()) {
            return;
        }

        return this.localFS.readFileSync(path);
    }

    deleteFile(path) {
        if (this.localFS.statSync(path).isDirectory()) {
            return;
        }

        if (path.charAt(0) !== '/') {
            path = '/' + path;
        }

        if (this.localFS.statSync(path).isFile()) {
            this.jor1kFS.DeleteNode('home/user' + path);
        }
    }

    /*
    * Creates a directory.
    * Does not overwrite existing directories.
    */
    makeDirectory(path) {
        if (path.charAt(0) !== '/') {
            path = '/' + path;
        }

        this.jor1kFS.CreateDirectory('home/user' + path);
    }

    /*
    * Recursively removes a directory.
    */
    removeDirectory(path) {
        if (this.localFS.statSync(path).isFile()) {
            return;
        }

        if (path.charAt(0) !== '/') {
            path = '/' + path;
        }

        if (this.localFS.statSync(path).isDirectory()) {
            this.jor1kFS.DeleteNode('home/user' + path);
        }
    }

    /*
    * Renames a file or directory from oldpath to newpath.
    * Same functionality as mv.
    */
    rename(oldpath, newpath) {
        if (oldpath === newpath) {
            return;
        }

        if (oldpath.charAt(0) !== '/') {
            oldpath = '/' + oldpath;
        }

        if (newpath.charAt(0) !== '/') {
            newpath = '/' + newpath;
        }

        if (this.localFS.existsSync(oldpath)) {
            this.jor1kFS.Rename('home/user' + oldpath, 'home/user' + newpath);
        }
    }

    /*
    * Copies a single file from srcpath to dstpath.
    * Copying of directories is not yet implemented.
    */
    copyTo(srcpath, dstpath) {
        if (srcpath === dstpath) {
            return;
        }

        const stat = this.localFS.statSync(srcpath);
        if (stat.isDirectory()) {
            return;
        }

        this.localFS.readFile(srcpath, (err, buf) => {
            if (dstpath.charAt(0) !== '/') {
                dstpath = '/' + dstpath;
            }

            this.jor1kFS.MergeBinaryFile('home/user' + dstpath, new Uint8Array(buf.toArrayBuffer()), stat.mode);
        });
    }

    /*
    * Returns an array of { isDirectory: boolean, name: string } objects
    * of all nodes with in the directory specified in path.
    */
    getDirectoryChildren(path) {
        if (path === '') {
            path = '/';
        }

        if ((!this.localFS.existsSync(path)) || this.localFS.statSync(path).isFile()) {
            return [];
        }

        const children = this.localFS.readdirSync(path);
        const ret = [];

        if (path.charAt(path.length - 1) !== '/') {
            path += '/';
        }

        for (let i = 0; i < children.length; i++) {
            const child = {};
            child.name = children[i];

            if (this.localFS.statSync(path + children[i]).isDirectory()) {
                child.isDirectory = true;
            } else {
                child.isDirectory = false;
            }

            if (!(child.name.indexOf('.') === 0)) {
                ret.push(child);
            }
        }
        return ret;
    }

    /*
    * Returns an array of { isDirectory: boolean, path: string } objects
    * of all nodes within /home/user. Partially ordered from root -> leafs
    */
    getDirectoryTree() {
        return this.getDirectoryTreeOfDir('/');
    }

    /*
    * Helper for getDirectoryTree
    */
    getDirectoryTreeOfDir(path) {
        const children = this.localFS.readdirSync(path);

        if (path === '/') {
            path = '';
        }

        const ret = [];
        const dirs = [];
        for (let i = 0; i < children.length; i++) {
            const childPath = path + '/' + children[i];
            const child = {};
            child.path = childPath;

            if (this.localFS.statSync(childPath).isDirectory()) {
                child.isDirectory = true;
                dirs.push(childPath);
            } else {
                child.isDirectory = false;
            }

            ret.push(child);
        }

        for (let a = 0; a < dirs.length; a++) {
            ret.push.apply(ret, this.getDirectoryTreeOfDir(dirs[a]));
        }

        return ret;
    }

    addChangeListener(fn) {
        const ary = this.listeners;
        if (ary) {
            ary.push(fn);
        } else {
            this.listeners = [fn];
        }
    }

    removeChangeListener(fn) {
        const ary = this.listeners;
        this.listeners = ary.filter((el) => {
            return el !== fn;
        });
    }

    notifyChangeListeners() {
        let ary = this.listeners;
        if (!ary) {
            return;
        }
        ary = ary.slice(); // Listeners may be added/removed during this event, so make a copy first
        for (let i = 0; ary && i < ary.length; i++) {
            ary[i]();
        }
    }

    /*------------------------------------------------------------------------------------------------*/
    /**
    *   Write all local files (those stored in local storage) to
    *   the Jor1k file system (i.e /home/user)
    **/
    syncVM() {
        console.log('Starting Syncing VM File System');
        this.jor1kFS.DeleteDirContents('home/user');
        this.syncDirectory('/');
        console.log('Done Syncing');
    }

    syncDirectory(directory) {
        if (directory !== '/') {
            this.jor1kFS.CreateDirectory('home/user' + directory);
        }

        const children = this.localFS.readdirSync(directory);
        if (directory === '/') {
            directory = '';
        }
        for (let i = 0; i < children.length; i++) {
            const newpath = directory + '/' + children[i];
            const stat = this.localFS.statSync(newpath);
            if (stat.isDirectory()) {
                this.syncDirectory(newpath);
            } else {
                const buf = this.localFS.readFileSync(newpath);
                this.jor1kFS.MergeBinaryFile('home/user' + newpath, new Uint8Array(buf.toArrayBuffer()), 33261);
            }
        }
    }

    /*------------------------------------------------------------------------------------------------*/
    /**
    *   Handling callbacks from file operations done on
    *   the Jor1k VM
    **/
    Jor1kNotifyCallBack(info) {
        const path = info.path.substring('home/user'.length, info.path.length);

        if (path === '') {
            return;
        }

        console.log(info.event);
        switch (info.event) {
            case 'write':
                this.jor1kFS.ReadFile(info.path, this.Jor1kReadCallBack.bind(this), this);
                break;
            case 'newdir':
                this.localFS.mkdir(path, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
                this.notifyChangeListeners();
                break;
            case 'newfile':
                this.jor1kFS.ReadFile(info.path, this.Jor1kReadCallBack.bind(this), this);
                this.notifyChangeListeners();
                break;
            case 'delete':
                if (this.localFS.existsSync(path)) {
                    if (this.localFS.statSync(path).isDirectory()) {
                        this.localFS.rmdir(path, (err) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                    } else {
                        this.localFS.unlink(path, (err) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                    }
                }
                this.notifyChangeListeners();
                break;
            case 'rename':
                if (info.info !== {}) {
                    const oldpath = info.info.oldpath.substring('home/user'.length, info.info.oldpath.length);
                    this.localFS.rename(oldpath, path);
                    this.notifyChangeListeners();
                }
                break;
            default:
                break;
        }
    }

    Jor1kReadCallBack(file) {
        if (file === null) {
            return;
        }

        const filename = file.name.substring('home/user'.length, file.name.length);

        console.log('Writing to local: ' + filename);
        const buf = new Buffer(file.data);
        this.localFS.writeFileSync(filename, buf, { mode: file.mode });
        this.notifyChangeListeners();
    }
}

// SysFileSystem is meant to be used as a singleton
export default (new SysFileSystem());
