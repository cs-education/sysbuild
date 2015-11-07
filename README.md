# sysbuild
[![Build Status](https://travis-ci.org/cs-education/sysbuild.svg?branch=master)](https://travis-ci.org/cs-education/sysbuild)
[![Dependency Status](https://gemnasium.com/cs-education/sysbuild.svg)](https://gemnasium.com/cs-education/sysbuild)
[![HuBoard task board for this project](https://img.shields.io/badge/Hu-Board-7965cc.svg)](https://huboard.com/cs-education/sysbuild)
[![Join the chat at https://gitter.im/cs-education/sysbuild](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/cs-education/sysbuild?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

This is the main repository for the browser-based system programming learning environment developed at the [University of Illinois](http://illinois.edu/).
Also known as the Linux-in-a-browser project, this tool is used in the [CS 241 (System Programming)](https://courses.engr.illinois.edu/cs241/) course
at the University.

View the project running live [here](http://cs-education.github.io/sys/).

## Bugs and feature requests
Use the [issue tracker](https://github.com/cs-education/sysbuild/issues) to submit bug reports and feature requests.
Please see the [issue guidelines](CONTRIBUTING.md#using-the-issue-tracker) for helpful information.

## Community and Collaboration
* We have an official public chat room on [Gitter](https://gitter.im/). You can use it to chat with the project owners,
  discuss ideas, and ask for help. You can join the chat [here](https://gitter.im/cs-education/sysbuild) (the Gitter
  badge at the top of this README provides a quick shortcut to the chat room).

* The core team uses [HuBoard](https://huboard.com/) for task management. View the task board
  [here](https://huboard.com/cs-education/sysbuild) to see the status and progress of the project (the HuBoard badge at
  the top of this README provides a quick shortcut to the board).

## Contributing
Please read through our [contributing guidelines](CONTRIBUTING.md). Included are directions for opening issues, setting
up your development environment, opening pull requests, coding standards, and notes on development.

If you would like to work on this project, here is more information on what you need to know to get started.

### Project organization
This is the main repository for the project. Other repositories which are part of the project are:

* [cs-education/jor1k](https://github.com/cs-education/jor1k) - The virtual machine embedded into the browser

* [cs-education/sysassets](https://github.com/cs-education/sysassets) - Pre-compiled assets used in the project, such
  as lecture videos, lessons, man pages, and the jor1k filesystem

We use [GitHub Pages](https://help.github.com/articles/what-are-github-pages) for hosting the application. The
repositories used for deployment are separate from this repository, to keep this repository small. You probably won't
be committing changes directly to these repositories, but instead use automated deployment scripts (see
[Deploying](#deploying) below). The following repositories are used for deployment:  

* [cs-education/sys-staging](https://github.com/cs-education/sys-staging) - Staging deployment for the project, used
  for testing before deploying to production

* [cs-education/sys](https://github.com/cs-education/sys) - Production deployment for the project

### Structure of this repository
```
sysbuild/
├── app/                      Application source code
│   ├── images/               Images/pictures
│   ├── jor1k/                The jor1k project source copied by grunt during setup
│   ├── scripts/              Javascript files
│   └── styles/               SASS and CSS files
├── dist/                     The distributable application output by the build process
├── bower_components/         Dependencies installed by Bower
├── node_modules/             Dependencies installed by npm
├── sys-gh-pages-config/      Config for the application deployed on production
└── test/                     Tests
    └── spec/
```

This project was scaffolded using the [Yeoman webapp generator](https://github.com/yeoman/generator-webapp).

### Deploying
NOTE: You will need push access to the appropriate repository before you can deploy to an official URL. If you want
to deploy to your own repository or server, only perform the first (build) step and upload the contents of `dist/`
to your repository's `gh-pages` branch or to the web folder on your server.

1.  Build the distributable project (output in the `dist/` folder):  
    `grunt build`

2.  Deploy to [staging](http://cs-education.github.io/sys-staging/):  
    `grunt deploy:staging`

3.  Test out the application in staging and ensure things work as expected. Once things look good, please announce in
    the chat room that you are going to deploy to production.

4.  Deploy to [production](http://cs-education.github.io/sys/):  
    `grunt deploy:prod`

### Further documentation
See the [Wiki](https://github.com/cs-education/sysbuild/wiki) for information about the technology stack used,
project road maps, learning resources, and other information.

## Credits
See [CREDITS.md](CREDITS.md).

## License
See [LICENSE.md](LICENSE.md) for copyright, license, attribution and other legal information.
