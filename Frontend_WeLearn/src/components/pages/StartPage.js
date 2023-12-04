import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import Support from '../common/Support';
import './style.css';
import './start.css';
import settingLogo from './settingLogo.png';

function StartPage() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: '',
    desired_lang: 'English', 
    known_lang: 'Ukrainian', 
  });

  const onStart = async () => {
      localStorage.setItem('userData', userData);
      navigate('/videocall'); 
    
  };


  return (
    <>
      <Header />
      <div className='setting'>
        <a href="#">
          <img src={settingLogo} alt="Setting Logo" />
        </a>
      </div>
      <div className="container flex">
        <div className="page flex">
          <div className="post">
            <label htmlFor="Name">Name</label>
            <input type="Name" placeholder="Name" required value={userData.name} onChange={(e) => setUserData({ ...userData, name: e.target.value })}/>
            <label htmlFor="lang-choice">Language to Learn</label>
            <select className="lang-choice" value={userData.desired_lang}
              onChange={(e) => setUserData({ ...userData, desired_lang: e.target.value })}>
              <option>English</option>
              <option>Ukrainian</option>
            </select>
            <label htmlFor="des-lang-choice">Native language</label>
            <select className="des-lang-choice"value={userData.known_lang}
              onChange={(e) => setUserData({ ...userData, known_lang: e.target.value })}>
              <option>Ukrainian</option>
              <option>English</option>
            </select>
            <div className="link">
              <button type="start" className="start" onClick={onStart}>
                ▶
              </button>
            </div>
          </div>
        </div>
      </div>
      <Support />
    </>
  );
}

export default StartPage;
