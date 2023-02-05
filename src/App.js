import './App.css';
import Signin from './components/Signin';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import Header from './components/Header';

const App = () =>{
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <Header />
      <Signin />
    </div>
  );
}

export default App;
