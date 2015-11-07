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
Pull requests - patches, improvements, new features - are a fantastic help.

Please ask first before embarking on any significant pull request.
It is also a good idea to discuss your solution to a bug or feature before implementing it.
You can comment on the relevant issue, post in the chat room or open a new issue to join a start a discussion.

Pull requests should remain focused in scope and avoid containing unrelated commits.
They should also adhere to the [coding guidelines](#code-guidelines) used throughout the project.

Adhering to the following process is the best way to get your work included in the project:
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

8. We use [Travis CI](https://travis-ci.org/) for continuous integration.
   Every time a pull request is opened or updated with more commits, a build is triggered.
   It is a good idea to test your code locally before opening a pull request, so as to avoid failed builds
   and needing to revise the pull request. Use the following command to run the tests exactly as they are run by Travis CI:
   `grunt travis`

8. [Create a pull request](https://help.github.com/articles/creating-a-pull-request) for merging into the upstream `master` branch.
   Wait for someone to review your code and merge your changes.

IMPORTANT: By submitting a patch, you agree to allow the project owners to license your work as mentioned [at the bottom](#license).

## Code guidelines
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
* Run `grunt serve` to start a development server. It will automatically launch the default browser and navigate to the local application.
  It will also watch files for changes - automatically running JSHint on changed JS files, automatically compiling changed SASS files, etc.
  You do need to refresh the web page after making any changes (live reloading has been disabled due to
  [this issue](https://github.com/cs-education/sysbuild/issues/115)).

* If you add a new Bower component to the project, run `grunt bowerInstall` to automatically inject tags for *supported* Bower components into the HTML file.

* If you want to run the tests in a browser, run `grunt testserver` to start a local test server, then navigate to `http://localhost:9001`.

* Avoid pushing changes to the `master` branch of your fork. Changes should be in their own branch, which should then be merged into `upstream/master` through a pull request.
  Your fork's `master` branch should always be in sync with `upstream/master`. If you open a pull request with changes made directly on your `master` branch,
  and your pull request happens to get rejected, your fork's `master` branch will remain ahead of `upstream/master`,
  which is a [messy situation to fix](https://stackoverflow.com/questions/5916329/cleanup-git-master-branch-and-move-some-commit-to-new-branch).
  Therefore, always make changes in a new branch.

* You can [skip a Travis CI build](http://docs.travis-ci.com/user/customizing-the-build/#Skipping-a-build) if a build is unnecessary for a particular commit.

* If your pull request contains a fix for a bug or implements a new feature, you can have the corresponding
  issue [closed automatically](https://github.com/blog/1506-closing-issues-via-pull-requests) when the pull request is merged.

## License
By contributing your code, you agree to license your contribution under the terms of the [project's license](LICENSE.md).
