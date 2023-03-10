// パスのイベントIDを取得する
// イベントIDを用いてDBから情報を取得

import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';

import { doc, getDoc } from 'firebase/firestore';
import { Link, useParams } from 'react-router-dom';
import Camera from './Camera';

import { getUser } from '../useFirestore';
import Header from './Header';
import Members from './Members';
import ReceiptList from './ReceiptList';

// イベントがある場合は、dbのrecentEventIdを該当のeventIDに書き換える

// 家計簿から退出する

// イベントの削除（）

const Event = () => {
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

  return (
    <>
      <Header eventId={eventId} />
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
          <img src={hostUser.imageUrl} alt=""  className='w-10 h-10 rounded-full'/>
        </div>
      ) : (
        ''
      )} */}
        <Members eventId={eventId} eventState={eventState} />
        <Camera eventId={eventId} />
        <ReceiptList eventId={eventId} />
      </div>
    </>
  );
};

export default Event;
