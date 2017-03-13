# Getting Started


## Project Organization

This is the main repository for the project.
It is structured in a "monorepo" style to contain multiple related sub-projects
(see [PR #169](https://github.com/cs-education/sysbuild/pull/169)).
Other repositories which are part of the project are:

* [cs-education/sysassets](https://github.com/cs-education/sysassets) - Pre-compiled assets used in the project,
  such as lecture videos, lessons, man pages, and the jor1k filesystem.

We use [GitHub Pages](https://help.github.com/articles/what-are-github-pages) for hosting the application.
The repositories used for deployment are separate from this repository, to keep this repository small.
You probably won't be committing changes directly to these repositories, but instead use automated deployment scripts.
The following repositories are used for deployment:

* [cs-education/sys-staging](https://github.com/cs-education/sys-staging) - Staging deployment for the C playground web app,
  used for testing before deploying to production

* [cs-education/sys](https://github.com/cs-education/sys) - Production deployment for the C playground web app


## Setting up Your Development Environment

1.  [Set up Git](https://help.github.com/articles/set-up-git/) and install [Node.js](https://nodejs.org/).
    Node's package manager ([npm](https://www.npmjs.org/)) comes bundled.

2.  [Fork](https://help.github.com/articles/fork-a-repo/) this repository.
    Clone your forked Git repository:

    ```
    git clone https://github.com/<your-username>/sysbuild.git
    ```

3.  Navigate to the newly cloned directory:

    ```
    cd sysbuild/
    ```

4.  Install project-wide dependencies.
    This will also run the setup script to create the recommended Git remotes and install Git hooks:

    ```
    npm install
    ```


Also check out the [C Playground's getting started docs](/docs/c_playground/getting_started.md)!.
Next, head to the [Development Workflow](/docs/development_workflow.md) guide.
