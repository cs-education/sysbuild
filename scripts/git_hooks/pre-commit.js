#!/usr/bin/env node

const shell = require('shelljs');

shell.echo('Running pre-commit hooks...\n');

const changedFiles = shell
    .exec('git diff --cached --name-only', { silent: true })
    .trim()
    .split('\n')
    .filter((s) => s.length > 0);


/**
 * Ensure files in jor1k are not changed accidentally
 */
const changedFilesInJor1k = changedFiles.filter((s) => /jor1k/.test(s));
if (changedFilesInJor1k.length > 0) {
  shell.echo(
`You are attempting to change the following files in the Jor1k subproject:
  ${changedFilesInJor1k.join('\n')}
This is not recommended! Please contribute your changes to the upstream repository,
then use git subtree to pull your changes.
See https://github.com/cs-education/sysbuild/blob/master/docs/working_with_jor1k.md.
If you are sure you know what you are doing, you can skip this check by running
git commit with the --no-verify flag.`
  );
  shell.exit(1);
}


/**
 * Run ESLint on staged JS files inside webapp/
 *
 * Adapted from: https://gist.github.com/dahjelle/8ddedf0aebd488208a9a7c829f19b9e8
 */
shell.cd('webapp/');

changedFiles
  .filter((s) => /webapp\/.*\.js$/.test(s))
  .forEach((file) => {
    const linterOutput = shell
        .exec('git show :' + file)
        .exec('npm run eslint -- --stdin --stdin-filename ' + file);

    if (linterOutput.code !== 0) {
      shell.echo('ESLint failed on staged file ' + file + '. Please check your code and try again.');
      shell.exit(1); // exit with failure status
    }
  });
