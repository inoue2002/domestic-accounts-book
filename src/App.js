import './App.css';
import Signin from './components/Signin';

import { useAuthState } from 'react-firebase-hooks/auth';
import Header from './components/Header';
import { auth } from './firebase';


import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Event from './components/Event';
import Home from './components/Home';


const App = () =>{
  const [user,loading,] = useAuthState(auth);

  // DBのユーザー情報を確認する
  // ユーザー情報が見つからない場合はそのまま
  // ユーザー情報が見つかると、新規イベント作成とすでに参加しているイベントの選択ページ
  // recentEventIdがDBに入っている場合はそちらのページへ移動する

  return (
    <div className="App">
      <Header />
      <Signin />
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="event/:eventId" element={<Event />} />
    </Routes>
  </BrowserRouter>,
    </div>
  );
}

export default App;
