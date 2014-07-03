ionic-angular-cordova-seed
==========================

## How to set up Gabi development environment ##

#### 1. Install Android SDK ####
https://developer.android.com/sdk/installing/index.html

#### 2. Add these 2 directories to your PATH environment variable ####
.../adt-bundle-versionhere/sdk/tools and
.../adt-bundle-versionhere/sdk/platform-tools
  On Windows, go to Computer -> Properties -> Advanced -> Environment Variables and add the above 2 to the PATH global environment variable.
  On Mac do something like this:
  export PATH=${PATH}:/Applications/Android/adt-bundle-mac-x86_64-20131030/sdk/tools:/Applications/Android/adt-bundle-mac-x86_64-20131030/sdk/platform-tools

#### 3. Install NodeJS from here: ####
http://nodejs.org/

#### 4. Install Apache Ant ####
On Mac, this might be already installed.  If not easy enough.  On Windows, see here:
http://wiki.apache.org/ant/AntOnWindows

#### 5. Follow the steps on the Ionic website: ####
http://ionicframework.com/getting-started/  Specifically, run these 2 commands
```
    npm install -g cordova
    npm install -g ionic
```

#### 6. Install Git: ####
http://git-scm.com/book/en/Getting-Started-Installing-Git

#### 7. Get the Gabi code base from GitHub.  You will need a GitHub account, and to be added to the gabi2 project. ####
Create a directory "gabi2" within your workspace directory.  cd into the gabi2 directory.  Next, run:
```
    git clone https://github.com/dpdonohue/gabi2.git
```

#### 8. On your Android device, go to Settings and turn on USB Debugging ####

#### 9. Connect your Android device to your computer via USB ####

#### 10. Run it.  From within your gabi2 directory, run: ####
``` ionic serve ```
This runs the app in a browser.  You can see the console output by clicking CMD-OPT-i (Mac) or CTRL-SHIFT-i (Windows).
The other 2 ways of running the app do not provide much of a way  to see the console or much error info.
``` ionic run android ```
This will run it on a connected device or (if nothing connected) on the Android emulator
``` ionic emulate android ```
This will run it on the Android emulator.

#### 11. To distribute it, your must sign it. ####
* (a) First install Java JDK 7
* (b) Next generate the private key in some safe directory where you can always find it, and remember the password
```
    keytool -genkey -v -keystore gabi-release-key.keystore -alias gabi -keyalg RSA -keysize 2048 -validity 10000
```
* (c) Build it
```
    cordova build --release android
```
* (d) Then copy the file Gabi-release-unsigned.apk into the same directory as the generated gabi-release-key.keystore file
* (e) Then run this:
```
    jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore gabi-release-key.keystore Gabi-release-unsigned.apk Gabi
```
* (f) You might need to copy the executable zipalign from the
/Android-adt-directory/sdk/tools
directory into the current directory.
Next you can run this
```
    ./zipalign -v 4 Gabi-release-unsigned.apk Gabi.apk
```

* (g) email this file to your testers' gmail accounts.
* (h) Testers should open this email on their Android device, and click "Download" button, then "Install"

How to commit changes to GitHub:
From your gabi2 directory, run these commands:
```
    git add .
    git commit -m "my message here"
    git push
```

## How to pull changes from GitHub ##
In your gabi2 directory, run this:
```
git pull
```

## How to install Cordova plugins ##
### Speech Recognizer for Android ###
cordova plugin add https://github.com/poiuytrez/SpeechRecognizer
### Cordova media plugin (for playing audio files from Google TTS) ###
cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-media.git
### File plugin ###
cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-file.git
cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-file-transfer.git


## If you upgrade anything ##
If you upgrade Ionic framework and/or Cordova
```
sudo npm update -g ionic
sudo npm update -g cordova
```
...then need to rebuild the project probably.
Follow instructions here
http://ionicframework.com/docs/guide/installation.html
Specifically:
```
ionic start gabix blank
cd gabix
ionic platform android
```
Next, copy all your code and customizations into the new app.  E.g. add your customizations into index.html, style.css, config.xml.
Add your new files and directories to the www folder.