# Contributing to the project

## Pull requests
Good pull requests - patches, improvements, new features - are a fantastic help.
They should remain focused in scope and avoid containing unrelated commits.

Please ask first before embarking on any significant pull request.
Please adhere to the [coding guidelines](#code-guidelines) mentioned further below in this document.

1. Make sure your fork is up to date with the upstream repository. See https://help.github.com/articles/syncing-a-fork/.  
`git checkout master`  
`git pull upstream/master`  
`git push origin master`

2. Make sure all the dependencies are installed and up-to-date:  
`npm install`

3. Create a new topic branch (off the main project development branch) to contain your feature, change, or fix:  
`git checkout -b my_awesome_feature_branch`

4. Stage your changes before committing. Type the following for every added/modified/deleted file:  
`git add path/to/modified_file`

5. Commit your changes. Do this often.  
`git commit -m "I changed this to that and fixed bla."`

6. Push your topic branch up to your fork:  
`git push origin my_awesome_feature_branch`

6. [Create a pull request](https://help.github.com/articles/creating-a-pull-request) for merging into the upstream `master` branch.
Wait for someone to review your code and merge your changes.
If you were working on an issue, you can have the issue [closed automatically](https://github.com/blog/1506-closing-issues-via-pull-requests) when the pull request is merged.

## Code guidelines ##
* We have an [editor config](.editorconfig) file for maintaining a consistent coding style.
  Read more and download plugins at <http://editorconfig.org>.

* Please include tests whenever possible.

* Keep accessibility in mind when writing HTML.

* Make sure there are no JSHint/JSCS errors.

* Make sure all tests pass.

* Avoid pushing changes to `master`. Most changes should be in their own branch, which should then be merged into `upstream/master` through a pull request.
  Your fork's `master` should always be in sync with `upstream/master`. If you made your changes in your `master` branch and your pull request gets rejected,
  your `master` branch will be ahead of `upstream/master` and it is [hard to cleanup](http://stackoverflow.com/questions/5916329/cleanup-git-master-branch-and-move-some-commit-to-new-branch).
  Therefore, always make changes in a new branch.

* We use [Travis CI](https://travis-ci.org/) for continuous integration. Every time you open a pull request and make commits onto it, a build is triggered.
  Sometimes you will make commits which do not need a build to be created (for example, editing the README or non-code changes). In that case, just add
  `[skip ci]` somewhere in your commit message. [Learn more](http://docs.travis-ci.com/user/how-to-skip-a-build/).
