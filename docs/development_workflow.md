# Development Workflow

[Understanding the GitHub Flow](https://guides.github.com/introduction/flow/) provides a good conceptual overview of how typical collaboration and development takes place.
[The Forking Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/forking-workflow) explains the mechanics of how contributions are made.


## Pull Requests

Pull requests --- patches, improvements, new features --- are a fantastic help.

Please ask first before embarking on any significant pull request.
You can comment on the relevant issue, post in the chat room, or open a new issue to start or join a discussion.
It is also a good idea to discuss your solution/changes/approach before starting any implementation.

Pull requests should remain focused in scope and avoid containing unrelated commits.
They should also adhere to the [code style guidelines](/docs/code_style_guide.md) used throughout the project.

**IMPORTANT**: By contributing your code, you agree to license your contribution under the terms of the [project's license](/LICENSE.md).

Adhering to the following process is the best way to get your work included in the project:

1.  [Set up your development environment](/docs/getting_started.md), if not set up already.

2.  [Sync your local `master` branch](https://help.github.com/articles/syncing-a-fork/) with the upstream repository
    and then update your fork on GitHub:

    ```
    git checkout master
    git pull upstream master
    git push origin master
    ```

3.  Create a new topic branch (off the main project development branch) to contain your feature, change, or fix:

    ```
    git checkout -b <topic-branch-name>
    ```

4.  Stage your changes before committing. Type the following for every individual added/modified/deleted file
    (instead of staging all changes in one go, to ensure you do not accidentally add any sensitive or unnecessary files):

    ```
    git add path/to/modified_file
    ```

5.  Commit your changes in logical chunks. Please adhere to the [Git commit message guidelines](/docs/git_commit_message_guidelines.md).
    Running the following will also run the [Git hooks](/scripts/git_hooks) installed during setup:

    ```
    git commit
    ```

6.  Locally [merge (or rebase)](https://www.atlassian.com/git/tutorials/merging-vs-rebasing)
    the upstream development branch into your topic branch (if merge conflicts arise then please fix them):

    ```
    git pull [--rebase] upstream master
    ```

7.  Push your topic branch up to your fork:

    ```
    git push origin <topic-branch-name>
    ```

8.  We use [Travis CI](https://travis-ci.org/) for continuous integration.
    Every time a pull request is opened or updated with more commits, a build is triggered.
    It is a good idea to test your code locally before opening a pull request,
    so as to avoid failed builds and needing to revise the pull request.
    Use the following command to run the tests exactly as they are run by Travis CI:

    ```
    ./scripts/ci
    ```

9.  [Create a pull request](https://help.github.com/articles/creating-a-pull-request)
    for merging into the upstream `master` branch. You're all set!
    Now wait for someone to review your code and merge your changes.


### After Your Pull Request is Merged

Thank you and congratulations! After your pull request is merged,
you can safely delete your branch and pull the changes from the main (upstream) repository:

1.  Delete the remote branch on GitHub either through the GitHub web UI or your local shell as follows:

    ```
    git push origin --delete <topic-branch-name>
    ```

2.  Check out the `master` branch:

    ```
    git checkout master
    ```

3.  Delete the local branch:

    ```
    git branch -D <topic-branch-name>
    ```

4.  Update your local `master` branch with the latest upstream version:

    ```
    git pull upstream master
    ```

5.  Update your fork on GitHub:

    ```
    git push origin master
    ```


## Tips

* Avoid pushing changes to the `master` branch of your fork. Changes should be in their own branch, which should then
  be merged into `upstream/master` through a pull request. Your fork's `master` branch should always be in sync
  with `upstream/master`. If you open a pull request with changes made directly on your `master` branch, and your pull
  request happens to get rejected, your fork's `master` branch will remain ahead of `upstream/master`, which is a
  [messy situation to fix](https://stackoverflow.com/questions/5916329/cleanup-git-master-branch-and-move-some-commit-to-new-branch).
  Therefore, always make changes in a new branch.

* You can [skip a Travis CI build](http://docs.travis-ci.com/user/customizing-the-build/#Skipping-a-build) if a build
  is unnecessary for a particular commit.

* If your pull request contains a fix for a bug or implements a new feature, you can have the corresponding issue
  [closed automatically](https://github.com/blog/1506-closing-issues-via-pull-requests) when the pull request is merged.

* Whenever you change branches or `pull` from another branch, untracked and auto-genrated files may get out of sync, which might lead to errors.
  For example, it is a good idea to run `npm install` for projects which use npm after changing branches or pulling from another branch.
  It is sometimes necessary to remove the `node_modules` directory before running `npm install` to ensure you have the latest dependencies.
