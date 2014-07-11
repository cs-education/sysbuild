#!/bin/bash
if [ ! -f ./util/publish.sh ] ; then
    echo 'wrong dir'
    exit 1
fi

TGT=../sys

if [ ! -d $TGT/ ] ; then
    echo "No web target directory $TGT"
    exit 1
fi

CURRENTBRANCH=`git rev-parse --abbrev-ref HEAD`
EXPECTEDBRANCH='master'
if [ "$CURRENTBRANCH" != "$EXPECTEDBRANCH" ] ; then
    echo "Expected branch $EXPECTEDBRANCH , but found $CURRENTBRANCH"
    exit 2
fi

GITSTATUS=$(git status --porcelain)

if [ -n "$GITSTATUS" ]; then 
    echo "Commit your changes first:"
    echo $GITSTATUS
    exit 3
fi
echo "Syncing"
rsync --delete --exclude '*.DS_Store'  --exclude '*.git'  -av web/ $TGT
mv $TGT/index.html $TGT/index2.html 
#perl -p -i -e "s/WebTrafficAnalyticsHere/script/g"  $TGT/index2.html

rsync -av LICENSE.txt $TGT/

# Copy $TGT specific files here 
#cp -pr sys-gh-pages-config/ $TGT/

# Remove unnecessary files here
# rm $TGT/_*


#Compile steps here...

#Stamp

date >$TGT/publish-date.txt
git log -n 5 --oneline >$TGT/publish-recentcommits.txt



( cd $TGT; git add -A . )
( cd $TGT; git commit -m 'Publish' )

echo "$TGT files commited locally. Final step: Just copy-paste the following to publish"
echo \( cd $TGT\; git push origin gh-pages \)
