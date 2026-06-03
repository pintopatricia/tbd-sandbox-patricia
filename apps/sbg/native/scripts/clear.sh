#!/bin/sh
## Usage:
## iOS
##  • Clear Pods and build: ./clear.sh ios
##  • Clear and delete Podfile.lock and yarn.lock: ./clear.sh ios --delete-lock-files
## Android
##  • Clear Project: ./clear.sh android
##  • Clear and delete yarn.lock: ./clear.sh android --delete-lock-files

delete_lock_files=false

if [ -n "$2" ]
then
    case "$2" in
        --delete-lock-files)
            delete_lock_files=true
            ;;
        *)
            echo "$2 is not a recognized flag!"
            ;;
    esac
fi

if [ $delete_lock_files == true ]
then
    rm yarn.lock
fi

if [ $1 == "ios" ]
then
    rm -rf ios/build
    rm -rf ios/Pods
    pod cache clean --all

    if [ $delete_lock_files == true ]
    then
        rm ios/Podfile.lock
    fi
elif [ $1 == "android" ]
then
    cd ./android
    if [ -e ./gradlew ] 
    then
        rm -rf ~/.gradle/caches
        ./gradlew clean
        cd ..
    else
        echo "'gradlew' not found"
    fi
fi

rm -rf node_modules
rm -rf $TMPDIR/metro-cache
watchman watch-del-all

echo "Clear successful!"