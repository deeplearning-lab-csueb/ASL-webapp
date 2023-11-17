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
function AboutUs() {
  const backgroundDots = "/productCTAImageDots.png";
  const holisticRef = useRef(null);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [prediction, setPrediction] = React.useState(null);
  const [camera, setCamera] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  // const connect = window.drawConnectors;
  let sequenceData = []
  let detectionModel = null;
  let p2sMap = {};

  for (const [key, value] of Object.entries(signMap)) {
    p2sMap[value] = key;
  }

  const decoder = (x) => p2sMap[x.dataSync()[0]];


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

    // console.log(results);
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
    let landmarks = extractCoordinates(results);
    sequenceData.push(landmarks);
    if (sequenceData.length === 100) {
      const tensorData = tf.tensor(sequenceData, [100, 543, 3], 'float32');
      let output = await detectionModel.predictAsync(tensorData);
      setLoading(false);
      // output=tf.tensor(output, [250], 'float32');
      // output.array().then(array => console.log(array));
      let sign = tf.argMax(output.flatten());
      // sign.array().then(array => console.log(array))
      console.log("result", decoder(sign));
      setPrediction(decoder(sign))
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
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
    holisticRef.current.onResults(onResults);
    console.log(holisticRef.current);

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


  return (
    <>


      <Typography variant="h4" marked="center" align="center" component="h2">
        Try Signing below!
      </Typography>
      <Typography variant="h6" marked="center" align="center" component="span" sx={{ display: 'flex', justifyContent: 'center' }}>
        Pridiction:
      </Typography>
      {/* <Button varient="contained" onClick={() => setCamera(!camera)}>
        Toggle Camera
      </Button> */}
      {/* {camera && <> */}
      <Typography variant="h3" align="center" component="span">
        <p style={{ color: '#3ab09e' }}> {prediction}</p>
      </Typography>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, display: 'flex', justifyContent: 'center', flexDirection: 'column' }}
        open={loading}
      // onClick={handleClose}
      ><Typography variant="h3" align="center" component="span">
          <p style={{ color: '#3ab09e' }}> Please Wait, Loading Model</p>
        </Typography>
        <div><CircularProgress color="inherit" /></div>
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
    </>
  );
}

export default AboutUs;



