import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth } from '../firebase';

const Signin = () => {
  const [user, loading, error] = useAuthState(auth);

  const signInWithGoogle = () => {
    // Googleプロバイダオブジェクトのインスタンスを作成
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    // ポップアップウィンドウでログインを行う場合はsignInWi
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;

        // DBにユーザー情報が登録されているかどうか確認する
        const userDocumentRef = doc(db, 'users', user.uid);
        getDoc(userDocumentRef).then(async (documentSnapshot) => {
          // まだ登録されていない場合は新しく追加する
          if (!documentSnapshot.exists()) {
            await setDoc(userDocumentRef, {
              eventId: [],
              imageUrl: user.photoURL,
            });
          }
        });
      })
      .catch((error) => {
        // Handle Errors here.
        // const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        // const email = error.customData.email;
        // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
        console.error({ errorMessage });
      });
  };

  return (
    <div>
      {!user && !loading ? (
        <div className="justify-center items-center h-[90vh] flex">
          <div className="signin_button">
            <button
              type="button"
              class="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2"
              onClick={() => signInWithGoogle()}
            >
              <svg
                class="w-4 h-4 mr-2 -ml-1 flex"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="google"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                ></path>
              </svg>
              Sign in with Google
            </button>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default Signin;
