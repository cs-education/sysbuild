/* eslint-disable no-shadow, no-use-before-define, no-loop-func, func-names */
/* global Buffer */
import SysFileSystem from 'app/sys-filesystem';
import { notify } from 'app/notifications';
import * as Github from 'github-api';
import bootbox from 'bootbox';

class GithubInt {
    constructor(username, password) {
        // TODO work out initialization conditions and grabbing github authkey

        if (username === undefined) {
            this.hub = new Github({});
            this.authenticated = false;
        } else {
            this.hub = new Github({ username: username, password: password, auth: 'basic' });
            this.authenticated = true;
            this.user = this.hub.getUser();
            this.username = username;
        }
    }

    /*
    * Clones specified repo in to a new directory within the local file system.
    *
    * Note: unauthenticated users are limited to 60 github api calls per hour
    * and each file is an api call.
    */
    cloneRepo(repoUrl, destPath) {
        const tokens = repoUrl.split('/', 2);
        if (tokens.length < 2) {
            return;
        }

        const username = tokens[0];
        const reponame = tokens[1];

        const repo = this.hub.getRepo(username, reponame);
        const fs = SysFileSystem;

        notify('Cloning ' + repoUrl + '...', 'yellow');

        repo.getTree('master?recursive=true', (err, tree) => {
            if (err) {
                if (err.request.response === '') {
                    notify('Something happened... Try again.', 'red');
                } else {
                    notify(JSON.parse(err.request.response).message, 'red');
                }

                return;
            }

            const parentPath = destPath + '/' + reponame;

            fs.makeDirectory(parentPath);

            let loaded = 0;
            let showErrors = true;

            for (let i = 0; i < tree.length; i++) {
                if (tree[i].type === 'blob') {
                    repo.read('master', tree[i].path, function (err, data) {
                        if (err) {
                            if (showErrors) {
                                if (err.request.response === '') {
                                    notify('Something happened... Try again.', 'red');
                                } else {
                                    notify(JSON.parse(err.request.response).message, 'red');
                                }
                                showErrors = false;
                            }
                            return;
                        }

                        fs.writeFile(parentPath + '/' + tree[this].path, new Buffer(data, 'binary'));

                        loaded += 1;

                        if (loaded === tree.length) {
                            notify('Successfully cloned ' + repoUrl + '!', 'green');
                        }
                    }.bind(i));
                }

                if (tree[i].type === 'tree') {
                    loaded += 1;
                    fs.makeDirectory(parentPath + '/' + tree[i].path);
                }
            }
        });
    }

    /*
    * Pushes all local files (i.e those in /home/user) to a public repo named 'saved-jor1k-workspace'
    * If the repo already exists, it deletes it and creates a new repo.
    * If needed this can be extended to modify current existing repo rather than deleting, but this is non-trivial.
    */
    saveAll(saveRepoName, srcPath) {
        const fs = SysFileSystem;
        this.saveRepoName = saveRepoName;
        this.sourcePath = srcPath;

        if (!this.authenticated) {
            notify('Must be authenticated...', 'red');
        }
        const repo = this.hub.getRepo(this.username, saveRepoName);
        repo.show((err, repoInfo) => {
            if (err) {
                if (err.error === 404) {
                    this.createSaveRepo();
                } else if (err.request.response === '') {
                    notify('Something happened... Try again.', 'red');
                } else {
                    notify(JSON.parse(err.request.response).message, 'red');
                }
            } else {
                bootbox.dialog({
                    title: 'Careful!',
                    message: 'A repo with the name \'' + saveRepoName + '\' already exists. What do you want to do?',
                    buttons: {
                        cancel: {
                            label: 'Cancel',
                            className: 'btn-default',
                            callback: () => {}
                        },
                        merge: {
                            label: 'Merge',
                            className: 'btn-primary',
                            callback: () => {
                                const repo = this.hub.getRepo(this.username, this.saveRepoName);
                                this.pushToRepo(repo, this.sourcePath);
                            },
                        },
                        overwrite: {
                            label: 'Overwrite',
                            className: 'btn-danger',
                            callback: () => {
                                bootbox.confirm('Are you sure? All the contents of \'' + saveRepoName + '\' will be overwritten.', (result) => {
                                    if (result) {
                                        repo.deleteRepo(this.createSaveRepo.bind(this));
                                    }
                                });
                            },
                        },
                    },
                });
            }
        });
    }

    /*
    * Helper for saveAll.
    */
    createSaveRepo(err, res) {
        this.user.createRepo({ name: this.saveRepoName }, (err, res) => {
            if (err) {
                if (err.request.response === '') {
                    notify('Something happened... Try again.', 'red');
                } else {
                    notify(JSON.parse(err.request.response).message, 'red');
                }
                return;
            }

            const repo = this.hub.getRepo(this.username, this.saveRepoName);
            this.pushToRepo(repo, this.sourcePath);
        });
    }

    /*
    * Helper for saveAll.
    *
    * This is very hacky... the api is very limited and doesn't allow parallel writes
    */
    pushToRepo(repo, sourcePath) {
        const fs = SysFileSystem;

        let tree = [];
        if (sourcePath === '') {
            tree = fs.getDirectoryTreeOfDir('/');
        } else {
            tree = fs.getDirectoryTreeOfDir(sourcePath);
        }

        // trim source path from tree
        const pathLength = sourcePath.length;
        const trimPath = (fullPath) => {
            return fullPath.substring(pathLength, fullPath.length);
        };

        const readFile = function (err) {
            if (err) {
                if (err.request.response === '') {
                    notify('Something happened... Try again.', 'red');
                } else {
                    notify(JSON.parse(err.request.response).message, 'red');
                }

                return;
            }

            let i = 0;
            if (typeof this === 'number') {
                i = this;
            }

            while (i < tree.length && tree[i].isDirectory) {
                i++;
            }

            if (i >= tree.length) {
                notify('Successfully pushed!', 'green');
                return;
            }

            fs.readFile(tree[i].path, writeFile.bind(i));
        };

        const writeFile = function (err, buf) {
            if (err) {
                if (err.request.response === '') {
                    notify('Something happened... Try again.', 'red');
                } else {
                    notify(JSON.parse(err.request.response).message, 'red');
                }
                return;
            }

            const i = this;
            tree[this].path = tree[this].path.substring(1, tree[this].path.length);
            repo.write('master', trimPath(tree[i].path), buf.toString('binary'), 'save', readFile.bind(i + 1));
        };

        readFile();
    }

}

export default (GithubInt);
