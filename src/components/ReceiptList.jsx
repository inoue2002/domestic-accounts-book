// DBからリアルタイムでevent/receptの情報を取得する
// 常に反映させる

import { collection, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebase';

const ReceiptList = (props) => {
  const eventId = props.eventId;
  const [receiptList, setReceiptList] = useState([]);

  useEffect(() => {
    const usersCollectionRef = collection(db, `events/${eventId}/receipt`);
    const unsub = onSnapshot(usersCollectionRef, (querySnapshot) => {
      console.log('検知しました');
      setReceiptList(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      console.log(receiptList.length);
    });
    return unsub;
  }, [eventId, receiptList.length]);

  //   const q = query(collection(db, `events/${eventId}/receipt`));
  //   const unsubscribe = onSnapshot(q, async (querySnapshot) => {
  //     for (let change of querySnapshot.docChanges()) {
  //       console.log(eventId, change.type);
  //       if (change.type === 'added') {
  //         // データが追加された時
  //         // もしくは最初の呼び出し
  //         const receipt = [];
  //         querySnapshot.forEach((doc) => {
  //           console.log('見つかりました', doc.data());
  //           receipt.push({ ...doc.data(), id: doc.id });
  //         });
  //         setReceiptList(receipt);
  //       } else if (change.type === 'modified') {
  //         // データが変更された時
  //       } else if (change.type === 'removed') {
  //         // データが削除された時
  //       }
  //     }
  //   });

  return (
    <div className="flex flex-col justify-start">
      <div className="flex w-full justify-start">
        <div className="p-5 font-bold">レシートリスト</div>
      </div>
      <div className="p-5 flex justify-center flex-col items-center">
        {receiptList.map((receipt, index) => (
          <div className="w-11/12 h-20 border border-l-neutral-500 flex justify-start items-center pl-3" key={index}>
            <img src={receipt.imageUrl} alt="" className="w-10 h-10" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReceiptList;
