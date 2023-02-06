import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth } from '../firebase';

import googleSiginImage from '../assets/images/btn_google_signin_light_normal_web.png';

const Signin = () => {
  const [user,loading,error] = useAuthState(auth);

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

        // TODO - useFirestoreに移動する
        // DBにユーザー情報が登録されているかどうか確認する
        const userDocumentRef = doc(db, 'users', user.uid);
        getDoc(userDocumentRef).then(async (documentSnapshot) => {
          // まだ登録されていない場合は新しく追加する
          if (!documentSnapshot.exists()) {
            await setDoc(userDocumentRef, {
              eventId: [],
            });
          }
        });
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
      {!user && !loading ? (
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
