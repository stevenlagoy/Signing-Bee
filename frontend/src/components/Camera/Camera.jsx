import { useRef, useState, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Holistic, HAND_CONNECTIONS } from '@mediapipe/holistic';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
// import aslModel from '../../services/aslModel'; // Complex model not working yet
// import aslModel from '../../services/aslModelSimple'; // Image-based model (not great)
import aslModel from '../../services/aslModelLandmarks'; // Landmark-based model (better)
import styles from "./Camera.module.scss";

export default function WebcamSample() {

    const [video, setVideo] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [predictedText, setPredictedText] = useState('');
    const [modelLoaded, setModelLoaded] = useState(false);
    const [confidence, setConfidence] = useState(0);
    const [currentLetter, setCurrentLetter] = useState('');

    const videoElement = useRef(null);
    const canvasRef = useRef(null);
    const holisticRef = useRef(null);
    const cameraRef = useRef(null);
    const frameCountRef = useRef(0);
    const isRecordingRef = useRef(false);

    const videoConstraints = {
        width: 640,
        height: 480,
        facingMode: "user"
    }

    useEffect(() => {
        // Load the ASL model when component mounts
        console.log('[Camera] Loading ASL model...');
        aslModel.loadModel()
            .then(() => {
                console.log('[Camera] ASL model loaded successfully');
                setModelLoaded(true);
            })
            .catch(err => {
                console.error('[Camera] Failed to load ASL model:', err);
            });
    }, []);

    // Sync isRecording state to ref
    useEffect(() => {
        isRecordingRef.current = isRecording;
    }, [isRecording]);

    const onResults = useCallback(async (results) => {
        if (!canvasRef.current) return;

        const canvasCtx = canvasRef.current.getContext('2d');
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        // // Draw face mesh
        // if (results.faceLandmarks) {
        //     drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, {
        //         color: '#C0C0C070',
        //         lineWidth: 1
        //     });
        // }

        // // Draw pose
        // if (results.poseLandmarks) {
        //     drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
        //         color: '#00FF00',
        //         lineWidth: 4
        //     });
        //     drawLandmarks(canvasCtx, results.poseLandmarks, {
        //         color: '#FF0000',
        //         lineWidth: 2,
        //         radius: 4
        //     });
        // }

        // Draw left hand
        if (results.leftHandLandmarks) {
            drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, {
                color: '#CC0000',
                lineWidth: 5
            });
            drawLandmarks(canvasCtx, results.leftHandLandmarks, {
                color: '#00FF00',
                lineWidth: 2,
                radius: 5
            });
        }

        // Draw right hand
        if (results.rightHandLandmarks) {
            drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS, {
                color: '#0000CC',
                lineWidth: 5
            });
            drawLandmarks(canvasCtx, results.rightHandLandmarks, {
                color: '#FF0000',
                lineWidth: 2,
                radius: 5
            });
        }

        canvasCtx.restore();

        // Run prediction when recording (throttle to every 15 frames = ~2x per second at 30fps)
        if (isRecordingRef.current && modelLoaded) {
            frameCountRef.current += 1;

            if (frameCountRef.current % 15 === 0) {
                try {
                    const prediction = await aslModel.predictFromLandmarks(results);

                    if (prediction) {
                        setPredictedText(prediction.text || '');
                        setCurrentLetter(prediction.letter || '');
                        setConfidence(prediction.confidence || 0);
                    }
                } catch (error) {
                    console.error('[Camera] Prediction failed:', error);
                }
            }
        }
    }, [modelLoaded]);

    useEffect(() => {
        if (video && videoElement.current?.video) {
            // Only create holistic if it doesn't exist
            if (!holisticRef.current) {
                const holistic = new Holistic({
                    locateFile: (file) => {
                        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
                    }
                });

                holistic.setOptions({
                    modelComplexity: 1,
                    smoothLandmarks: true,
                    enableSegmentation: false,
                    smoothSegmentation: false,
                    minDetectionConfidence: 0.7,
                    minTrackingConfidence: 0.7,
                    refineFaceLandmarks: false
                });

                holistic.onResults(onResults);
                holisticRef.current = holistic;
            }

            // Only create camera if it doesn't exist
            if (!cameraRef.current) {
                const camera = new Camera(videoElement.current.video, {
                    onFrame: async () => {
                        if (holisticRef.current && videoElement.current?.video) {
                            await holisticRef.current.send({ image: videoElement.current.video });
                        }
                    },
                    width: 640,
                    height: 480
                });

                camera.start();
                cameraRef.current = camera;
            }
        }

        return () => {
            // Cleanup only when video stops
            if (!video) {
                if (cameraRef.current) {
                    cameraRef.current.stop();
                    cameraRef.current = null;
                }
                if (holisticRef.current) {
                    holisticRef.current.close();
                    holisticRef.current = null;
                }
            }
        };
    }, [video, onResults]);

    const startRecording = () => {
        if (!modelLoaded) {
            console.error('[Camera] Cannot start recording - model not loaded');
            return;
        }
        console.log('[Camera] Starting real-time recognition');
        setIsRecording(true);
        isRecordingRef.current = true;
        aslModel.clearText();
        setPredictedText('');
        setCurrentLetter('');
        setConfidence(0);
        frameCountRef.current = 0;
    };

    const stopRecording = () => {
        setIsRecording(false);
        isRecordingRef.current = false;
        console.log('[Camera] Stopped real-time recognition');
        console.log('[Camera] Final text:', predictedText);
    };

    const startCam = () => {
        setVideo(true);
    }

    const stopCam = () => {
        if (videoElement.current && videoElement.current.stream) {
            let stream = videoElement.current.stream;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
        }
        if (cameraRef.current) {
            cameraRef.current.stop();
        }
        // Clear text when stopping the camera
        if (modelLoaded) {
            aslModel.clearText();
        }
        setVideo(false);
        setIsRecording(false);
        setPredictedText('');
        setCurrentLetter('');
        setConfidence(0);
    }

    return (
        <div>
            <div className={styles.SSButtons}>
                <button onClick={startCam}>Start Video</button>
                <button onClick={stopCam}>Stop Video</button>
                {video && modelLoaded && (
                    <>
                        <button onClick={startRecording} disabled={isRecording}>
                            Start Recognition
                        </button>
                        <button onClick={stopRecording} disabled={!isRecording}>
                            Stop Recognition
                        </button>
                    </>
                )}
            </div>
            <div className={styles.webcam}>
                {video && (
                    <>
                        <Webcam audio={false} ref={videoElement} videoConstraints={videoConstraints} />
                        <canvas
                            ref={canvasRef}
                            width={640}
                            height={480}
                            className={styles.canvas}
                        />
                    </>
                )}
            </div>
            {video && (
                <div className={styles.prediction}>
                    {isRecording && (
                        <>
                            <div className={styles.status}>
                                🔴 Recording...
                            </div>
                            <div className={styles.liveDetection}>
                                <div className={styles.detectedLetter}>
                                    <strong>Detecting:</strong> {currentLetter || 'None'}
                                </div>
                                <div className={styles.confidenceBar}>
                                    <div className={styles.confidenceLabel}>
                                        <span>Confidence: {(confidence * 100).toFixed(1)}%</span>
                                        <span className={styles.threshold}>
                                            Need: {currentLetter ? (aslModel.getLetterThreshold(currentLetter) * 100).toFixed(0) : (aslModel.confidenceThreshold * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                    <div className={styles.progressBar}>
                                        <div
                                            className={`${styles.progressFill} ${currentLetter && confidence >= aslModel.getLetterThreshold(currentLetter) ? styles.locked : ''}`}
                                            style={{ width: `${Math.min(confidence * 100, 100)}%` }}
                                        />
                                        <div className={styles.thresholdMarker} style={{ left: `${currentLetter ? (aslModel.getLetterThreshold(currentLetter) * 100) : (aslModel.confidenceThreshold * 100)}%` }} />
                                    </div>
                                    {currentLetter && confidence >= aslModel.getLetterThreshold(currentLetter) && (
                                        <div className={styles.holdMessage}>
                                            ✅ Hold for {(aslModel.debounceMs / 1000).toFixed(1)}s to lock in "{currentLetter}"
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                    <div className={styles.resultText}>
                        <strong>Text:</strong> {predictedText || ''}
                    </div>
                </div>
            )}
        </div>
    );
};