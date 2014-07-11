
# Want something that works the first time as well as for updates...
git submodule init
git submodule update
(cd web/jor1k; git checkout experimental-gcc-errors; git pull)

# Original prebuilt hdgcc.bz2 is from Sebastian Macke (of jor1k). May eventually be replaced by ouw own linux disk image
rsync images/hdgcc-mod.bz2 web/bin/
