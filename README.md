# floor-is-water
Game about not touching the water. 


# Building and running the project 

To build and run the project the user needs to have the following:
* At least node v14
* Cordova
* Gradle
* Android SDK 


Client and Server sides have to be runnning simultaneously

For the **Client** side:
```
npm install
```

Add platforms you want to test on to cordova:
```
cordova platform add browser
cordova platform add android
```

The cordova project then has to be built via:
```
cordova build -- --webpackConfig webpack.config.js 
 ```

The project is then ready to run and can be ran on either Android or browser: 
```
cordova run browser
cordova run android

//Add the -- --livereload flag for refresh on file change
cordova run browser -- --livereload
cordova run android -- --livereload
 ```
 
 
For the **server** side:
```
npm install
npm start
```
