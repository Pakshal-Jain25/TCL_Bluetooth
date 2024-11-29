import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
// import { getAuth, provideAuth } from '@angular/fire/auth';

// const firebaseConfig = {
//   apiKey: "AIzaSyCCgpRb5YWtkvk5T0uJUkRkoZJ83NGk0LY",
//   authDomain: "tata-51083.firebaseapp.com",
//   projectId: "tata-51083",
//   storageBucket: "tata-51083.appspot.com",
//   messagingSenderId: "929140804152",
//   appId: "1:929140804152:web:20c37f9f3a6aa192d574cd",
//   measurementId: "G-Z2JW129NJ2"
// };

// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    // importProvidersFrom(
    //   provideFirebaseApp(() => initializeApp(firebaseConfig)),
    //   provideAuth(() => getAuth())
    // )
  ],
};
