import React from 'react';
import Webcam from 'react-webcam';
import MediaRecorder from 'react-media-recorder';

const WebcamRecorder = () => {
  const webcamRef = React.useRef(null);

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        width={640}
        height={480}
        screenshotFormat="image/jpeg"
      />
      <MediaRecorder
        video
        onRecordingComplete={(videoBlob) => {
          // Handle the recorded video, e.g., save it to state or upload it
        }}
      >
        {({ startRecording, stopRecording, mediaBlobUrl, status }) => (
          <div>
            <button onClick={startRecording} disabled={status === 'recording'}>
              Start Recording
            </button>
            <button onClick={stopRecording} disabled={status !== 'recording'}>
              Stop Recording
            </button>
          </div>
        )}
      </MediaRecorder>
    </div>
  );
};

export default WebcamRecorder;
