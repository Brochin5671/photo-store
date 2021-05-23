# Photo-Store

A simple photo storage application using Cordova and Firebase.

## How to Use
* Install dependencies and choose of the available platforms to run (recommended platform is browser)
```
npm install
npm install -g cordova

cordova platform add <platform>
cordova run <platform>
```

### Setting up Your Own Firebase

* Change the configuration in index.html (lines 74-80)
```js
var firebaseConfig = {
    apiKey: "<apiKey>",
    authDomain: "<authDomain>",
    projectId: "<projectId>",
    storageBucket: "<storageBucket>",
    messagingSenderId: "<messagingSenderId>",
    appId: "<appId>",
    measurementId: "<measurementId>"
};
```

* Add the following to your rules:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if resource.size < 100 * 1024;
      allow get;
      allow write;
      allow list;
    }
  }
}
```

* Make sure to have a directory in your storage files called "images"
* Have SDKs downloaded for the appropriate platforms