/* global Buffer */
import SysFileSystem from 'app/sys-filesystem';
import { notify } from 'app/notifications';
import * as Github from 'github-api';


class GithubInt {

    // notification options

    constructor(username, password) {
        //TODO work out initialization conditions and grabbing github authkey

        if(username == undefined)
        {
            this.hub = new Github({});
            this.authenticated = false;
        }
        else
        {
            this.hub = new Github({username:username, password:password, auth:'basic'});
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

        var tokens = repoUrl.split('/', 2);
        if(tokens.length<2)
            return;

        var username = tokens[0];
        var reponame = tokens[1];

        var repo = this.hub.getRepo(username, reponame);
        var fs = SysFileSystem;

        notify('Cloning ' + repoUrl + '...', 'yellow');

        repo.getTree('master?recursive=true', function(err, tree) {

            if(err)
            {
                if(err.request.response=='')
                    notify('Something happened... Try again.', 'red');
                else
                    notify(JSON.parse(err.request.response)['message'], 'red');

                return;
            }

            var parentPath = destPath + '/' + reponame;

            fs.makeDirectory(parentPath);

            var loaded = 0;
            var showErrors = true;

            for(var i = 0; i<tree.length; i++)
            {
                if(tree[i].type == 'blob')
                {
                    repo.read('master', tree[i].path, function(err, data) {

                        if(err)
                        {
                            if(showErrors)
                            {
                                if(err.request.response=='')
                                    notify('Something happened... Try again.', 'red');
                                else
                                    notify(JSON.parse(err.request.response)['message'], 'red');

                                showErrors = false;
                            }
                            return;
                        }

                        fs.writeFile(parentPath+'/'+tree[this].path, new Buffer(data,'binary'));

                        loaded += 1;

                        if(loaded == tree.length)
                            notify('Successfully cloned ' + repoUrl + '!', 'green');

                    }.bind(i));
                }
                if(tree[i].type == 'tree'){

                    loaded += 1;
                    fs.makeDirectory(parentPath+'/'+tree[i].path);
                }
            }
        }.bind(this));
    }

    /*
    * Pushes all local files (i.e those in /home/user) to a public repo named 'saved-jor1k-workspace'
    * If the repo already exists, it deletes it and creates a new repo.
    * If needed this can be extended to modify current existing repo rather than deleting, but this is non-trivial.
    */
    saveAll(saveRepoName, srcPath) {
        var fs = SysFileSystem;
        this.saveRepoName = saveRepoName;
        this.sourcePath = srcPath;

        if(!this.authenticated)
        {
            notify('Must be authenticated...', 'red');
        }
        var repo = this.hub.getRepo(this.username, saveRepoName);
        repo.show(function(err, repo_info){
            if(err){
                if(err.error==404)
                    this.createSaveRepo();
                else
                {
                    if(err.request.response=='')
                        notify('Something happened... Try again.', 'red');
                    else
                        notify(JSON.parse(err.request.response)['message'], 'red');

                    return;
                }
            }
            else{
                repo.deleteRepo(this.createSaveRepo.bind(this));
            }

        }.bind(this));
    }

    /*
    * Helper for saveAll.
    */
    createSaveRepo(err, res) {
        this.user.createRepo({'name': this.saveRepoName}, function(err, res) {

            if(err)
            {
                if(err.request.response=='')
                    notify('Something happened... Try again.', 'red');
                else
                    notify(JSON.parse(err.request.response)['message'], 'red');

                return;
            }

            var repo = this.hub.getRepo(this.username, this.saveRepoName);
            this.pushToRepo(repo, this.sourcePath);
        }.bind(this));
    }

    /*
    * Helper for saveAll.
    *
    * This is very hacky... the api is very limited and doesn't allow parallel writes
    */
    pushToRepo(repo, sourcePath) {
        var fs = SysFileSystem;

        var tree = [];
        if(sourcePath === ''){
            tree = fs.getDirectoryTreeOfDir('/');
        }
        else{
            tree = fs.getDirectoryTreeOfDir(sourcePath);
        }

        //trim source path from tree
        var pathLength = sourcePath.length;
        var trimPath = function(fullPath){
            return fullPath.substring(pathLength, fullPath.length);
        };

        var readFile = function(err){

            if(err)
            {
                if(err.request.response=='')
                    notify('Something happened... Try again.', 'red');
                else
                    notify(JSON.parse(err.request.response)['message'], 'red');

                return;
            }

            var i = 0;
            if(typeof this == 'number')
                i = this;

            while(i<tree.length && tree[i].isDirectory)
                i++;

            if(i>=tree.length)
            {
                notify('Successfully pushed!', 'green');
                return;
            }

            fs.readFile(tree[i].path, writeFile.bind(i));
        };

        var writeFile = function(err, buf){

            if(err)
            {
                if(err.request.response=='')
                    notify('Something happened... Try again.', 'red');
                else
                    notify(JSON.parse(err.request.response)['message'], 'red');

                return;
            }

            var i = this;
            tree[this].path = tree[this].path.substring(1,tree[this].path.length);
            repo.write('master', trimPath(tree[i].path), buf.toString('binary'), 'save', readFile.bind(i+1));
        };

        readFile();

    }

}

export default (GithubInt);