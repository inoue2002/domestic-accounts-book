import { signOut } from 'firebase/auth';
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { AiFillSetting } from 'react-icons/ai';
import { useNavigate, useParams } from 'react-router-dom';
import { auth } from '../firebase';
import { leaveEvent } from '../useFirestore';

const Header = () => {
  const { eventId } = useParams();
  const [user] = useAuthState(auth);
  const [userDropdown, setUserDropdown] = useState(false);

  const navigate = useNavigate();

  const leave = () => {
    leaveEvent(user.uid, eventId);
    navigate('/');
  };

  return (
    <div className="w-full h-12 bg-slate-400 flex">
      <div className="flex items-center justify-start w-2/3" onClick={() => navigate('/')}>
        <div className="m-2">レシート家計簿</div>
      </div>
      <div className="flex items-center justify-end w-1/3">
        <div className="m-2">
          {user ? (
            <div>
              <AiFillSetting
                className="z-20 w-8 h-8 rounded-full cursor-pointer"
                onClick={() => {
                  setUserDropdown(!userDropdown);
                }}
              />
              {userDropdown ? (
                <div>
                  <div className="relative">
                    <div className="absolute right-0 z-10 w-56 mt-4 origin-top-right bg-white border border-gray-100 rounded-md shadow-lg">
                      <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        <div>{user.displayName}</div>
                        <div className="font-medium truncate">{user.email}</div>
                      </div>
                      <ul
                        className="py-2 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdownInformationButton"
                      >
                        {eventId ? (
                          <>
                            {' '}
                            <li>
                              <div
                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                onClick={() => navigate('/')}
                              >
                                ホームに戻る
                              </div>
                            </li>
                          </>
                        ) : (
                          ''
                        )}
                        {eventId ? (
                          <>
                            <li>
                              <div
                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                onClick={() => leave()}
                              >
                                グループから退出する
                              </div>
                            </li>
                          </>
                        ) : (
                          ''
                        )}
                      </ul>
                      <div className="py-2">
                        <button
                          onClick={() => signOut(auth)}
                          className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        >
                          ログアウト
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ''
              )}
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
      {/* onClick={() => signOut(auth)}  */}
    </div>
  );
};

export default Header;
