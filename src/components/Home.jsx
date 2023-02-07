import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { createEvent, getEvent, joinEvent } from '../useFirestore';
import Header from './Header';
import Signin from './Signin';

const Home = () => {
  // ユーザーのDBを確認しに行って、それぞれのイベントへのパスを生成する
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const [userJoinEvent, setUserJoinEvent] = useState([]);
  const [inputEventId, setInputEventId] = useState('');
  useEffect(() => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    getDoc(userRef).then((user) => {
      setUserJoinEvent(user.data().join);
    });
    setLoading(false);
  }, [user, userJoinEvent.length]);

  const newEvent = async () => {
    try {
      // DBにイベントを作成
      const eventId = await createEvent(user.uid);
      joinEvent(user.uid, eventId);
      // イベントページに遷移する
      navigate(`/event/${eventId}`);
    } catch (e) {
      console.log(e);
      console.error('イベントの作成に失敗しました。');
    }
  };

  const join = async () => {
    // dbにイベントがあるか確認しに行く
    //　イベントがあった場合ユーザー情報のjoinEventにeventIDを追加
    // イベントのmemberにuserIdを追加
    // イベントページに遷移
    try {
      const targetEvent = await getEvent(inputEventId);
      if (targetEvent == null) {
        setInputEventId('');
      }
      joinEvent(user.uid, inputEventId);
      navigate(`/event/${inputEventId}`);
    } catch (e) {
      console.log(e);
      // イベント情報がない場合はエラーメッセージを出す
      // inputEventIdを初期値に戻す
      setInputEventId('');
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col justify-start items-start">
        {user && userJoinEvent.length !== 0 ? <div className="m-4 flex">参加している家計簿</div> : ''}
        {user && !loading && userJoinEvent.length === 0 ? (
          <div className="m-6">まだ参加している家計簿はありません。新しく作るか、友達に招待してもらいましょう。</div>
        ) : (
          ''
        )}
        {user && userJoinEvent.length !== 0 ? (
          <div className="ml-4">
            {userJoinEvent.map((val) => (
              <li className="list-none" key={val} onClick={() => navigate(`event/${val}`)}>
                {val} &gt;
              </li>
            ))}
          </div>
        ) : (
          ''
        )}
        {user ? (
          <div className="m-4 flex bg-red-400" onClick={() => newEvent()}>
            新しい家計簿を作成
          </div>
        ) : (
          ''
        )}
        {user ? <div className="m-4  flex">友達の家計簿に参加する</div> : ''}
        {user ? (
          <div className="m-4">
            <input
              type="text"
              className="border border-l-sky-300"
              value={inputEventId}
              onChange={(event) => setInputEventId(event.target.value)}
            />
            <button className="ml-4" onClick={() => join()}>
              決定
            </button>
          </div>
        ) : (
          ''
        )}
        {!user ? <div className='flex justify-center items-center w-full'>
          <Signin />
          </div>
             : ''}
      </div>
    </>
  );
};

export default Home;
