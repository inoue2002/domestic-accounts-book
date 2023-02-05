import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth } from '../firebase';

import googleSiginImage from '../assets/images/btn_google_signin_light_normal_web.png';

const Signin = () => {
  const [user] = useAuthState(auth);

  const signInWithGoogle = () => {
    // Googleプロバイダオブジェクトのインスタンスを作成
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    // ポップアップウィンドウでログインを行う場合はsignInWi
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.error({ errorMessage });
      });
  };

  return (
    <div>
      {!user ? (
        <div className="flex justify-center items-center h-[90vh]">
          <div className="signin_button">
            <img src={googleSiginImage} onClick={() => signInWithGoogle()} alt="google signin" />
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default Signin;