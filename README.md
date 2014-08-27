# sysweb #

Source code for the Linux-In-The-Browser project used
in the [CS 241 (System Programming)](https://courses.engr.illinois.edu/cs241/) course
at [UIUC](http://illinois.edu/). View it live [here](http://angrave.github.io/sys/).

Use the [issue tracker](https://github.com/angrave/sysbuild/issues) to submit bug reports and feature requests.
If you would like to work on this project, continue reading to get started.

## Project folder structure ##
```
sysbuild/
├── app/
│   ├── jor1k/                      The jor1k project source copied by grunt during setup
│   ├── jor1k_hd_images/            Disk images for the Virtual Machine
│   ├── scripts/                    JS files
│   └── styles/                     SASS and CSS files
├── bower_components/               Dependencies installed by Bower
├── node_modules/                   Dependencies installed by npm
├── sys-gh-pages-config/            Config for the application deployed on production
└── test/                           Tests
    └── spec/
```

## Development environment set up ##
1. Install [node.js](http://nodejs.org/). Node's package manager ([npm](https://www.npmjs.org/)) comes bundled.

2. Clone this git repository.  
`git clone https://github.com/angrave/sysbuild.git`

3. Globally install [Bower](http://bower.io/) and [Grunt](http://gruntjs.com/).
You might need to use `sudo` or run the command as an Administrator if it fails due to missing permissions,
because of the [location npm installs global packages](https://www.npmjs.org/doc/files/npm-folders.html) in.  
`npm install -g bower grunt-cli`

4. Change to the project directory.  
`cd sysbuild/`

5. Install dependencies and set up the project.  
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

## Contributing ##
1. Create a new branch to make changes or add a new feature.  
`git checkout -b my_awesome_feature_branch`

2. Stage your changes before committing. Type the following for every added/modified/deleted file.  
`git add path/to/modified_file`

3. Commit your changes. Do this often.  
`git commit -m "I changed this to that and fixed bla."`

4. Push the branch to origin so that others can see it.  
`git push origin my_awesome_feature_branch`

5. [Create a pull request](https://help.github.com/articles/creating-a-pull-request) for merging into `master`.
Wait for someone to review your code and merge your changes. Make sure to follow the code guidelines below.

## Code guidelines ##
* We have an [editor config](https://github.com/angrave/sysbuild/blob/master/.editorconfig) file for maintaining a consistent coding style.
  Read more and download plugins at <http://editorconfig.org>.
* Please include tests whenever possible.
* Keep accessibility in mind when writing HTML.
* Make sure there are no JSHint errors.
* Make sure all tests pass.
* Avoid pushing changes to `master`. Most changes should be in their own branch, which should then be merged into `master` through a pull request.
  This allows us to review code before merging and makes rolling back changes easier.

## Deploying ##
We use [GitHub Pages](https://help.github.com/articles/what-are-github-pages) for hosting the application.
The production repository is <https://github.com/angrave/sys> and the staging repository is <https://github.com/neelabhg/sys-staging>.
You will need push access to the appropriate repository before you can deploy.

1. Build the distributable project (output in the `dist/` folder).  
`grunt build`

2. Deploy to [staging](http://neelabhg.github.io/sys-staging/).  
`grunt deploy:neelabhgstaging`

4. Deploy to [production](http://angrave.github.io/sys/).  
`grunt deploy:angraveprod`

## Licence ##
See [LICENSE.txt](https://github.com/angrave/sysbuild/blob/master/LICENSE.txt).
