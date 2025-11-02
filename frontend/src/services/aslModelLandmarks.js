// ASL Alphabet Classifier using MediaPipe hand landmarks + TensorFlow.js
// Uses pre-trained model that takes hand landmarks as input

// Model outputs 28 classes: A-Z + nothing + space
const LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'nothing', 'space'];

// Per-letter confidence thresholds (lower = easier to trigger)
const LETTER_THRESHOLDS = {
    'A': 0.50,
    'B': 0.80,
    'C': 0.70,
    'D': 0.70,
    'E': 0.70,
    'F': 0.30,
    'G': 0.20,
    'H': 0.20,
    'I': 0.75,
    'J': 0.40,
    'K': 0.50,
    'L': 0.75,
    'M': 0.50,
    'N': 0.50,
    'O': 0.7,
    'P': 0.75,
    'Q': 0.70,
    'R': 0.45,
    'S': 0.75,
    'T': 0.75,
    'U': 0.40,
    'V': 0.65,
    'W': 0.70,
    'X': 0.75,
    'Y': 0.40,
    'Z': 0.70,
    'nothing': 0.75
};

let model = null;
let isLoaded = false;
let currentText = '';
let lastAddedLetter = '';
let thresholdReachedTime = 0;
let currentHighConfidenceLetter = '';
const DEBOUNCE_MS = 1000;
const CONFIDENCE_THRESHOLD = 0.75;

const aslModelLandmarks = {
    async loadModel() {
        if (isLoaded) {
            console.log('[aslModelLandmarks] Model already loaded');
            return;
        }

        try {
            console.log('[aslModelLandmarks] Loading TensorFlow.js model...');

            const tf = window.tf;
            if (!tf) {
                throw new Error('TensorFlow.js not loaded');
            }

            // Load the converted TensorFlow.js model from public folder
            const MODEL_URL = '/models/simple_model_landmarks/model.json';

            model = await tf.loadLayersModel(MODEL_URL);
            isLoaded = true;

            console.log('[aslModelLandmarks] ✅ Model loaded successfully');
            console.log('[aslModelLandmarks] Input shape:', model.inputs[0].shape);
            console.log('[aslModelLandmarks] Output shape:', model.outputs[0].shape);
        } catch (error) {
            console.error('[aslModelLandmarks] ❌ Failed to load model:', error);
            throw error;
        }
    },

    async predictFromLandmarks(results) {
        if (!isLoaded || !model) {
            console.log('[aslModelLandmarks] ⚠️ Model not ready');
            return { text: currentText, letter: '', confidence: 0 };
        }

        try {
            // Check if we have hand landmarks
            const rightHand = results.rightHandLandmarks;
            const leftHand = results.leftHandLandmarks;

            if (!rightHand && !leftHand) {
                return { text: currentText, letter: '', confidence: 0 };
            }

            // Use right hand primarily, or flip left hand to simulate right
            let hand = rightHand;
            let isLeftHand = false;

            if (!hand && leftHand) {
                hand = leftHand;
                isLeftHand = true;
            }

            // Convert landmarks to feature vector (flip if left hand)
            const features = this.landmarksToFeatures(hand, isLeftHand);

            // Run model prediction
            const tf = window.tf;
            const inputTensor = tf.tensor2d([features]);
            const predictionTensor = model.predict(inputTensor);
            const predictions = await predictionTensor.data();

            // Clean up tensors
            inputTensor.dispose();
            predictionTensor.dispose();

            // Process predictions
            const processed = this.processPredictions(predictions);
            const predictedClass = processed.letter;
            const confidence = processed.confidence;

            // Get the threshold for this specific letter
            const letterThreshold = LETTER_THRESHOLDS[predictedClass] || CONFIDENCE_THRESHOLD;

            // Check if confidence is above threshold and not "nothing"
            if (confidence > letterThreshold && predictedClass !== 'nothing') {
                const now = Date.now();

                // Can't type the same letter twice in a row - must show a different letter first
                if (predictedClass === lastAddedLetter) {
                    // Same as last added letter - can't start tracking it yet
                    console.log(`[aslModelLandmarks] ⛔ Can't type "${predictedClass}" again - must change letter first`);
                    currentHighConfidenceLetter = '';
                    thresholdReachedTime = 0;
                } else if (predictedClass !== currentHighConfidenceLetter) {
                    // Different letter from what we're tracking - start new tracking
                    currentHighConfidenceLetter = predictedClass;
                    thresholdReachedTime = now;
                    console.log(`[aslModelLandmarks] 🎯 Started tracking: ${predictedClass}`);
                } else {
                    // Same letter maintained above threshold - check if enough time passed
                    const holdDuration = now - thresholdReachedTime;

                    if (holdDuration >= DEBOUNCE_MS) {
                        // Held long enough - add the letter
                        currentText += predictedClass;
                        console.log(`[aslModelLandmarks] ✅ Added letter: ${predictedClass} (held ${holdDuration}ms)`);

                        // Reset tracking to require another hold
                        currentHighConfidenceLetter = '';
                        thresholdReachedTime = 0;
                        lastAddedLetter = predictedClass;
                    }
                }
            } else {
                // Confidence dropped below threshold - reset tracking
                if (currentHighConfidenceLetter) {
                    console.log(`[aslModelLandmarks] ⚠️ Confidence dropped, reset tracking for: ${currentHighConfidenceLetter}`);
                    currentHighConfidenceLetter = '';
                    thresholdReachedTime = 0;
                }

                // If we're seeing a different letter (even at low confidence), allow repeating the last letter
                if (predictedClass !== lastAddedLetter && predictedClass !== 'nothing') {
                    lastAddedLetter = '';
                }
            }

            return {
                text: currentText,
                letter: predictedClass,
                confidence: confidence,
                holdProgress: currentHighConfidenceLetter === predictedClass && thresholdReachedTime > 0
                    ? Math.min((Date.now() - thresholdReachedTime) / DEBOUNCE_MS, 1)
                    : 0
            };

        } catch (error) {
            console.error('[aslModelLandmarks] Prediction error:', error);
            return { text: currentText, letter: '', confidence: 0 };
        }
    },

    landmarksToFeatures(landmarks, isLeftHand = false) {
        // Convert MediaPipe landmarks to feature vector for the model
        // Model expects 63 features (21 landmarks × 3 coords: x, y, z)

        const features = [];

        // Flatten all coordinates in order: x, y, z for each landmark
        for (let i = 0; i < landmarks.length; i++) {
            // Flip x-coordinate for left hand to mirror it as a right hand
            const x = isLeftHand ? (1.0 - landmarks[i].x) : landmarks[i].x;

            features.push(x);
            features.push(landmarks[i].y);
            features.push(landmarks[i].z);
        }

        return features;
    },

    processPredictions(predictions) {
        // Find top prediction (excluding "space")
        let maxProb = 0;
        let maxIndex = 0;

        // First pass: find highest probability excluding space
        for (let i = 0; i < predictions.length; i++) {
            const label = LABELS[i];
            // Skip "space" - we don't want it as an option
            if (label === 'space') continue;

            if (predictions[i] > maxProb) {
                maxProb = predictions[i];
                maxIndex = i;
            }
        }

        // Redistribute space probability to boost other predictions
        const spaceIndex = LABELS.indexOf('space');
        if (spaceIndex >= 0 && predictions[spaceIndex] > 0) {
            const spaceProb = predictions[spaceIndex];
            const redistributeAmount = spaceProb / (predictions.length - 1); // Distribute to all others

            // Boost all non-space predictions proportionally
            for (let i = 0; i < predictions.length; i++) {
                if (i !== spaceIndex) {
                    predictions[i] += redistributeAmount;
                }
            }

            // Renormalize if needed
            const sum = predictions.reduce((a, b) => a + b, 0);
            if (sum > 0) {
                for (let i = 0; i < predictions.length; i++) {
                    predictions[i] /= sum;
                }
            }

            // Recalculate max after redistribution
            maxProb = predictions[maxIndex];
        }

        return {
            letter: LABELS[maxIndex] || '',
            confidence: maxProb
        };
    },

    clearText() {
        currentText = '';
        lastAddedLetter = '';
        currentHighConfidenceLetter = '';
        thresholdReachedTime = 0;
    },

    get currentText() {
        return currentText;
    },

    get isLoaded() {
        return isLoaded;
    },

    get confidenceThreshold() {
        return CONFIDENCE_THRESHOLD;
    },

    getLetterThreshold(letter) {
        return LETTER_THRESHOLDS[letter] || CONFIDENCE_THRESHOLD;
    },

    get debounceMs() {
        return DEBOUNCE_MS;
    }
};

export default aslModelLandmarks;
