ionic-angular-cordova-seed
==========================

How to set up Gabi development environment
1. Install Android SDK
https://developer.android.com/sdk/installing/index.html

2. Add these 2 directories to your PATH environment variable
.../adt-bundle-versionhere/sdk/tools
.../adt-bundle-versionhere/sdk/platform-tools
On Windows, go to Computer -> Properties -> Advanced -> Environment Variables and add the above 2 to the PATH global environment variable.
On Mac do something like this:
export PATH=${PATH}:/Applications/Android/adt-bundle-mac-x86_64-20131030/sdk/tools:/Applications/Android/adt-bundle-mac-x86_64-20131030/sdk/platform-tools

3. Install NodeJS
http://nodejs.org/

4. Follow the steps on the Ionic website:
http://ionicframework.com/getting-started/
npm install -g cordova
npm install -g ionic

5. Install Git
http://git-scm.com/book/en/Getting-Started-Installing-Git

6. Get the Gabi code base from GitHub
cd to your workspace directory and run
git clone https://github.com/dpdonohue/gabion.git

7. On your Android device, go to Settings and turn on USB Debugging

8. Connect your Android device to your computer via USB

9. Run it.  From within your workspace/gabion directory, run
ionic run android

10. To distribute it, your must sign it.
First install Java JDK 7
Next generate the private key in some safe directory where you can always find it, and remember the password
keytool -genkey -v -keystore gabi-release-key.keystore -alias gabi -keyalg RSA -keysize 2048 -validity 10000
Then copy the file StarterApp-release-unsigned.apk into the same directory as the generated gabi-release-key.keystore file
Then run this
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore gabi-release-key.keystore StarterApp-release-unsigned.apk gabi


How to commit changes to GitHub
From your workspace/gabion directory, run these commands
git add .
git commint -m "my message here"
git push


How to pull changes from GitHub
In your workspace/gabion directory, run this
git pull