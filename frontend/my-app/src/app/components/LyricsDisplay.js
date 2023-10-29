import { useEffect, useState } from "react";
import { WebVTTParser } from 'webvtt-parser';

const LyricsDisplay = () => {
  const [lyrics, setLyrics] = useState([]);
  const [currentLyric, setCurrentLyric] = useState("");
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);

  useEffect(() => {
    const audioPlayer = document.getElementById("audio-player");
    if (audioPlayer) {
      // Reference local audio and .vtt files
      audioPlayer.src = "to.mp3";
      fetch("to.vtt")
        .then((response) => response.text())
        .then((vttText) => {
            const parser = new WebVTTParser();
            const tree = parser.parse(vttText, 'metadata');
            const parsedLyrics = tree.cues.map(x => {
                const startTime = x.startTime
                const endTime = x.endTime
                const text = x.text
                return {startTime, endTime, text}
            })
            setLyrics(parsedLyrics);
        });
    }
  }, []);

  useEffect(() => {
    const audioPlayer = document.getElementById("audio-player");

    if (audioPlayer) {
      const updateLyrics = () => {
        const currentTime = audioPlayer.currentTime;
        for (let i = 0; i < lyrics.length; i++) {
            if (currentTime > lyrics[i].startTime && currentTime < lyrics[i].endTime) {
                setCurrentLyric(lyrics[i].text);
                // setCurrentLyricIndex(i);
                break;
            }
        }
      };

      audioPlayer.addEventListener("timeupdate", updateLyrics);

      // Clean up the event listener when the component unmounts
      return () => {
        audioPlayer.removeEventListener("timeupdate", updateLyrics);
      };
    }
  }, [lyrics, currentLyricIndex]);

  return (
    <div>
      <div id="lyrics-container">
        <p>{currentLyric}</p>
      </div>
    </div>
  );
};

export default LyricsDisplay;