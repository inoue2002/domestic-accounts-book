// firestoreまわりの処理をまとめてここに書く

import { addDoc, collection } from 'firebase/firestore';
import { db } from './firebase';

/**
 * 新規イベントの作成を行う
 * @returns eventId | error
 */
export async function createEvent(uid) {
  const userDocumentRef = collection(db, 'events');
  try {
    const response = await addDoc(userDocumentRef, {host:uid,});
    console.log({ response });
    return response.id;
  } catch (e) {
    throw new Error(e);
  }
}

// export async function getEvent(eventId){
//     const eventDocumentRef = doc(db,'events',eventId)
//     try{
//         const data = await getDoc(eventDocumentRef)
//         console.log(data.data())
//     }catch(e){
//         throw new Error(e)
//     }
// }

export async function addReceiptd(eventId,receipt){
    const receiptref = collection(db,`events/${eventId}`,'receipt')
   try{
    console.log('アップデートします')
    const response = await addDoc(receiptref,{...receipt})
    return response
   }
   catch(e){
    console.log(e)
    throw new Error(e)
   }
}