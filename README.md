# sysbuild #
[![Build Status](https://travis-ci.org/cs-education/sysbuild.svg?branch=master)](https://travis-ci.org/cs-education/sysbuild)
[![Dependency Status](https://gemnasium.com/cs-education/sysbuild.svg)](https://gemnasium.com/cs-education/sysbuild)
[![HuBoard task board for this project](https://img.shields.io/badge/Hu-Board-7965cc.svg)](https://huboard.com/cs-education/sysbuild)
[![Join the chat at https://gitter.im/cs-education/sysbuild](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/cs-education/sysbuild?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

This is the main repository for the browser-based system programming learning environment developed at the [University of Illinois](http://illinois.edu/).
Also known as the Linux-in-a-browser project, this tool is used in the [CS 241 (System Programming)](https://courses.engr.illinois.edu/cs241/) course
at the University.

View the project live [here](http://cs-education.github.io/sys/).

Other repositories which are part of the project are:
* cs-education/jor1k - Powers the virtual machine
* cs-education/sysassets - Precompiled assets used in the project, such as lessons, videos, man pages, and the jor1k filesystem
* cs-education/sys-staging - Staging deployment for the project, used for testing before deploying to production
* cs-education/sys - Production deployment for the project

Use the [issue tracker](https://github.com/cs-education/sysbuild/issues) to submit bug reports and feature requests.
If you would like to work on this project, continue reading to get started.

## Project folder structure ##
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

## Contributing ##

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
Dr. Lawrence Angrave [github.com/angrave](http://github.com/angrave)  

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

## License ##
This project is licensed under a modified version of the University of Illinois/NCSA Open Source License.
See [LICENSE.md](LICENSE.md) for license, attribution and other legal information.
