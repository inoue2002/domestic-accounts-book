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
      setReceiptList(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsub;
  }, [eventId, receiptList.length]);

  return (
    <div className="flex flex-col justify-start">
      <div className="flex justify-start w-full">
        <div className="p-5 font-bold">レシートリスト</div>
      </div>
      <div className="flex flex-col items-center justify-center p-5">
        {receiptList.map((receipt, index) => (
          <div className="flex items-center justify-start w-11/12 h-20 pl-3 border border-l-neutral-500" key={index}>
            <img src={receipt.imageUrl} alt="" className="w-10 h-10" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReceiptList;
