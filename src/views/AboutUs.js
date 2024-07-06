import React, { useRef, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "../components/Typography";
import { Holistic, POSE_CONNECTIONS, HAND_CONNECTIONS, FACEMESH_TESSELATION, FACEMESH_RIGHT_EYE, FACEMESH_RIGHT_EYEBROW, FACEMESH_LEFT_EYE, FACEMESH_LEFT_EYEBROW, FACEMESH_FACE_OVAL, FACEMESH_LIPS } from '@mediapipe/holistic';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import signMap from '../sign_to_prediction_index_map.json';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

function AboutUs() {
  const msg = new SpeechSynthesisUtterance()
  // const backgroundDots = "/productCTAImageDots.png";
  const holisticRef = useRef(null);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [prediction, setPrediction] = React.useState(null);
  // const [camera, setCamera] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [isRecording, setIsRecording] = useState(false); // State to control frame sending
  const isRecordingRef = useRef(isRecording);
  // const connect = window.drawConnectors;
  let sequenceData = []
  let detectionModel = null;
  let p2sMap = {};

  for (const [key, value] of Object.entries(signMap)) {
    p2sMap[value] = key;
  };

  // Update isProcessingRef.current whenever isProcessing changes. 
  // This ensures the onFrame callback always has the latest value.
  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]); 

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      isRecordingRef.current = false; // stop receiving new frames and start prediction
    } else {
      setPrediction(null); // clear out previous prediction
      isRecordingRef.current = true;
      setIsRecording(true);
    }
  };

  const decoder = (x) => {
    return p2sMap[x]};

  const speechHandler = (msg) => {
    msg.text = prediction;
    window.speechSynthesis.speak(msg);
  };

  const loadASLmodel = async () => {
    // detectionModel = await tf.loadGraphModel('https://asldetectionmodelversion2.s3.us-east-2.amazonaws.com/model.json') 
    // detectionModel = await tf.loadGraphModel('https://asldetectionmodel.s3.us-east-2.amazonaws.com/model.json'); // new model (Ayushi)
    detectionModel = await tf.loadGraphModel('https://aslnewmodel0701.s3.us-east-2.amazonaws.com/model.json'); // deepl new model
    console.log("model loaded");
  };

  const extractCoordinates = (results) => {
    const face = results.faceLandmarks ? results.faceLandmarks.map(res => [res.x, res.y, res.z]) : Array.from({ length: 468 }, () => [0, 0, 0]);
    // console.log("face",face.length);
    const pose = results.poseLandmarks ? results.poseLandmarks.map(res => [res.x, res.y, res.z]) : Array.from({ length: 33 }, () => [0, 0, 0]);
    // console.log("pose",pose.length);
    const lh = results.leftHandLandmarks ? results.leftHandLandmarks.map(res => [res.x, res.y, res.z]) : Array.from({ length: 21 }, () => [0, 0, 0]);
    // console.log("lh",lh.length);
    const rh = results.rightHandLandmarks ? results.rightHandLandmarks.map(res => [res.x, res.y, res.z]) : Array.from({ length: 21 }, () => [0, 0, 0]);
    // console.log("rh",rh.length);
    const concatenatedArray = [...face, ...lh, ...pose, ...rh];
    return concatenatedArray;
  };

  const plotCanvas = async (results) => {
    // https://github.com/google-ai-edge/mediapipe/blob/v0.10.10/docs/solutions/holistic.md
    // https://codepen.io/mediapipe/pen/LYRRYEw
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext('2d');
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.globalCompositeOperation = 'source-over';
    drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, { color: '#1E90FF', lineWidth: 2 });
    drawLandmarks(canvasCtx, results.poseLandmarks, { color: '#FF4500', lineWidth: 2, radius: 3 });
    drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, { color: '#C0C0C070', lineWidth: 1 });
    drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_RIGHT_EYE, { color: 'rgb(0,217,231)' });
    drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_RIGHT_EYEBROW, { color: 'rgb(0,217,231)' });
    drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LEFT_EYE, { color: 'rgb(255,138,0)' });
    drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LEFT_EYEBROW, { color: 'rgb(255,138,0)' });
    drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_FACE_OVAL, { color: '#E0E0E0', lineWidth: 4 });
    drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LIPS, { color: '#E0E0E0', lineWidth: 2 });
    drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, { color: 'white', lineWidth: 1 });
    drawLandmarks(canvasCtx, results.leftHandLandmarks, { color: 'white', fillColor: 'rgb(255, 138, 0)', lineWidth: 0.5, radius: 4 });
    drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS, { color: 'white', lineWidth: 1 });
    drawLandmarks(canvasCtx, results.rightHandLandmarks, { color: 'white', fillColor: 'rgb(0,217,231)', lineWidth: 0.5, radius: 4 });
    canvasCtx.restore();
  } ;

  const onResults = async (results) => {
    plotCanvas(results);

    if (isRecordingRef.current) {
      let landmarks = extractCoordinates(results);
      sequenceData.push(landmarks);
    } else {
      const n_frames = sequenceData.length;
      if (n_frames > 0) {
        console.log("sequenceData length", n_frames);
        console.log("sequenceData", sequenceData);
        // make prediction
        const tensorData = tf.tensor(sequenceData, [n_frames, 543, 3], 'float32');
        let output = await detectionModel.executeAsync(tensorData); // output is a tensor here
        output = output.softmax().dataSync(); // computer softmax -> output is an array
        console.log("output data", output);

        // let sign = tf.argMax(output.flatten());
        // let probability = output.flatten().max().dataSync()[0];
        let probability = Math.max(...output);
        let maxIndex = output.indexOf(probability);
        let pred = decoder(maxIndex);
        setPrediction(pred);
        // Get the maximum confidence value
        console.log("result:", pred, ", probability:", probability);
        sequenceData = [];
      }
    }
  }; // finish onResults function definition

  ////////////////////////////////////////////

  useEffect(() => {
    loadASLmodel();
    holisticRef.current = new Holistic({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
      }
    });
    holisticRef.current.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.5
    });
    holisticRef.current.onResults(onResults);

    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null
    ) {
      webcamRef.current = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => {
          await holisticRef.current.send({ image: webcamRef.current.video });
        },
        width: 640,
        height: 480,
      });
      webcamRef.current.start();
      setLoading(false);
    }
    return () => {
      webcamRef.current && webcamRef.current.stop();
    };
  }, []);



  useEffect(() => {
    if (prediction !== null){
      speechHandler(msg);
    }
  }, [prediction]);



    return (
      <>

        <Box sx={{ marginTop: "100 px" }}>
          <Typography variant="h2" marked="center" align="center" component="h2" sx={{ marginTop: "5 rem" }}>
            Try Signing below!
          </Typography>

          <Box sx={{ marginTop: "20 px" }}></Box>

          <Typography variant="h4" align="center" component="h4" sx={{ display: "flex", justifyContent: "center", marginTop: "10 px", fontSize: "14 px" }}>
            Prediction:<span style={{ color: '#3ab09e' }}> {prediction}</span>
            {/* <button onClick={() => speechHandler(msg)}><VolumeUpIcon /></button> */}
          </Typography>

          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, display: 'flex', justifyContent: 'center', flexDirection: 'column' }}
            open={loading}

          ><Typography variant="h3" align="center" component="span">
              <p style={{ color: '#3ab09e' }}> Loading...</p>
            </Typography>
            <div><CircularProgress sx={{ color: "#3ab09e" }} /></div>
          </Backdrop>

          <Container component="section" sx={{ mt: 5, mb: 0, display: "flex", minHeight: '500px' }} id="try">
            <center>
              <div className="App">
                <Webcam
                  ref={webcamRef}
                  style={{
                    position: "absolute",
                    marginLeft: "auto",
                    marginRight: "auto",
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    zindex: 9,
                    width: 640,
                    height: 480,
                  }}
                />
                <canvas
                  ref={canvasRef}
                  className="output_canvas"
                  style={{
                    position: "absolute",
                    marginLeft: "auto",
                    marginRight: "auto",
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    zindex: 9,
                    width: 640,
                    height: 480,
                  }}
                ></canvas>
                {/* <canvas ref={canvasRef} width={640} height={480}></canvas> */}
              </div>
            </center>
          </Container>
          
          <div style={{ textAlign: "center"}}>
            <button disabled={isRecording} onClick={toggleRecording}>
              Start Recording
            </button>

            <button disabled={!isRecording} onClick={toggleRecording}>
              Stop Recording
            </button>
          </div>

          {/* </>} */}
          <Box sx={{ display: 'flex', justifyContent: "center", }}>
            <Typography variant="h6" marked="left" gutterBottom>
              Tips:
            </Typography>
            <Typography variant="body3" color="textSecondary">
              <ol>
                <li>Position yourself centrally within the camera’s frame, as demonstrated in the sample video.</li>
                <li>Ensure that your hands, face, and pose are clearly visible.</li>
                <li>If you see a message stating “PLEASE TRY AGAIN”, attempt to perform the signs once more.</li>
                <li>You might also want to try the following signs: Hello, Aeroplane, and Zebra.</li>
                <li>The underlying Neural Networks are capable of recognizing up to 250 distinct signs.</li>
                <li>Please note that this website is currently in its Beta phase.</li>
              </ol>
            </Typography>
          </Box>
        </Box>
      </>
    );
}; // end AboutUs

  export default AboutUs;








  // import React, { useRef, useEffect, useState } from "react";
  // import Box from "@mui/material/Box";
  // import Grid from "@mui/material/Grid";
  // import Container from "@mui/material/Container";
  // import Typography from "../components/Typography";
  // import { Button } from "@mui/material";
  // import { Holistic } from "@mediapipe/holistic";
  // import * as cam from "@mediapipe/camera_utils";
  // import Webcam from "react-webcam";
  // import * as tf from "@tensorflow/tfjs";
  // import signMap from '../sign_to_prediction_index_map.json';
  // import Backdrop from '@mui/material/Backdrop';
  // import CircularProgress from '@mui/material/CircularProgress';
  // import * as Facemesh from "@mediapipe/face_mesh";
  // import VolumeUpIcon from '@mui/icons-material/VolumeUp';
  // import * as h from "@mediapipe/holistic";

  // function AboutUs() {
  //   const msg = new SpeechSynthesisUtterance()
  //   const backgroundDots = "/productCTAImageDots.png";
  //   const holisticRef = useRef(null);
  //   const webcamRef = useRef(null);
  //   const canvasRef = useRef(null);
  //   const [prediction, setPrediction] = React.useState(null);
  //   const [camera, setCamera] = React.useState(false);
  //   const [loading, setLoading] = React.useState(true);
  //   const [isRecording, setIsRecording] = useState(false);
  //   const [videoBlob, setVideoBlob] = useState(null);
  //   const connect = window.drawConnectors;
  //   let sequenceData = []
  //   let detectionModel = null;
  //   let p2sMap = {};

  //   for (const [key, value] of Object.entries(signMap)) {
  //     p2sMap[value] = key;
  //   }

  //   const decoder = (x) => p2sMap[x.dataSync()[0]];

  //   const speechHandler = (msg) => {
  //     msg.text = prediction
  //     window.speechSynthesis.speak(msg)
  //   }

  //   const loadASLmodel = async () => {
  //     // detectionModel = await tf.loadGraphModel('https://asldetectionmodelversion2.s3.us-east-2.amazonaws.com/model.json')
  //     detectionModel = await tf.loadGraphModel('https://asldetectionmodel.s3.us-east-2.amazonaws.com/model.json')
  //     console.log("model loaded")
  //   };

  //   const extractCoordinates = (results) => {
  //     const face = results.faceLandmarks ? results.faceLandmarks.map(res => [res.x, res.y, res.z]) : Array.from({ length: 468 }, () => [0, 0, 0]);
  //     const pose = results.poseLandmarks ? results.poseLandmarks.map(res => [res.x, res.y, res.z]) : Array.from({ length: 33 }, () => [0, 0, 0]);
  //     const lh = results.leftHandLandmarks ? results.leftHandLandmarks.map(res => [res.x, res.y, res.z]) : Array.from({ length: 21 }, () => [0, 0, 0]);
  //     const rh = results.rightHandLandmarks ? results.rightHandLandmarks.map(res => [res.x, res.y, res.z]) : Array.from({ length: 21 }, () => [0, 0, 0]);
  //     const concatenatedArray = [...face, ...lh, ...pose, ...rh];
  //     return concatenatedArray;
  //   };

  //   const onResults = async (results) => {
  //     if (!detectionModel) return; 
  //     const videoWidth = webcamRef.current.video.videoWidth;
  //     const videoHeight = webcamRef.current.video.videoHeight;

  //     canvasRef.current.width = videoWidth;
  //     canvasRef.current.height = videoHeight;

  //     const canvasElement = canvasRef.current;
  //     const canvasCtx = canvasElement.getContext("2d");
  //     canvasCtx.save();
  //     canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  //     canvasCtx.drawImage(
  //       results.image,
  //       0,
  //       0,
  //       canvasElement.width,
  //       canvasElement.height
  //     );
  //     let landmarks = extractCoordinates(results);
  //     sequenceData.push(landmarks);
  //     if (sequenceData.length === 50) {
  //       const tensorData = tf.tensor(sequenceData, [50, 543, 3], 'float32');
  //       let output = await detectionModel.predictAsync(tensorData);
  //       setLoading(false);
  //       let sign = tf.argMax(output.flatten());
  //       let confidence = output.flatten().max().dataSync()[0];
  //       let pred = decoder(sign);
  //       if (parseFloat(confidence) < 0.7 || pred === "shower" || pred === "garbage") {
  //         setPrediction("please try again!")
  //       } else {
  //         setPrediction(pred);
  //       }
  //       console.log("result", pred, "confidence", confidence);
  //       sequenceData = [];
  //     }
  //     canvasCtx.restore();
  //   }

    
  //   const startRecording = async () => {
  //     setIsRecording(true);
    
  //     // Get the MediaStream from the webcam
  //     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    
  //     // Create a MediaRecorder instance
  //     const mediaRecorder = new MediaRecorder(stream);
    
  //     // Array to store the recorded video chunks
  //     const chunks = [];
    
  //     // Listen for dataavailable event
  //     mediaRecorder.addEventListener('dataavailable', (event) => {
  //       chunks.push(event.data);
  //     });
    
  //     // Listen for stop event
  //     mediaRecorder.addEventListener('stop', () => {
  //       // Create a blob from the recorded video chunks
  //       const blob = new Blob(chunks, { type: 'video/webm' });
  //       console.log("stopping recording")
  //       // Save the blob
  //       setVideoBlob(blob);
    
  //       // Reset the chunks array
  //       chunks.length = 0;
    
  //       // Set isRecording to false
  //       setIsRecording(false);
  //     });
    
  //     // Start recording
  //     mediaRecorder.start();
    
  //     // Stop recording after 10 seconds
  //     setTimeout(() => {
  //       mediaRecorder.stop();
  //     }, 10000);
  //   };
    

    

  //   const predictSign = async () => {
  //     if (!videoBlob) return;

  //     // Create a video element and set the src to the recorded video blob
  //     const videoElement = document.createElement('video');
  //     videoElement.src = URL.createObjectURL(videoBlob);
  //     await videoElement.play();

  //     // Loop through the video frames
  //     while (videoElement.currentTime < videoElement.duration) {
  //       const canvas = document.createElement('canvas');
  //       const context = canvas.getContext('2d');

  //       // Draw the current frame on a canvas
  //       context.drawImage(videoElement, 0, 0, videoElement.videoWidth, videoElement.videoHeight);

  //       // Get the image data from the canvas
  //       const imageData = context.getImageData(0, 0, videoElement.videoWidth, videoElement.videoHeight);

  //       // Pass the image data to the holistic model
  //       const results = await holisticRef.current.send({ image: imageData });

  //       // Extract landmarks and pass them to the ASL detection model
  //       let landmarks = extractCoordinates(results);
  //       sequenceData.push(landmarks);
  //       if (sequenceData.length === 50) {
  //         const tensorData = tf.tensor(sequenceData, [50, 543, 3], 'float32');
  //         let output = await detectionModel.predict(tensorData);
  //         console.log("output", output);
  //         setLoading(false);
  //         let sign = tf.argMax(output.flatten());
  //         let confidence = output.flatten().max().dataSync()[0];
  //         let pred = decoder(sign);
  //         if (parseFloat(confidence) < 0.6 || pred === "shower" || pred === "garbage") {
  //           setPrediction("please try again!")
  //         } else {
  //           setPrediction(pred);
  //         }
  //         console.log("result", pred, "confidence", confidence);
  //         sequenceData = [];
  //       }

  //       // Move to the next frame
  //       videoElement.currentTime += 1 / 30; // Assuming 30 fps
  //     }
  //   };


  //   useEffect(() => {
  //     loadASLmodel();
  //     holisticRef.current = new Holistic({
  //       locateFile: (file) => {
  //         return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
  //       }
  //     });
  //     holisticRef.current.setOptions({
  //       minDetectionConfidence: 0.6,
  //       minTrackingConfidence: 0.5
  //     });
  //     holisticRef.current.onResults(onResults);

  //     if (
  //       typeof webcamRef.current !== "undefined" &&
  //       webcamRef.current !== null
  //     ) {
  //       webcamRef.current = new cam.Camera(webcamRef.current.video, {
  //         onFrame: async () => {
  //           await holisticRef.current.send({ image: webcamRef.current.video });
  //         },
  //         width: 640,
  //         height: 480,
  //       });
  //       webcamRef.current.start();
  //     }
  //     return () => {
  //       webcamRef.current && webcamRef.current.stop();
  //     };
  //   }, []);
  //   useEffect(() => {
  //     speechHandler(msg);
  //   }, [prediction])

  //   return (
  //     <>
  //       <Box sx={{ marginTop: "100 px" }}>
  //         <Typography variant="h2" marked="center" align="center" component="h2" sx={{ marginTop: "5 rem" }}>
  //           Try Signing below!
  //         </Typography>
  //         <Box sx={{ marginTop: "20 px" }}></Box>
  //         <Typography variant="h4" align="center" component="h4" sx={{ display: "flex", justifyContent: "center", marginTop: "10 px", fontSize: "14 px" }}>
  //           Prediction:<span style={{ color: '#3ab09e' }}> {prediction}</span>
  //         </Typography>
  //         <Backdrop
  //           sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, display: 'flex', justifyContent: 'center', flexDirection: 'column' }}
  //           open={loading}
  //         ><Typography variant="h3" align="center" component="span">
  //             <p style={{ color: '#3ab09e' }}> Loading...</p>
  //           </Typography>
  //           <div><CircularProgress sx={{ color: "#3ab09e" }} /></div>
  //         </Backdrop>
  //         <Container component="section" sx={{ mt: 10, mb: 10, display: "flex", minHeight: '500px' }} id="try">
  //           <center>
  //             <div className="App">
  //               <Webcam
  //                 ref={webcamRef}
  //                 style={{
  //                   position: "absolute",
  //                   marginLeft: "auto",
  //                   marginRight: "auto",
  //                   left: 0,
  //                   right: 0,
  //                   textAlign: "center",
  //                   zindex: 9,
  //                   width: 640,
  //                   height: 480,
  //                 }}
  //               />{" "}
  //               <canvas
  //                 ref={canvasRef}
  //                 className="output_canvas"
  //                 style={{
  //                   position: "absolute",
  //                   marginLeft: "auto",
  //                   marginRight: "auto",
  //                   left: 0,
  //                   right: 0,
  //                   textAlign: "center",
  //                   zindex: 9,
  //                   width: 640,
  //                   height: 480,
  //                 }}
  //               ></canvas>
  //             </div>
  //           </center>
  //         </Container>
  //         <Button onClick={startRecording}>
  //           {isRecording ? "Recording..." : "Record"}
  //         </Button>
  //         {videoBlob && !isRecording && (
  //           <Button onClick={predictSign}>Predict</Button>
  //         )}
  //         <Box sx={{ display: 'flex', justifyContent: "center", }}>
  //           <Typography variant="h6" marked="left" gutterBottom>
  //             Tips:
  //           </Typography>
  //           <Typography variant="body3" color="textSecondary">
  //             <ol>
  //               <li>Position yourself centrally within the camera’s frame, as demonstrated in the sample video.</li>
  //               <li>Ensure that your hands, face, and pose are clearly visible.</li>
  //               <li>If you see a message stating “PLEASE TRY AGAIN”, attempt to perform the signs once more.</li>
  //               <li>You might also want to try the following signs: Hello, Aeroplane, and Zebra.</li>
  //               <li>The underlying Neural Networks are capable of recognizing up to 250 distinct signs.</li>
  //               <li>Please note that this website is currently in its Beta phase.</li>
  //             </ol>
  //           </Typography>
  //         </Box>
  //       </Box>
  //     </>
  //   );
  // }

  // export default AboutUs;
