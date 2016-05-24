# Working with the Jor1k Project

The `jor1k/` directory contains the jor1k source obtained from the upstream repository,
[s-macke/jor1k](https://github.com/s-macke/jor1k). The `jor1k/` directory was added using
git subtree. This allows full control and editing of the jor1k source, while also
helping to keep in sync with updates and changes to the upstream repository.

Learn more about git subtrees and working with them
[here](http://blogs.atlassian.com/2013/05/alternatives-to-git-submodule-git-subtree/).

For those interested, the exact command used to import Jor1k was:  
`git subtree add --prefix=jor1k/ s-macke-jor1k master --squash`

To work with this setup, you need to add a new git remote to make it easier to refer
to the upstream repository. Note that this is automatically done by the setup script for you:  
`git remote add -f s-macke-jor1k https://github.com/s-macke/jor1k.git`

Then use the following commands for working with the subproject:
* To compare what is in your `jor1k/` subdirectory with what the master branch on the upstream
  was the last time you fetched, you can run:  
  `git diff-tree --patch s-macke-jor1k/master`

* To update the subproject with the upstream changes (automatically performs a merge commit):  
  `git subtree pull --prefix=jor1k/ s-macke-jor1k master --squash`
