import React, { useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "../components/Typography";
import { Button } from "@mui/material";
import { Holistic } from "@mediapipe/holistic";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import signMap from '../sign_to_prediction_index_map.json';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import * as Facemesh from "@mediapipe/face_mesh";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
// import * as Hands from "@mediapipe/hands";
// import * as Pose from "@mediapipe/pose";
import * as h from "@mediapipe/holistic";
// faceLandmarks, poseLandmarks, leftHandLandmarks, rightHandLandmarks
function AboutUs() {
  const msg = new SpeechSynthesisUtterance()
  const backgroundDots = "/productCTAImageDots.png";
  const holisticRef = useRef(null);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [prediction, setPrediction] = React.useState(null);
  const [camera, setCamera] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const connect = window.drawConnectors;
  let sequenceData = []
  let detectionModel = null;
  let p2sMap = {};

  for (const [key, value] of Object.entries(signMap)) {
    p2sMap[value] = key;
  }

  const decoder = (x) => p2sMap[x.dataSync()[0]];

  const speechHandler = (msg) => {
    msg.text = prediction
    window.speechSynthesis.speak(msg)
  }

  const loadASLmodel = async () => {
    detectionModel = await tf.loadGraphModel('https://asldetectionmodelversion2.s3.us-east-2.amazonaws.com/model.json')
    console.log("model loaded")
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

  const onResults = async (results) => {

    console.log(results);
    // const video = webcamRef.current.video;
    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;

    // Set canvas width
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );
    // if (results.faceLandmarks) {
    //   for (const landmarks of results.faceLandmarks) {
    //     connect(canvasCtx, landmarks, Facemesh.FACEMESH_TESSELATION, {
    //       color: "#C0C0C070",
    //       lineWidth: 1,
    //     });
    //     connect(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_EYE, {
    //       color: "#FF3030",
    //     });
    //     connect(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_EYEBROW, {
    //       color: "#FF3030",
    //     });
    //     connect(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_EYE, {
    //       color: "#30FF30",
    //     });
    //     connect(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_EYEBROW, {
    //       color: "#30FF30",
    //     });
    //     connect(canvasCtx, landmarks, Facemesh.FACEMESH_FACE_OVAL, {
    //       color: "#E0E0E0",
    //     });
    //     connect(canvasCtx, landmarks, Facemesh.FACEMESH_LIPS, {
    //       color: "#E0E0E0",
    //     });
    //   }
    // }
    let landmarks = extractCoordinates(results);
    sequenceData.push(landmarks);
    if (sequenceData.length === 50) {
      const tensorData = tf.tensor(sequenceData, [50, 543, 3], 'float32');
      let output = await detectionModel.predictAsync(tensorData);
      setLoading(false);
      // output=tf.tensor(output, [250], 'float32');
      // output.array().then(array => console.log(array));
      let sign = tf.argMax(output.flatten());
      let confidence = output.flatten().max().dataSync()[0];
      let pred = decoder(sign);
      if (parseFloat(confidence) < 0.6 || pred === "shower" || pred === "garbage") {
        setPrediction("please try again!")
      } else {
        setPrediction(pred);

      }
      // Get the maximum confidence value
      console.log("result", pred, "confidence", confidence);

      sequenceData = [];
    }
    canvasCtx.restore();
  }

  useEffect(() => {
    loadASLmodel();
    holisticRef.current = new Holistic({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
      }
    });
    holisticRef.current.setOptions({
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.5
    });
    holisticRef.current.onResults(onResults);
    // console.log(holisticRef.current);

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
    }
    return () => {
      webcamRef.current && webcamRef.current.stop();
    };
  }, []);
  useEffect(() => {
    speechHandler(msg);
  }, [prediction])

    return (
      <>

        <Box sx={{ marginTop: "100 px" }}>
          <Typography variant="h2" marked="center" align="center" component="h2" sx={{ marginTop: "5 rem" }}>
            Try Signing below!
          </Typography>
          {/* <Typography variant="h6" marked="center" align="center" component="span" sx={{ display: 'flex', justifyContent: 'center' }}>
          Pridiction:
        </Typography> */}
          {/* <Button varient="contained" onClick={() => setCamera(!camera)}>
          Toggle Camera
        </Button> */}
          {/* {camera && <> */}
          <Box sx={{ marginTop: "20 px" }}></Box>
          <Typography variant="h4" align="center" component="h4" sx={{ display: "flex", justifyContent: "center", marginTop: "10 px", fontSize: "14 px" }}>
            Prediction:<span style={{ color: '#3ab09e' }}> {prediction}</span>
            {/* <button onClick={() => speechHandler(msg)}><VolumeUpIcon /></button> */}
          </Typography>
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, display: 'flex', justifyContent: 'center', flexDirection: 'column' }}
            open={loading}
          // onClick={handleClose}
          ><Typography variant="h3" align="center" component="span">
              <p style={{ color: '#3ab09e' }}> Loading...</p>
            </Typography>
            <div><CircularProgress sx={{ color: "#3ab09e" }} /></div>
          </Backdrop>
          <Container component="section" sx={{ mt: 10, mb: 10, display: "flex", minHeight: '500px' }} id="try">
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
                />{" "}
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
              </div>
            </center>
          </Container>
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
  }

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
  //     detectionModel = await tf.loadGraphModel('https://asldetectionmodelversion2.s3.us-east-2.amazonaws.com/model.json')
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
  //       if (parseFloat(confidence) < 0.6 || pred === "shower" || pred === "garbage") {
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
  //         let output = await detectionModel.predictAsync(tensorData);
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

