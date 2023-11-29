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
    user: 'admin', // neeeeeeeds to change!!!!!!!!!!!! => "user" value required to run backend. StartPage does not have needed input field!!!!!!!!!!!!!!!
    name: '',
    desired_lang: 'English', 
    known_lang: 'Ukrainian', 
    id: '123123123123123', //also like.. ????
    last_time_pinged: '2023-11-24T23:28:00Z' // same here
  });

  const onStart = async () => {
    try {
      const response = await fetch('http://localhost:8000/peer/', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      navigate('/videocall'); 
    } catch (error) {
      console.error('Error:', error);
    }
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
            <select className="lang-choice" value={userData.languageToLearn}
              onChange={(e) => setUserData({ ...userData, languageToLearn: e.target.value })}>
              <option>English</option>
              <option>Ukrainian</option>
            </select>
            <label htmlFor="des-lang-choice">Native language</label>
            <select className="des-lang-choice"value={userData.nativeLanguage}
              onChange={(e) => setUserData({ ...userData, nativeLanguage: e.target.value })}>
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
