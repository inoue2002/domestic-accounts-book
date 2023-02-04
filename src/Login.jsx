import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect } from 'react';
import { auth } from '../../firebase';
//import { getAuth, signInWithRedirect } from "firebase/auth";
import { getRedirectResult, GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';

import { signOut } from 'firebase/auth';

const Login = () => {
  const provider = new GoogleAuthProvider();
  const clickLogin = function () {
    signInWithRedirect(auth, provider);
  };
  //
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        console.log(result);
        if (result !== null) {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          console.log(token);
          // The signed-in user info.
          const user = result.user;
          console.log(user);
          console.log(user.uid);
        }
      })
      .catch((error) => {
        console.error(error);
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        console.error(errorCode);
        console.error(errorMessage);
        console.error(email);
        // The AuthCredential type that was used.
        //const credential = GoogleAuthProvider.credentialFromError(error);
      });
  }, []);

  const checkLogint = function () {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        const email = user.email;
        console.log(uid);
        console.log(email);
      } else {
        console.log('signed out');
      }
    });
  };
  checkLogint();
  const clickLogout = async function () {
    signOut(auth)
      .then(() => {
        console.log('ログアウトしました');
      })
      .catch((error) => {
        console.log(`ログアウト時にエラーが発生しました (${error})`);
      });
  };

  return (
    <div>
      <h1>ログイン Google</h1>
      <div>
        <button onClick={() => clickLogin()}>Login</button>
      </div>
      <hr />
      <hr />
      <button onClick={() => clickLogout()}>Logout</button>
    </div>
  );
};

export default Login;
