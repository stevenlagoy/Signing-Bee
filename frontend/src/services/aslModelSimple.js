// // Simple ASL Alphabet Classifier using pre-trained TensorFlow.js model
// // This uses a MobileNet-based classifier trained on ASL alphabet images

// const LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
//     'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
//     'space', 'del', 'nothing'];

// let model = null;
// let isLoaded = false;
// let currentText = '';
// let lastPrediction = '';
// let lastPredictionTime = 0;
// const DEBOUNCE_MS = 500; // Only add same letter if 500ms passed

// const aslModelSimple = {
//     async loadModel() {
//         if (isLoaded) {
//             console.log('[aslModelSimple] Model already loaded');
//             return;
//         }

//         try {
//             console.log('[aslModelSimple] Loading model...');

//             const tf = window.tf;
//             if (!tf) {
//                 throw new Error('TensorFlow.js not loaded');
//             }

//             // Using a verified working ASL alphabet model from Teachable Machine
//             // Source: https://github.com/DoubleBerserker/ASL-Recognition-Models
//             console.log('[aslModelSimple] Loading ASL alphabet classifier...');

//             const MODEL_URL = 'https://teachablemachine.withgoogle.com/models/2iqXR2IsE/';

//             model = await tf.loadLayersModel(MODEL_URL + 'model.json');
//             isLoaded = true;

//             console.log('[aslModelSimple] ✅ ASL Model loaded successfully');
//             console.log('[aslModelSimple] Input shape:', model.inputs[0].shape);
//             console.log('[aslModelSimple] Output shape:', model.outputs[0].shape);
//         } catch (error) {
//             console.error('[aslModelSimple] ❌ Failed to load model:', error);
//             throw error;
//         }
//     },

//     async predictFromVideo(videoElement) {
//         if (!isLoaded || !model) {
//             return { text: currentText, letter: '', confidence: 0 };
//         }

//         try {
//             const tf = window.tf;

//             // Prepare image from video
//             const img = tf.browser.fromPixels(videoElement);

//             // Resize to 224x224 (standard MobileNet input)
//             const resized = tf.image.resizeBilinear(img, [224, 224]);

//             // Normalize to [-1, 1]
//             const normalized = resized.div(127.5).sub(1);

//             // Add batch dimension
//             const batched = normalized.expandDims(0);

//             // Run prediction
//             const predictions = await model.predict(batched).data();

//             // Clean up tensors
//             img.dispose();
//             resized.dispose();
//             normalized.dispose();
//             batched.dispose();

//             // Find top prediction
//             let maxProb = 0;
//             let maxIndex = 0;
//             for (let i = 0; i < predictions.length; i++) {
//                 if (predictions[i] > maxProb) {
//                     maxProb = predictions[i];
//                     maxIndex = i;
//                 }
//             }

//             const predictedLetter = LABELS[maxIndex] || '';
//             const confidence = maxProb;

//             // Only update text if confident and debounced
//             if (confidence > 0.7) {
//                 const now = Date.now();

//                 if (predictedLetter === 'space') {
//                     currentText += ' ';
//                     lastPrediction = predictedLetter;
//                     lastPredictionTime = now;
//                 } else if (predictedLetter === 'del') {
//                     currentText = currentText.slice(0, -1);
//                     lastPrediction = predictedLetter;
//                     lastPredictionTime = now;
//                 } else if (predictedLetter !== 'nothing' && predictedLetter !== '') {
//                     // Add letter if it's different or enough time has passed
//                     if (predictedLetter !== lastPrediction || (now - lastPredictionTime) > DEBOUNCE_MS) {
//                         currentText += predictedLetter;
//                         lastPrediction = predictedLetter;
//                         lastPredictionTime = now;
//                     }
//                 }
//             }

//             console.log(`[aslModelSimple] 🔤 Predicted: ${predictedLetter} (${(confidence * 100).toFixed(1)}%)`);

//             return {
//                 text: currentText,
//                 letter: predictedLetter,
//                 confidence: confidence
//             };

//         } catch (error) {
//             console.error('[aslModelSimple] Prediction error:', error);
//             return { text: currentText, letter: '', confidence: 0 };
//         }
//     },

//     clearText() {
//         currentText = '';
//         lastPrediction = '';
//         lastPredictionTime = 0;
//     },

//     backspace() {
//         if (currentText.length > 0) {
//             currentText = currentText.slice(0, -1);
//         }
//     },

//     resetSequence() {
//         // No-op for simple model
//     },

//     get currentText() {
//         return currentText;
//     },

//     get isLoaded() {
//         return isLoaded;
//     }
// };

// export default aslModelSimple;
