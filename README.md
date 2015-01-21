# sysbuild [![Build Status](https://travis-ci.org/cs-education/sysbuild.svg?branch=master)](https://travis-ci.org/cs-education/sysbuild) #

Source code for the Linux-In-The-Browser project used
in the [CS 241 (System Programming)](https://courses.engr.illinois.edu/cs241/) course
at [UIUC](http://illinois.edu/). View it live [here](http://cs-education.github.io/sys/).

Use the [issue tracker](https://github.com/cs-education/sysbuild/issues) to submit bug reports and feature requests.
If you would like to work on this project, continue reading to get started.

## Project folder structure ##
```
sysbuild/
├── app/                      Application source code
│   ├── jor1k/                The jor1k project source copied by grunt during setup
│   ├── jor1k_hd_images/      Disk images for the Virtual Machine
│   ├── scripts/              Javascript files
│   ├── styles/               SASS and CSS files
│   └── sysassets/            Files from the sysassets project copied by grunt during setup
├── dist/                     The distributable application output by the build process
├── bower_components/         Dependencies installed by Bower
├── node_modules/             Dependencies installed by npm
├── sys-gh-pages-config/      Config for the application deployed on production
└── test/                     Tests
    └── spec/
```

This project was scaffolded using the [Yeoman webapp generator](https://github.com/yeoman/generator-webapp).

## Development environment set up ##
1. [Set up Git](https://help.github.com/articles/set-up-git/) and install [node.js](http://nodejs.org/). Node's package manager ([npm](https://www.npmjs.org/)) comes bundled.

2. Globally install [Bower](http://bower.io/) and [Grunt](http://gruntjs.com/).
You might need to use `sudo` or run the command as an Administrator if it fails due to missing permissions,
because of the [location npm installs global packages](https://www.npmjs.org/doc/files/npm-folders.html) in.  
`npm install -g bower grunt-cli`

3. [Fork](https://help.github.com/articles/fork-a-repo/) this repository. Clone your forked git repository.  
`git clone https://github.com/YOUR-USERNAME/sysbuild.git`

4. Change to the project directory.  
`cd sysbuild/`

5. Configure Git to sync your fork with the original repository.  
`git remote add upstream https://github.com/cs-education/sysbuild.git`

6. Install dependencies and set up the project.  
`npm install`

## Useful commands ##
* Run a development server. Automatically launches default browser. Also supports live reloading, which means
  changes automatically show up without the need to refresh the page. Files are also watched for changes - 
  JSHint is automatically run on the changed JS files, changed SASS files are automatically compiled, etc.  
  `grunt serve`

* If you add a new bower component, you might want to automatically inject *supported* Bower components into the HTML file.  
  `grunt bowerInstall`

* Run [JSHint](http://www.jshint.com/about/).  
  `grunt jshint`

* Run tests.  
  `grunt test`

* Run a local test server, to run the tests in a browser. Navigate to `http://localhost:9001` after running the following.  
  `grunt testserver`

## Contributing ##
1. Make sure your fork is up to date with the upstream repository. See https://help.github.com/articles/syncing-a-fork/.  
`git fetch upstream`  
`git checkout master`  
`git merge upstream/master`  
`git push origin master`

2. Create a new branch to make changes or add a new feature.  
`git checkout -b my_awesome_feature_branch`

3. Stage your changes before committing. Type the following for every added/modified/deleted file.  
`git add path/to/modified_file`

4. Commit your changes. Do this often.  
`git commit -m "I changed this to that and fixed bla."`

5. Push the branch to origin so that others can see it.  
`git push origin my_awesome_feature_branch`

6. [Create a pull request](https://help.github.com/articles/creating-a-pull-request) for merging into the upstream `master`.
Wait for someone to review your code and merge your changes. Make sure you followed the code guidelines below.
If you were working on an issue, you can have the issue [closed automatically](https://github.com/blog/1506-closing-issues-via-pull-requests) when the pull request is merged.

## Code guidelines ##
* We have an [editor config](https://github.com/cs-education/sysbuild/blob/master/.editorconfig) file for maintaining a consistent coding style.
  Read more and download plugins at <http://editorconfig.org>.

* Please include tests whenever possible.

* Keep accessibility in mind when writing HTML.

* Make sure there are no JSHint errors.

* Make sure all tests pass.

* Avoid pushing changes to `master`. Most changes should be in their own branch, which should then be merged into `upstream/master` through a pull request.
  Your fork's `master` should always be in sync with `upstream/master`. If you made your changes in your `master` branch and your pull request gets rejected,
  your `master` branch will be ahead of `upstream/master` and it is [hard to cleanup](http://stackoverflow.com/questions/5916329/cleanup-git-master-branch-and-move-some-commit-to-new-branch).
  Therefore, always make changes in a new branch.

* We use [Travis CI](https://travis-ci.org/) for continuous integration. Every time you open a pull request and make commits onto it, a build is triggered.
  Sometimes you will make commits which do not need a build to be created (for example, editing the README or non-code changes). In that case, just add
  `[skip ci]` somewhere in your commit message. [Learn more](http://docs.travis-ci.com/user/how-to-skip-a-build/).

## Deploying ##
We use [GitHub Pages](https://help.github.com/articles/what-are-github-pages) for hosting the application.
The production repository is <https://github.com/cs-education/sys> and the staging repository is <https://github.com/cs-education/sys-staging>.
You will need push access to the appropriate repository before you can deploy.

1. Build the distributable project (output in the `dist/` folder).  
`grunt build`

2. Deploy to [staging](http://cs-education.github.io/sys-staging/).  
`grunt deploy:staging`

4. Deploy to [production](http://cs-education.github.io/sys/).  
`grunt deploy:prod`

## Credits ##
#### Creators ####
Lawrence Angrave [github.com/angrave](http://github.com/angrave)  

#### 2014-15 Contributors - UIUC Students ####
Anant Singh [github.com/anant-singh](https://github.com/anant-singh)  
Eric Ahn [github.com/wchill](https://github.com/wchill)  
Joseph Tran [github.com/jdtran23](https://github.com/jdtran23)  
Keagan McClelland [github.com/CaptJakk](https://github.com/CaptJakk)  
Neelabh Gupta [github.com/neelabhg](http://github.com/neelabhg)  
Scott Walters [github.com/scowalt](https://github.com/scowalt)  
Siddharth Seth [github.com/siddharth-seth](https://github.com/siddharth-seth)

#### Open source projects ####
The Virtual Machine is powered by the [jor1k](https://github.com/cs-education/jor1k) project.  
The code editor is powered by [Ace](http://ace.c9.io/).

## Licence ##
See [LICENSE.txt](https://github.com/cs-education/sysbuild/blob/master/LICENSE.txt).

#### Open source licences ####
jor1k is distributed under the terms of the [Simplified BSD License](https://github.com/cs-education/jor1k/blob/master/LICENSE.md).  
Bootstrap is released under the [MIT license](https://github.com/twbs/bootstrap/blob/master/LICENSE) and is copyright 2014 Twitter.  
Ace (Ajax.org Cloud9 Editor) is [BSD licenced](https://github.com/ajaxorg/ace-builds/blob/master/LICENSE) and is Copyright (c) 2010, Ajax.org B.V.  
