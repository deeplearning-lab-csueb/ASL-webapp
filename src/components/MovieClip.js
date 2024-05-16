import React from "react";
import YouTube from "react-youtube";

const MovieClip = (props) => {
    const opts = {
        height: '480',  // Increased height
        width: '854',
        playerVars: {
            autoplay: 1,
            controls: 1,
            loop: 1,
            playlist: props.videoId,
        },
    };

    const _onReady = (event) => {
        event.target.pauseVideo();
    };

    return <YouTube videoId={props.videoId} opts={opts} onReady={_onReady} id="video" />;
};

export default MovieClip;
