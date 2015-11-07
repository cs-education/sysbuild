# Contributing to the project

## Development environment set up
1. [Set up Git](https://help.github.com/articles/set-up-git/) and install [node.js](http://nodejs.org/).
   Node's package manager ([npm](https://www.npmjs.org/)) comes bundled.

2. Globally install [Bower](http://bower.io/) and [Grunt](http://gruntjs.com/)
   (you might need to use `sudo` or run the command as an Administrator if it fails due to missing permissions,
   because of the [location npm installs global packages](https://www.npmjs.org/doc/files/npm-folders.html) in):  
   `npm install -g bower grunt-cli`

3. [Fork](https://help.github.com/articles/fork-a-repo/) this repository. Clone your forked git repository:  
   `git clone https://github.com/YOUR-USERNAME/sysbuild.git`

4. Navigate to the newly cloned directory:  
   `cd sysbuild/`

5. Configure Git to sync your fork with the original repository:  
   `git remote add upstream https://github.com/cs-education/sysbuild.git`

## Pull requests
Good pull requests - patches, improvements, new features - are a fantastic help.
They should remain focused in scope and avoid containing unrelated commits.

Please ask first before embarking on any significant pull request.
Please adhere to the [coding guidelines](#code-guidelines).

1. [Set up your development environment](#development-environment-set-up) if not done already.

2. Make sure your fork is up to date with the upstream repository. See https://help.github.com/articles/syncing-a-fork/.  
   `git checkout master`  
   `git pull upstream/master`  
   `git push origin master`

3. Make sure all the dependencies are installed and up-to-date:  
   `npm install`

4. Create a new topic branch (off the main project development branch) to contain your feature, change, or fix:  
   `git checkout -b my_awesome_feature_branch`

5. Stage your changes before committing. Type the following for every added/modified/deleted file:  
   `git add path/to/modified_file`

6. Commit your changes. Do this often.  
   `git commit -m "I changed this to that and fixed bla."`

7. Push your topic branch up to your fork:  
   `git push origin my_awesome_feature_branch`

8. [Create a pull request](https://help.github.com/articles/creating-a-pull-request) for merging into the upstream `master` branch.
   Wait for someone to review your code and merge your changes.

## Code guidelines ##
* Please include tests whenever possible.

* Make sure all tests pass. Use the command `grunt test` to run the tests.

* We have an [editor config](.editorconfig) file for maintaining a consistent coding style.
  Read more and download plugins at <http://editorconfig.org>. Using EditorConfig can help you adhere to the code guidelines.

### HTML
* [Adhere to the Code Guide by @mdo](http://codeguide.co/#html).

* Use tags and elements appropriate for an HTML5 doctype (e.g., self-closing tags).

* Download JS scripts using Bower to be included in the distribution, instead of loading them from third-party URLs.

* If you have to use third-party JS, use CDNs and HTTPS when possible.

* Use [WAI-ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) attributes to promote accessibility.

### CSS
* [Adhere to the Code Guide by @mdo](http://codeguide.co/#css).

* When feasible, default color palettes should comply with [WCAG color contrast guidelines](http://www.w3.org/TR/WCAG20/#visual-audio-contrast).

### JS
* We use [JSHint](http://jshint.com/about/) to detect errors and potential problems in JavaScript code.
  Use `grunt jshint` to run JSHint on your code. The file [.jshintrc](.jshintrc) contains the configuration used for JSHint.
  JSHint errors can be suppressed when necessary.

* We use [JSCS](http://jscs.info/) for code style linting.
  Use `grunt jscs` to run JSCS on your code. The file [.jscsrc](.jscsrc) contains the configuration used for JSCS.
  Currently we use [Douglas Crockford's style guide](http://javascript.crockford.com/code.html) with some overrides.

## Useful tools and tips for development
* Run a development server. Automatically launches default browser. Files are also watched for changes - 
  JSHint is automatically run on the changed JS files, changed SASS files are automatically compiled, etc.
  You do need to refresh the web page after making any changes (live reloading has been disabled
  due to [this issue](https://github.com/cs-education/sysbuild/issues/115)).  
  `grunt serve`

* If you add a new Bower component, you might want to automatically inject *supported* Bower components into the HTML file.  
  `grunt bowerInstall`

* Run a local test server, to run the tests in a browser. Navigate to `http://localhost:9001` after running the following.  
  `grunt testserver`
  
* Avoid pushing changes to `master`. Most changes should be in their own branch, which should then be merged into `upstream/master` through a pull request.
  Your fork's `master` should always be in sync with `upstream/master`. If you made your changes in your `master` branch and your pull request gets rejected,
  your `master` branch will be ahead of `upstream/master` and it is [hard to cleanup](http://stackoverflow.com/questions/5916329/cleanup-git-master-branch-and-move-some-commit-to-new-branch).
  Therefore, always make changes in a new branch.

* We use [Travis CI](https://travis-ci.org/) for continuous integration. Every time you open a pull request and make commits onto it, a build is triggered.
  Sometimes you will make commits which do not need a build to be created (for example, editing the README or non-code changes). In that case, just add
  `[skip ci]` somewhere in your commit message. [Learn more](http://docs.travis-ci.com/user/how-to-skip-a-build/).

* If your pull request contains a fix for a bug or implements a new feature, you can have the corresponding
  issue [closed automatically](https://github.com/blog/1506-closing-issues-via-pull-requests) when the pull request is merged.
