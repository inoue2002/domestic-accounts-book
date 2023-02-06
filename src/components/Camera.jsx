import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { storage } from '../firebase';
// https://react-icons.github.io/react-icons/icons?name=ai
import { addReceiptd } from '../useFirestore';

const Camera = (props) => {
  const [imageUrl, setImageUrl] = useState('');
  const eventId = props.eventId;
  const [preview, setPreview] = useState();
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadButtonText, setUploadbuttonText] = useState('アップロード');
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
    setUploadLoading(true);
    // 参照を作成 → 'images/(画像名)'
    try {
      const ext = file.name.split('.').pop();
      const hashName = Math.random().toString(36).slice(-8);
      const storageRef = ref(storage, `images/${eventId}/${hashName}.${ext}`);
      await uploadBytes(storageRef, file)
        .then(async (snapshot) => {
          console.log('アップロードに成功しました');
          console.log(snapshot.ref);
          // imageUrlを取得する
          await getDownloadURL(storageRef).then(async function (url) {
            console.log(url);
            setImageUrl(url);
            await addReceiptd(eventId, { imageUrl: url });
          });
          // itemをeventのDBに追加する
          setUploadLoading(false);
          setUploadbuttonText('✅ アップロード成功');
          // 3秒後にステートを戻す
          setTimeout(() => {
            setUploadbuttonText('アップロード');
            // プレビュー画像の削除
            setPreview();
          }, 3000);
        })
        .catch((error) => {
          setUploadLoading(false);
          setUploadbuttonText('アップロード失敗');
          console.log('アップロードに失敗しました');
          // 3秒後にステートを戻す
          setTimeout(() => {
            setUploadbuttonText('アップロード');
          }, 3000);
        });
    } catch (e) {
      console.log(e);
      setUploadLoading(false);
      setUploadbuttonText('アップロード失敗');

      // 3秒後にステートを戻す
      setTimeout(() => {
        setUploadbuttonText('アップロード');
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mt-10">
      <div class="flex items-center justify-center w-full">
        {preview !== undefined ? (
          <div className="relative">
            <img src={preview} alt="preview" className="h-64" />
            {/* 削除ボタン */}
            <div
              onClick={() => setPreview()}
              class="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -right-2 dark:border-gray-900"
            >
              ×
            </div>
          </div>
        ) : (
          <label
            for="dropzone-file"
            class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                aria-hidden="true"
                class="w-10 h-10 mb-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
              <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span class="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
            </div>
            <input id="dropzone-file" type="file" class="hidden" onChange={handleImageSelect} />
          </label>
        )}
      </div>
      {/* <label>
        <AiFillCamera className="w-20 h-20 border border-l-pink-700 rounded-full p-3" />
        <input type="file" onChange={handleImageSelect} style={{ display: 'none' }} />
      </label> */}
      <button
        onClick={() => uploadImage()}
        type="button"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center mt-4"
      >
        {uploadLoading ? (
          <svg
            aria-hidden="true"
            role="status"
            class="inline w-4 h-4 mr-3 text-white animate-spin"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="#E5E7EB"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentColor"
            />
          </svg>
        ) : (
          ''
        )}
        <div className="font-bold">{uploadButtonText}</div>
      </button>
      {/* {preview !== undefined ? <img src={preview} alt="preview" /> : ''} */}
      {/* {imageUrl !== '' ? <img src={imageUrl} alt="uploaded" /> : ''} */}
    </div>
  );
};

export default Camera;
