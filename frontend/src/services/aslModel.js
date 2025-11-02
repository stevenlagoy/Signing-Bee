// // src/services/aslModel.js
// // Singleton for ASL fingerspelling seq->seq (.tflite) in browser (MediaPipe.js + tfjs-tflite)

// const MODEL_URL = '/models/ishara_v1.tflite';     // change if needed
// const WINDOW_T = 32;                              // frames per inference window
// const STRIDE_T = 15;                              // run every 10 frames (was 2) to reduce blocking
// const HOLD_DEBOUNCE_MS = 180;                     // suppress repeats from "hold"
// const CONF_SMOOTH = 0.6;                          // EMA for confidence display

// // Landmark config (MediaPipe: Face 468, Pose 33, Hands 21 each)
// // Using Hands(21x2) + Face(40 subset) + Pose(10 subset) with (x,y,z)
// const FACE_COUNT = 40;
// const FACE_SIZE = 468;
// const FACE_IDX = Array.from({ length: FACE_COUNT }, (_, i) =>
//     Math.min(FACE_SIZE - 1, Math.floor((i * FACE_SIZE) / FACE_COUNT + FACE_SIZE / (2 * FACE_COUNT)))
// );

// const POSE_IDX = [0, 2, 5, 7, 8, 11, 12, 13, 14, 15];

// const HAND_LM = 21;            // per hand
// const USE_Z = true;
// const DIMS = USE_Z ? 3 : 2;

// const F_PER_FRAME =
//     (HAND_LM * DIMS) * 2 +                      // hands
//     (FACE_IDX.length * DIMS) +                  // face subset
//     (POSE_IDX.length * DIMS);                   // pose subset

// // ---- Vocabulary / tokens ----
// // Adjust BLANK_ID and VOCAB to your model if different.
// const BLANK_ID = 0;
// const VOCAB = ['_', ' ', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
// const idToChar = (id) => (id >= 0 && id < VOCAB.length ? VOCAB[id] : '?');

// // ---- Internal state (singleton) ----
// let tfliteModel = null;
// let loaded = false;
// let isProcessing = false;  // Lock to prevent concurrent predictions

// let seqBuffer = new Float32Array(WINDOW_T * F_PER_FRAME);
// let framesSeen = 0;
// let lastInferFrame = -STRIDE_T;

// let currentText = '';
// let lastEmit = { char: '', t: 0 };
// let confEMA = 0;

// // Reset rolling window (call at Start)
// function resetWindow() {
//     seqBuffer.fill(0);
//     framesSeen = 0;
//     lastInferFrame = -STRIDE_T;
//     lastEmit = { char: '', t: 0 };
// }

// // Push one frame feature vector into rolling window
// function pushFrame(feat) {
//     if (framesSeen >= WINDOW_T) {
//         seqBuffer.copyWithin(0, F_PER_FRAME);
//         seqBuffer.set(feat, (WINDOW_T - 1) * F_PER_FRAME);
//     } else {
//         seqBuffer.set(feat, framesSeen * F_PER_FRAME);
//         framesSeen += 1;
//     }
//     console.log(`[aslModel] 📦 Frame added to buffer (total: ${framesSeen}/${WINDOW_T})`);
// }

// // Build per-frame features from MediaPipe Holistic results
// function buildFrameFeatures(results) {
//     const out = new Float32Array(F_PER_FRAME);
//     let off = 0;

//     // Write helper: always write exactly expectedCount landmarks (zeros if missing)
//     const writeFixed = (lms, expectedCount, pickIdx = null) => {
//         if (pickIdx) {
//             // subset path (face/pose)
//             for (const idx of pickIdx) {
//                 const lm = (lms && lms[idx]) ? lms[idx] : { x: 0, y: 0, z: 0 };
//                 out[off++] = lm.x || 0;
//                 out[off++] = lm.y || 0;
//                 if (USE_Z) out[off++] = lm.z || 0;
//             }
//             return;
//         }
//         // full-hand path
//         for (let i = 0; i < expectedCount; i++) {
//             const lm = (lms && lms[i]) ? lms[i] : { x: 0, y: 0, z: 0 };
//             out[off++] = lm.x || 0;
//             out[off++] = lm.y || 0;
//             if (USE_Z) out[off++] = lm.z || 0;
//         }
//     };

//     // Left hand (21)
//     writeFixed(results.leftHandLandmarks, HAND_LM);
//     // Right hand (21)
//     writeFixed(results.rightHandLandmarks, HAND_LM);
//     // Face (40 subset)
//     writeFixed(results.faceLandmarks, FACE_IDX.length, FACE_IDX);
//     // Pose (10 subset)
//     writeFixed(results.poseLandmarks, POSE_IDX.length, POSE_IDX);

//     // Model-agnostic per-frame normalization: center + scale by RMS
//     let cx = 0, cy = 0, cz = 0, count = 0;
//     for (let i = 0; i < out.length; i += DIMS) {
//         cx += out[i];
//         cy += out[i + 1];
//         if (USE_Z) cz += out[i + 2];
//         count++;
//     }
//     cx /= count; cy /= count; if (USE_Z) cz /= count;

//     let rms = 0;
//     for (let i = 0; i < out.length; i += DIMS) {
//         const dx = out[i] - cx, dy = out[i + 1] - cy, dz = USE_Z ? (out[i + 2] - cz) : 0;
//         rms += dx * dx + dy * dy + (USE_Z ? dz * dz : 0);
//     }
//     rms = Math.sqrt(rms / Math.max(1, count));
//     const scale = rms > 1e-6 ? rms : 1.0;

//     for (let i = 0; i < out.length; i += DIMS) {
//         out[i] = (out[i] - cx) / scale;
//         out[i + 1] = (out[i + 1] - cy) / scale;
//         if (USE_Z) out[i + 2] = (out[i + 2] - cz) / scale;
//     }

//     return out;
// }

// // Greedy CTC decode (returns {text, conf})
// function ctcDecode(logits2D) {
//     const T = logits2D.length;
//     const V = logits2D[0].length;
//     const now = performance.now();

//     let prevId = -1;
//     let decoded = '';
//     let confSum = 0;
//     let confCount = 0;
//     let sawBlankBetweenRepeat = false;

//     for (let t = 0; t < T; t++) {
//         let maxId = 0, maxVal = logits2D[t][0];
//         for (let v = 1; v < V; v++) {
//             if (logits2D[t][v] > maxVal) { maxVal = logits2D[t][v]; maxId = v; }
//         }
//         const isBlank = (maxId === BLANK_ID);
//         if (isBlank) {
//             prevId = maxId;
//             sawBlankBetweenRepeat = true;
//             continue;
//         }

//         // cheap sigmoid for a display-only confidence proxy
//         const conf = 1 / (1 + Math.exp(-maxVal));
//         confSum += conf; confCount++;

//         // CTC collapse with hold de-bounce
//         if (maxId !== prevId || sawBlankBetweenRepeat) {
//             const ch = idToChar(maxId);
//             if (ch === lastEmit.char && (now - lastEmit.t) < HOLD_DEBOUNCE_MS && !sawBlankBetweenRepeat) {
//                 // suppress held repeat
//             } else {
//                 decoded += ch;
//                 lastEmit = { char: ch, t: now };
//             }
//             sawBlankBetweenRepeat = false;
//         }
//         prevId = maxId;
//     }

//     const confAvg = confCount ? (confSum / confCount) : 0;
//     confEMA = CONF_SMOOTH * confAvg + (1 - CONF_SMOOTH) * confEMA;

//     if (decoded) currentText += decoded;

//     console.log(`[aslModel] 🔤 CTC decoded: "${decoded}" | Current text: "${currentText}" | Confidence: ${(confEMA * 100).toFixed(1)}%`);

//     return { text: currentText, confidence: confEMA };
// }

// // Convert tf.Tensor (T,V) -> number[][] using async array() instead of blocking dataSync()
// async function tensorTo2DArray(tensor) {
//     const shape = tensor.shape;
//     if (shape.length === 2) {
//         // [T, V] -> use array() which is non-blocking
//         return await tensor.array();
//     } else if (shape.length === 1) {
//         // [V] -> [[V]]
//         const arr = await tensor.array();
//         return [arr];
//     } else {
//         throw new Error(`Unexpected tensor rank: ${shape.length}`);
//     }
// }

// const aslModel = {
//     get currentText() { return currentText; },
//     get framesSeen() { return Math.max(0, framesSeen); },
//     get confidence() { return confEMA; },

//     async loadModel() {
//         if (loaded) {
//             console.log('[aslModel] Model already loaded');
//             return;
//         }
//         console.log('[aslModel] Starting model load...');

//         // Ensure TensorFlow.js backend is ready
//         const tf = globalThis.tf;
//         if (tf) {
//             await tf.ready();
//             if (tf.getBackend() !== 'cpu') { await tf.setBackend('cpu'); console.log('[aslModel] Backend switched to CPU'); } // avoid WebGL stalls
//             console.log('[aslModel] TensorFlow.js backend ready:', tf.getBackend());
//         }

//         const lib = (globalThis.tflite || globalThis.tfjsTflite || globalThis.tf?.tflite);
//         if (!lib?.loadTFLiteModel) {
//             console.error('[aslModel] tfjs-tflite not available. globalThis.tf:', globalThis.tf);
//             throw new Error('tfjs-tflite not available on window (ensure CDN script).');
//         }
//         console.log('[aslModel] Loading model from:', MODEL_URL);

//         // Load TFLite model with performance options
//         tfliteModel = await lib.loadTFLiteModel(MODEL_URL, { numThreads: 1 });
//         console.log('[aslModel] crossOriginIsolated:', globalThis.crossOriginIsolated === true ? 'yes' : 'no');

//         loaded = true;
//         console.log('[aslModel] Model loaded successfully');

//         // Inspect model inputs/outputs
//         const inputs = await tfliteModel.inputs;
//         const outputs = await tfliteModel.outputs;

//         if (inputs && inputs.length > 0) {
//             console.log('[aslModel] Model expects input:', {
//                 name: inputs[0].name,
//                 shape: inputs[0].shape,
//                 dtype: inputs[0].dtype
//             });
//         }

//         if (outputs && outputs.length > 0) {
//             console.log('[aslModel] Model produces output:', {
//                 name: outputs[0].name,
//                 shape: outputs[0].shape,
//                 dtype: outputs[0].dtype
//             });
//         }
//     },

//     resetSequence() { resetWindow(); },

//     clearText() {
//         currentText = '';
//         confEMA = 0;
//         lastEmit = { char: '', t: 0 };
//     },

//     backspace() {
//         if (currentText.length > 0) currentText = currentText.slice(0, -1);
//     },

//     // Predict incrementally per MediaPipe result frame
//     // Replace the whole predictFrame function with this:

//     async predictFrame(results) {
//         if (!loaded || !tfliteModel) return { text: currentText, confidence: confEMA || 0 };
//         if (isProcessing) return { text: currentText, confidence: confEMA || 0 };

//         // Build & push features
//         const feat = buildFrameFeatures(results);
//         pushFrame(feat);
//         if (framesSeen === 0) return { text: currentText, confidence: confEMA || 0 };

//         // If Camera.jsx already throttles, keep STRIDE_T = 1 here.
//         lastInferFrame += 1;
//         if (lastInferFrame % STRIDE_T !== 0) return { text: currentText, confidence: confEMA || 0 };

//         const tf = globalThis.tf;
//         if (!tf) return { text: currentText, confidence: confEMA || 0 };

//         isProcessing = true;

//         // latest frame -> [1, F_PER_FRAME]
//         const latestIdx = (Math.min(framesSeen, WINDOW_T) - 1) * F_PER_FRAME;
//         const latest = seqBuffer.slice(latestIdx, latestIdx + F_PER_FRAME);

//         let input = null;
//         let y = null;
//         let logits = null;
//         let topIdx = null;
//         let topVal = null;

//         try {
//             input = tf.tensor(latest, [1, F_PER_FRAME], 'float32');

//             // DO NOT wrap in tf.tidy() – this can deadlock tfjs-tflite.
//             y = tfliteModel.predict(input);

//             // Normalize output to [V]
//             logits = Array.isArray(y) ? y[0] : (y?.shape ? y : y?.output);
//             if (!logits?.shape) throw new Error('Unexpected model output');

//             if (logits.shape.length === 2 && logits.shape[0] === 1) {
//                 logits = logits.squeeze([0]);           // [1,V] -> [V]
//             } else if (logits.shape.length === 3 && logits.shape[0] === 1) {
//                 logits = logits.squeeze([0]).squeeze([0]); // [1,T=1,V] -> [V]
//             } else if (logits.shape.length !== 1) {
//                 throw new Error(`Unhandled output rank ${logits.shape.length}`);
//             }

//             // Compute top-1 on the tensor backend; only bring back two scalars
//             const topk = tf.topk(logits, 1);
//             topIdx = (await topk.indices.data())[0] | 0;
//             topVal = (await topk.values.data())[0];

//             // CTC-style step (greedy) with hold de-bounce
//             const now = performance.now();
//             if (topIdx !== BLANK_ID) {
//                 const ch = idToChar(topIdx);
//                 const conf = 1 / (1 + Math.exp(-topVal)); // cheap display proxy
//                 confEMA = CONF_SMOOTH * conf + (1 - CONF_SMOOTH) * confEMA;

//                 if (!(ch === lastEmit.char && (now - lastEmit.t) < HOLD_DEBOUNCE_MS)) {
//                     currentText += ch;
//                     lastEmit = { char: ch, t: now };
//                 }
//             }

//             // Dispose in a defined order
//             input.dispose();
//             if (Array.isArray(y)) y.forEach(t => t?.dispose && t.dispose());
//             else if (y && y.dispose) y.dispose();
//             if (logits && logits.dispose) logits.dispose();
//             if (topk?.indices) topk.indices.dispose();
//             if (topk?.values) topk.values.dispose();

//             isProcessing = false;
//             return { text: currentText, confidence: confEMA || 0 };
//         } catch (e) {
//             // best-effort cleanup
//             try { input && input.dispose(); } catch { }
//             try {
//                 if (Array.isArray(y)) y.forEach(t => t?.dispose && t.dispose());
//                 else if (y && y.dispose) y.dispose();
//                 logits && logits.dispose && logits.dispose();
//             } catch { }
//             isProcessing = false;
//             return { text: currentText, confidence: confEMA || 0 };
//         }
//     }

// };

// export default aslModel;
