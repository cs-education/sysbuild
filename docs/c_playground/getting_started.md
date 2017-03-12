# Playground Webapp Getting Started


## Setting Up

1.  Globally install [Bower](http://bower.io/) and [gulp](http://gulpjs.com/)
    (you might need to use `sudo` or run the command as an Administrator if it fails due to missing permissions,
    because of the [location npm installs global packages](https://www.npmjs.org/doc/files/npm-folders.html) in):

    ```
    npm install -g bower gulp
    ```

2.  Navigate to the web project inside the repository:

    ```
    cd webapp/
    ```

3.  Install dependencies and set up the project:

    ```
    npm install
    ```

4.  Start a local development server:

    ```
    gulp serve
    ```

5.  Navigate to <http://localhost:8080> in your preferred web browser.


## Directory Structure

```
sysbuild/webapp/
├── src/                      Application source code and other assets
│   ├── app/                  Core application modules
│   ├── bower_modules/        (Runtime) dependencies installed by Bower
│   ├── components/           KnockoutJS components the UI is composed of
│   ├── images/               Image/picture files
│   └── styles/               Sass and CSS files
├── test/                     Test cases, code and configuration
├── dist/                     The distributable application output by the build process
├── node_modules/             (Development process) dependencies installed by npm
├── sys-gh-pages-config/      Config for the application deployed on production
└── gulp-tasks/               Modules containing build tasks and their helpers
```

This project was scaffolded using the Yeoman [Knockout](https://github.com/stevesanderson/generator-ko#readme) generator,
with configuration ideas and code adapted from the [gulp-webapp](https://github.com/yeoman/generator-gulp-webapp#readme)
and [webapp](https://github.com/yeoman/generator-webapp) generators.


## Developing

* Run `gulp serve` to start a local development server, which makes the application available at <http://localhost:8080>.

* `gulp clean` can be used to delete the `dist/` folder (recommended before re-building the project).


## Testing

We use [Karma](https://karma-runner.github.io/0.13/index.html) for running tests.
It has been configured to run tests in the [Chrome web browser](https://www.google.com/chrome/), so you need to have Chrome installed.
If you would like to use another browser, either [configure Karma to use a different launcher](https://karma-runner.github.io/0.13/config/browsers.html),
or [open an issue](#using-the-issue-tracker).

* Run `gulp test` to run the tests once. It will launch an instance of the Chrome browser, run tests in it, and close it automatically.
  If you do not want to launch a GUI browser, run `gulp test:headless` to use [PhantomJS](http://phantomjs.org/) instead.

* Run `gulp tdd` to make Karma watch for changes and automatically run tests whenever source or test files are modified.
  Until you terminate the process, Karma will keep an instance of Chrome running.

* If you want to run the tests in a browser manually instead of using Karma,
  run `gulp serve:test` to start a local test server, then navigate to <http://localhost:8080>.


## Deploying

**NOTE**: You will need push access to the appropriate repository before you can deploy to an official URL.
If you want to deploy to your own repository or server,
only perform the first (build) step and upload the contents of `dist/`
to your repository's `gh-pages` branch or to the web folder on your server.

1.  Build the distributable project (output in the `dist/` folder):

    ```
    gulp build
    ```

2.  Test the built application locally by running the following command and then
    navigating to <http://localhost:8080> in your web browser:

    ```
    gulp serve:dist
    ```

3.  Deploy to [staging](https://cs-education.github.io/sys-staging/):

    ```
    gulp deploy:staging
    ```

4.  Test out the application in staging and ensure things work as expected.
    Once things look good, please announce in the chat room that you are going to deploy to production.

5.  Deploy to [production](https://cs-education.github.io/sys/):

    ```
    gulp deploy:prod
    ```
