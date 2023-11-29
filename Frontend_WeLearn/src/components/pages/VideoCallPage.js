import {useEffect, useRef, useState} from "react";
import styles from './VideoCallPage.module.css';
import Peer from "peerjs";
import Header from '../common/Header';
import Support from '../common/Support';
import settingLogo from './settingLogo.png';
import cameraOn from './cameraOn.png';
import cameraOff from './cameraOff.png';
import next from './next.png';
import setting1 from './setting1.png';
import microOn from './microOn.png';
import microOff from './microOff.png';




function VideoCallPage() {
    
    const [MuteMicrophone, setMuteMicrophone] = useState(true);
    const [CameraOff, setCameraOff] = useState(true);
    const [peerId, setPeerId] = useState('');
    const [targetPeerId, setTargetPeerId] = useState('');
    const [userInfo, setUserInfo] = useState({});

    const MicrophoneToggle = () => {
        setMuteMicrophone((prev) => !prev);

        const localStream = localVideoRef.current.srcObject;
        const audioTracks = localStream.getAudioTracks();
      
        audioTracks.forEach((track) => {
          track.enabled = !MuteMicrophone;  });
      };
    
      const CameraToggle = () => {
        setCameraOff((prev) => !prev);
        const localStream = localVideoRef.current.srcObject;
        const videoTracks = localStream.getVideoTracks();

        videoTracks.forEach((track) => {
            track.enabled = !CameraOff; });
      };

        const localVideoRef = useRef(null);
        const remoteVideoRef = useRef(null);
        const peerRef = useRef(null);



        const handleIncomingCall = (call) => {
            call.answer(localVideoRef.current.srcObject);

            call.on('stream', (remoteStream) => {
            remoteVideoRef.current.srcObject = remoteStream;
            });
    };

    const callPeer = () => {
        if (!targetPeerId) {
            alert("Please, enter valid target peer id.")
        }

        const call = peerRef.current.call(targetPeerId, localVideoRef.current.srcObject);

        call.on('stream', function(remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        });
    }

    const fetchUserInfo = async () => {
        try {
            const token = localStorage.getItem('token'); 
            const response = await fetch('http://localhost:8000/peer/', { 
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            setUserInfo(data); 
            
        } catch (error) {
            console.error('Error fetching user information:', error);
        }
    };

    const initializePeer = async () => {
        const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

        localVideoRef.current.srcObject = localStream;

        peerRef.current = new Peer();

        peerRef.current.on('open', async (id) => {
            setPeerId(id);
            try {
                const token = localStorage.getItem('token'); // Retrieve the stored token
                await fetch('http://localhost:8000/peer/', { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}` // If you are using token-based authentication
                    },
                    body: JSON.stringify({ peerId: id })
                });
            } catch (error) {
                console.error('Error sending peer ID to backend:', error);
            }
        });

        peerRef.current.on('call', handleIncomingCall);
        // Connect to signaling server or perform other setup if needed
    };

    useEffect(() => {
        fetchUserInfo();
        initializePeer();

        return () => {
          if (peerRef.current) {
            peerRef.current.disconnect();
            remoteVideoRef.current.srcObject = null;
          }
        };
      }, []);



    return <>
    <Header />
        <div className='setting'>
    <a href="#">
        <img src={settingLogo} alt="Setting Logo" />
      </a>
    </div>
        <div className={styles.mainContainer}>
            <div className={styles.videosSection}>
                <video className={styles.videoElement} ref={localVideoRef} autoPlay playsInline muted />
                <video className={styles.videoElement} ref={remoteVideoRef} autoPlay playsInline />
            </div>

            <div className={styles.controlsSection}>

                <div>
                    <div>Your Peer ID: {peerId}</div>
                    <div>Language: {userInfo.name}</div>
                    <div>Name: {userInfo.known_lang}</div>
                    <div>
                        <input value={targetPeerId} onChange={(e) => setTargetPeerId(e.target.value)}/>
                        <button className={styles.startCallBtn} onClick={callPeer}>Call</button>
                    </div>
                </div>
            </div>
        </div>
        <div className={styles.bottomToolbar}>
            <div className={styles.centerContainer}>
                <a href="#">
                    <img src={setting1} alt="Setting1 Logo" />
                </a>
                <a href="#" onClick={MicrophoneToggle}>
                    {MuteMicrophone ? 
                        (<img src={microOn} alt="Microphone On" />) 
                        : (<img src={microOff} alt="Microphone Off"/>)
                    }
                </a>
                <a href="#" onClick={CameraToggle}>
                    {CameraOff ? 
                        (<img src={cameraOn} alt="Camera On" />) 
                        : (<img src={cameraOff} alt="Camera Off"/>)
                    }
                </a>
                <a href="#" onClick={initializePeer}>
                    <img src={next} alt="Next Logo" />
                </a>
            </div>
        </div>
        
        <Support />
    </>;
}


export default VideoCallPage;
