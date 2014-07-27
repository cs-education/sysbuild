
# Want something that works the first time as well as for updates...
git submodule init
git submodule update
(cd app/jor1k; git checkout master; git pull)

# Original prebuilt hdgcc.bz2 is from Sebastian Macke (of jor1k). May eventually be replaced by ouw own linux disk image
rsync images/hdgcc-mod.bz2 app/bin/
