// firestoreまわりの処理をまとめてここに書く

import { addDoc, arrayRemove, arrayUnion, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

/**
 * 新規イベントの作成を行う
 * @returns eventId | error
 */
export async function createEvent(uid) {
  const userDocumentRef = collection(db, 'events');
  try {
    const response = await addDoc(userDocumentRef, { host: uid, members: [] });
    console.log({ response });
    return response.id;
  } catch (e) {
    throw new Error(e);
  }
}

export async function joinEvent(uid, eventId) {
  try {
    const eventRef = doc(db, `/events/${eventId}`);
    await updateDoc(eventRef, {
      members: arrayUnion(uid),
    });
    const userRef = doc(db, `users/${uid}`);
    await updateDoc(userRef, {
      join: arrayUnion(eventId),
    });
  } catch (e) {
    throw new Error(e);
  }
}

export async function leaveEvent(uid, eventId) {
  try {
    const eventRef = doc(db, `/events/${eventId}`);
    await updateDoc(eventRef, {
      members: arrayRemove(uid),
    });
    const userRef = doc(db, `users/${uid}`);
    await updateDoc(userRef, {
      join: arrayRemove(eventId),
    });
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

export async function addReceiptd(eventId, receipt) {
  const receiptref = collection(db, `events/${eventId}`, 'receipt');
  try {
    console.log('アップデートします');
    const response = await addDoc(receiptref, { ...receipt });
    return response;
  } catch (e) {
    throw new Error(e);
  }
}

export async function getUser(uid) {
  const userRef = doc(db, 'users', uid);
  try {
    const response = await getDoc(userRef);
    console.log(response.data());
    return response.data();
  } catch (e) {
    throw new Error(e);
  }
}

export async function getEvent(eventId){
  const eventRef = doc(db,`events/${eventId}`)
  try{
    const response = await getDoc(eventRef)
    if(!response.exists()) return null
    return response.data()
  }catch(e){
    throw new Error(e)
  }
}