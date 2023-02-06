// パスのイベントIDを取得する
// イベントIDを用いてDBから情報を取得

import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';

import { doc, getDoc } from 'firebase/firestore';
import { Link, useParams } from 'react-router-dom';
import Camera from './Camera';

// イベントがある場合は、dbのrecentEventIdを該当のeventIDに書き換える

// ホームに戻る

// 家計簿から退出する

// イベントの削除（）

const Event = () => {
  // カメラ
  const [user] = useAuthState(auth);
  const { eventId } = useParams();
  const [eventState, setEventState] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    console.log('起動');
    if (!user) return;
    try {
      const eventRef = doc(db, 'events', eventId);
      getDoc(eventRef).then((event) => {
        console.log(event.data());
        setEventState(event.data());
      });
      setLoading(false);
    } catch (e) {
      return;
    }
  }, [eventId, user]);
  // 最近のレシートの投稿が見れる

  return (
    <div>
      <div>イベントページ</div>
      {eventState ? (
        `イベントがありました${eventState.host}`
      ) : (
        <div>
          イベントが見つかりませんでした。<Link to="/">ホームに戻る</Link>
        </div>
      )}
      <Camera eventId={eventId} />
    </div>
  );
};

export default Event;
