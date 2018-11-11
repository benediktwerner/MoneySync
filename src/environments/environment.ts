// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyAXPGI_pP-aXUJhjTCAHi3R0bMPdHwJ4Wc",
    authDomain: "money-sync.firebaseapp.com",
    databaseURL: "https://money-sync.firebaseio.com",
    projectId: "money-sync",
    storageBucket: "money-sync.appspot.com",
    messagingSenderId: "126122311270"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
