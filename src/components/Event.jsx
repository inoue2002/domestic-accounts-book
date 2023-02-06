// パスのイベントIDを取得する
// イベントIDを用いてDBから情報を取得

import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';

import { AiFillHome } from 'react-icons/ai';

import { doc, getDoc } from 'firebase/firestore';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Camera from './Camera';

import { getUser } from '../useFirestore';
import ReceiptList from './ReceiptList';

// イベントがある場合は、dbのrecentEventIdを該当のeventIDに書き換える

// 家計簿から退出する

// イベントの削除（）

const Event = () => {
  const navigate = useNavigate();
  // カメラ
  const [user] = useAuthState(auth);
  const { eventId } = useParams();
  const [eventState, setEventState] = useState({});
  const [hostUser, setHostUser] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    console.log('起動');
    if (!user) return;
    try {
      const eventRef = doc(db, 'events', eventId);
      getDoc(eventRef).then(async (event) => {
        console.log(event.data());
        setEventState(event.data());
        const hostUser = await getUser(eventState.host);
        setHostUser(hostUser);
        console.log(hostUser);
      });
      setLoading(false);
    } catch (e) {
      return;
    }
  }, [eventId, eventState.host, user]);
  // 最近のレシートの投稿が見れる

  return (
    <div>
      {!eventState ? (
        <div>
          イベントが見つかりませんでした。<Link to="/">ホームに戻る</Link>
        </div>
      ) : (
        ''
      )}
      {/* {eventState && hostUser ? (
        <div>
          <div>ホストユーザー</div>
          <img src={hostUser.imageUrl} alt=""  className='rounded-full w-10 h-10'/>
        </div>
      ) : (
        ''
      )} */}
      <div className="p-5">
        <div
          className="flex items-center justify-center border border-l-neutral-500 rounded-md w-40 h-12"
          onClick={() => navigate('/')}
        >
          <AiFillHome />
          <div className="ml-2">ホームに戻る</div>
        </div>
      </div>
      <Camera eventId={eventId} />
      <ReceiptList eventId={eventId} />
    </div>
  );
};

export default Event;
