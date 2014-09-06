# jor1k disk images #
This folder contains the disk images used by jor1k for this project. The disk images are `ext2` filesystems compressed into `.bz2` archives.

## Adding/editing/deleting files from the filesystem ##
If you use a Mac, see the next section on how to mount `ext2` images. The following instructions are for a GNU/Linux system.

```sh
$ bzip2 -dk <img_file>.bz2 # extract file
$ mkdir <mountpoint> # create a folder to mount image to
$ sudo mount <img_file> <mountpoint>` # mount the extracted image file
$ # ... do stuff ...
$ sudo umount <mountpoint> # unmount the image
$ bzip2 <img_file> # compress the image back
$ git add <img_file>.bz2 # Stage the modifications
$ git commit -m "Added files to disk image, etc"
```

Currently the sys project uses the `hdgcc-mod.bz2` file for the user disk image. Inside the disk image, the home folder is `/root`. Commands for modifying/adding files to the filesystem need to prefixed with `sudo`, because the image was mounted by root.

Also, if you create/edit/add files, chances are the permissions and owner will be incorrect, because the filesystem is being edited on another system. So, fix the permissions and owners using the `chmod` and `chown` commands respectively. A convenient way to copy the permissions and ownership from an existing file, using the following commands (replace `.profile` if you want to reference permissions and ownership from another file):
```sh
$ sudo chown --reference .profile <your_new_file>
$ sudo chmod --reference .profile <your_new_file>
```


### How to mount ext2, ext3 images on a Mac ###

Warning: EXT write support is experimental.  
Following steps taken from <http://osxdaily.com/2014/03/20/mount-ext-linux-file-system-mac/>.

1. Download and install [FUSE for OS X](http://osxfuse.github.io/). Enable compatability layer option during installation.

2. Download and install [FUSE-Ext2](http://sourceforge.net/projects/fuse-ext2/?source=dlp).

3. Restart your mac.

4. Use the following command to enable write support:

    ```sh
    sudo sed -e 's/OPTIONS="auto_xattr,defer_permissions"/OPTIONS="auto_xattr,defer_permissions,rw+"/' -i .orig /System/Library/Filesystems/fuse-ext2.fs/fuse-ext2.util
    ```

5. Mount the partition:

    ```sh
    fuse-ext2 -o force ThePartition /Volumes/mountpoint
    ```
