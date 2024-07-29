"use client";

import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

export default function Audio({ data }) {
  return (
    <>
      <AudioPlayer
        src={data?.[1]?.tracks?.[0]?.preview_url}
        volume={0.5}
        showSkipControls={false}
        showJumpControls={false}
        hasDefaultKeyBindings={false}
        customAdditionalControls={[]}
        layout="stacked-reverse"
      />
    </>
  );
}
