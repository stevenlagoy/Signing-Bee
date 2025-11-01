import { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import styles from "./Camera.module.scss";

export default function WebcamSample() {

    const [video, setVideo] = useState(false);
    const videoElement = useRef(null);
    
    const videoConstraints = {
        width: 640,
        height: 480,
        facingMode: "user"
    }

    const startCam = () => {
        setVideo(true);
    }

    const stopCam = () => {
        let stream = videoElement.current.stream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        setVideo(false);
    }

    return (
        <div>
            <div className={styles.webcam}>
                {video && <Webcam audio={false} ref={videoElement} videoConstraints={videoConstraints} />}
            </div>
            <div className={styles.SSButtons}>
                <button onClick={startCam}>Start Video</button>
                <button onClick={stopCam}>Stop Video</button>
            </div>
        </div>
    );
};