NewPointe Mobile App
====================
This is the mobile app for NewPointe Community Church. It's made with [Nativescript {N}](https://www.nativescript.org/) using [Typescript](https://www.typescriptlang.org/) and [Angular](https://angular.io/)

&nbsp;

Table of Contents
=================
<!-- TOC -->

- [Nativescript Setup](#nativescript-setup)
- [Project Setup](#project-setup)
- [Running the Project](#running-the-project)
- [Images/Asset Generation](#imagesasset-generation)
- [Packaging for Appstores](#packaging-for-appstores)
    - [Android](#android)
    - [iOS](#ios)

<!-- /TOC -->

&nbsp;

# Nativescript Setup
Setup Instructions can be found at [http://docs.nativescript.org/angular/start/quick-setup](http://docs.nativescript.org/angular/start/quick-setup). A summary is provided here for convenience:

1. Install [Node.js](https://nodejs.org)
    - [win] Use installer from website.
    - [OSx] `brew install node`
    - [Linux] `apt-get install node`
2. [OSx] Install Xcode and the Xcode CLI tools
    - XCode is available in the apple app store
    - Once Xcode is installed, open it, go to Xcode -> Preferences -> Locations and use the 'Command Line Tools' dropdown.
    - If you want to debug with Simulator, you'll also need to go to Xcode -> Preferences -> Components and install the version you want to test with.
3. Install the Nativescript CLI
    - `npm install -g nativescript`
    - If you get an EACESS error, you need to [fix you npm permissions](https://docs.npmjs.com/getting-started/fixing-npm-permissions). This usualy happens when you use node's installer instead of your OS's package manager.
    - The installer will ask if you want to run the setup script. This will install all the extra stuff you'll need to build and test iOS/Android apps

&nbsp;

# Project Setup
1. Clone this repo
    - `git clone https://github.com/NewPointe/NewPointe-Mobile-App-Public.git`
    - `cd NewPointe-Mobile-App-Public`
2. Setup nativescript and dependancies
    - `tns install`
3. ????
4. Profit!

But seriously, that's all you should need to do.

&nbsp;

# Running the Project
From there you can use the `tns` commands to build and run the project:
```shell
tns run <platform> [--emulate]      # Runs the project on any connected devices. If you use the --emulator flag or don't have a device connected it will launch it in an emulator.
tns emulate <platform>              # Shortcut for ^ with the --emulator flag
tns livesync <platform> --watch     # Similar to run, but will automagicaly sync new changes to the device as you save them.

# <platform> can be either 'ios' or 'android', or you can leave it blank to run both at the same time
```

If you mess with dependancies/plugins you will need to do
```shell
tns platform remove ios && tns platform remove android && tns platform add ios && tns platform add android
```
to force it to re-package them when it builds.

&nbsp;

# Images/Asset Generation
I've written a small script to automate generating some assets like the app icon from SVGs. These are located in `/app/App_Resources/SVGs`.

To generate assets from SVGs:
```shell
cd /app/App_Resources/SVGs
node pngGen.js
```

**Caveats:**  
The script uses `inkscape` from the command line to generate the pngs. If you are on Windows or want to use a different program you will need to edit the `getCommandLine` functions at the top of the script. Also note that some of the SVG's have background colors that are inkscape-specific and won't show up when using a different program.

**How it works:**  
The script looks for `*.gen.txt` definitions in the current directory. The file name should match the name of the source SVG. Each line in the gen file specifies a conversion to do.  

Lines can have the following formats:  
 - `[width]x[height] [outputFile]` - generates a png with the specified width and height and saves it as outputFile. If the svg has a different aspect ratio it will get streached.  
 - `[width]x[height]-[originalWidth]x[originalHeight] [outputFile]` - same as ^ but uses the original width/height to center and contain it within the new dimensions.  

You can also use a scaling factor in place of dimensions - in this case it will use the last seen dimension and apply the scale. For example:  
```
100x100 outFile1.png
x2 outFile2.png
x3 outFile3.png
```
Will generate 3 files, 100x100, 200x200, and 300x300 respectively.

# Packaging for Appstores

## Android
[http://docs.nativescript.org/publishing/publishing-android-apps](http://docs.nativescript.org/publishing/publishing-android-apps)

Basicly:  
Build a signed apk with
```
tns build android --release --key-store-path NewPointeCommunityChurch.keystore --key-store-password AAAAAAAA --key-store-alias NewPointeCommunityChurch --key-store-alias-password AAAAAAAA
```
It should save it as `./platforms/android/build/outputs/apk/NewPointeCommunityChurch-release.apk`. Just upload it to the play store.


## iOS
[http://docs.nativescript.org/publishing/publishing-ios-apps](http://docs.nativescript.org/publishing/publishing-ios-apps)