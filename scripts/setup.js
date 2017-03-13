#!/usr/bin/env node

const shell = require('shelljs');

shell.exec('git remote add upstream https://github.com/cs-education/sysbuild.git');
shell.exec('git remote add -f s-macke-jor1k https://github.com/s-macke/jor1k.git');
