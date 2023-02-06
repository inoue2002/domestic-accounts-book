import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { storage } from '../firebase';
// https://react-icons.github.io/react-icons/icons?name=ai
import { AiFillCamera } from 'react-icons/ai';
import { addReceiptd } from '../useFirestore';

const Camera = (props) => {
  const [imageUrl, setImageUrl] = useState('');
  const eventId = props.eventId;
  const [preview, setPreview] = useState();

  const [file, setFile] = useState(null);

  useEffect(() => {
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  }, [file]);

  // 画像選択関数
  const handleImageSelect = async (e) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = async () => {
      setFile(file);
    };
    reader.readAsDataURL(file);
  };

  // 画像アップロード関数
  const uploadImage = async () => {
    // 参照を作成 → 'images/(画像名)'
    const ext = file.name.split('.').pop();
    const hashName = Math.random().toString(36).slice(-8);
    const storageRef = ref(storage, `images/${eventId}/${hashName}.${ext}`);
    await uploadBytes(storageRef, file)
      .then(async (snapshot) => {
        console.log('アップロードに成功しました');
        console.log(snapshot.ref);
        // imageUrlを取得する
        await getDownloadURL(storageRef).then(function (url) {
          console.log(url);
          setImageUrl(url);
        });
        // itemをeventのDBに追加する
        addReceiptd(eventId, { imageUrl });
      })
      .catch((error) => {
        console.log('アップロードに失敗しました');
      });
  };

  return (
    <div>
      <label>
        <AiFillCamera className="w-20 h-20 border border-l-pink-700 rounded-full p-3" />
        <input type="file" onChange={handleImageSelect} style={{ display: 'none' }} />
      </label>
      <button type="submit" onClick={() => uploadImage()}>
        アップロード!
      </button>
      {preview !== undefined ? <img src={preview} alt="preview" /> : ''}
      {/* {imageUrl !== '' ? <img src={imageUrl} alt="uploaded" /> : ''} */}
    </div>
  );
};

export default Camera;
