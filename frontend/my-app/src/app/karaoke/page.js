"use client";

import LyricsDisplay from "../components/LyricsDisplay";
import AudioPlayer from "../components/AudioPlayer";

const IndexPage = () => {
    return (
        <div>
        <h1>Karaoke</h1>
        <AudioPlayer/>
        <LyricsDisplay/>
        </div>
    );
};

export default IndexPage;
