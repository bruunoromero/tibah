import { init } from "next-firebase-auth";

const firebaseClientInitConfig = {
  apiKey: "AIzaSyD9g8bhA0nyi8Lf1CFagNp4uE6zT2JSjhE",
  databaseURL: "https://tibah-9fa96-default-rtdb.firebaseio.com",
  authDomain: "tibah-9fa96.firebaseapp.com",
  projectId: "tibah-9fa96",
  storageBucket: "tibah-9fa96.appspot.com",
  messagingSenderId: "455211487685",
  appId: "1:455211487685:web:b3521d8f81489ae6f0bbac",
  measurementId: "G-5D5978LN3G",
};

const firebaseAdminInitConfig = {
  credential: {
    projectId: process.env.FIREBASE__PROJECT_ID!,
    clientEmail: process.env.FIREBASE__CLIENT_EMAIL!,
    privateKey: process.env.FIREBASE__PRIVATE_KEY
      ? JSON.parse(process.env.FIREBASE__PRIVATE_KEY)
      : undefined,
  },
  databaseURL: "https://tibah-9fa96-default-rtdb.firebaseio.com",
};

export const initFirebase = () => {
  init({
    authPageURL: "/auth",
    appPageURL: "/app",
    loginAPIEndpoint: "/api/login",
    logoutAPIEndpoint: "/api/logout",
    onLoginRequestError: (err) => {
      console.error(err);
    },
    onLogoutRequestError: (err) => {
      console.error(err);
    },
    firebaseAdminInitConfig,
    firebaseClientInitConfig,
    cookies: {
      name: "Tibah",
      keys: [
        process.env.COOKIE_SECRET_CURRENT,
        process.env.COOKIE_SECRET_PREVIOUS,
      ],
      httpOnly: true,
      maxAge: 12 * 60 * 60 * 24 * 1000,
      overwrite: true,
      path: "/",
      sameSite: "strict",
      secure: false, // set this to false in local (non-HTTPS) development
      signed: true,
    },
    onVerifyTokenError: (err) => {
      console.error(err);
    },
    onTokenRefreshError: (err) => {
      console.error(err);
    },
  });
};
