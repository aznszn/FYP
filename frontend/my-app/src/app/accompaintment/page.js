"use client";
import { useState, useRef, useEffect } from "react";

import axios from "axios";
import WaveSurfer from 'wavesurfer.js';

import styles from "./page.module.css"
import "../globals.css"

const AccompaintmentPage = () => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null)
    const waveformRef = useRef(null);
    const wavesurferRef = useRef(null);
    const [instruments, setInstruments] = useState([])
    const [instrumentColor, setInstrumentColor] = useState({
        'drums':    'blueviolet',
        'piano':    'blueviolet', 
        'bass':     'blueviolet'
    })
    const [hover, setHover] = useState({
        'drums':    false,
        'piano':    false,
        'bass':     false,
    })

    useEffect(() => {
        console.log(instruments)
    }, [instruments])

    useEffect(() => {
        if (file) {
          // Initialize WaveSurfer
          const wavesurfer = WaveSurfer.create({
            container: waveformRef.current,
            waveColor: 'violet',
            progressColor: 'purple',
            responsive: true,
            height: 100,
            barHeight: 17,
          });
    
          // Load the selected audio file
          wavesurfer.load(URL.createObjectURL(file));

          wavesurferRef.current = wavesurfer;
    
          // Clean up on component unmount
          return () => wavesurfer.destroy();
        }
      }, [file]);
  
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        
        if (selectedFile) {
            // Check if the file is an mp3 or wav file
            if (!selectedFile.name.match(/\.(mp3|wav)$/)) {
                setError('Please upload an MP3 or WAV file.');
                fileInputRef.current.value = ''
                return;
            }
        
            // Check if the file duration is between 10 to 30 seconds
            const audio = new Audio();
            audio.src = URL.createObjectURL(selectedFile);
        
            audio.addEventListener('loadedmetadata', () => {
                const duration = audio.duration;
                if (duration < 10 || duration > 30) {
                    setError('File duration should be between 10 to 30 seconds.');
                    fileInputRef.current.value = ''
                    return;
                }
        
                // If all conditions are met, set the file
                setFile(selectedFile);
                setError('');
            });
        }
    };

    const handleWaveformClick = () => {
        // Play or pause the audio when clicking on the waveform
        if (wavesurferRef.current) {
          wavesurferRef.current.playPause();
        }
    };

    const handleInstrumentClicked = (event) => {
        const clickedText = event.target.textContent.toLowerCase();
        const instrument = instruments.find(instrument => instrument == clickedText)
        
        // if instrument was already selected
        if (instrument) {
            setInstruments(instruments.filter(instrument => instrument != clickedText))
            setInstrumentColor({...instrumentColor, [clickedText]: 'blueviolet'})
        }
        else {
            setInstruments([...instruments, clickedText])
            setInstrumentColor({...instrumentColor, [clickedText]: '#5e0087'})      
        }
    };

    const handleSend = () => {
        if (instruments.length > 0) {
            const formData = new FormData()
            formData.append('instruments', JSON.stringify(instruments))
            formData.append('audioFile', file)
            axios
            .post('http://127.0.0.1:8000/api/melodyGenerate/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
            .then(response => {
                console.log('Response from server: ', response.data);
            })
            .catch(error => {
                console.error(error);
            });
        }
    }

    return (
        <div>
            <div>
                <h2 className={styles.textCenter}>Accompaintment Generation</h2>
            </div>

            <div className={styles.inputFieldContainer}>
                <div>
                    <input 
                    className={styles.inputFile} 
                    type="file" 
                    accept=".mp3, .wav" 
                    onChange={handleFileChange}
                    ref={fileInputRef}/>
                </div>
            </div>
            
            <div className={styles.textCenter}>
                {error && <p>{error}</p>}
            </div>

            {file && (
            <>
              <div ref={waveformRef} onClick={handleWaveformClick} className={styles.waveformContainer} />
            
                <div className={styles.instrumentsContainer}>
                    <div onMouseEnter={() => setHover({...hover, drums: true})} onMouseLeave={() => setHover({...hover, drums: false})} style={{backgroundColor: hover['drums'] ? "#5e0087" : instrumentColor['drums']}} className={styles.instruments} onClick={handleInstrumentClicked}>Drums</div>
                    <div onMouseEnter={() => setHover({...hover, piano: true})} onMouseLeave={() => setHover({...hover, piano: false})} style={{backgroundColor: hover['piano'] ? "#5e0087" : instrumentColor['piano']}} className={styles.instruments} onClick={handleInstrumentClicked}>Piano</div>
                    <div onMouseEnter={() => setHover({...hover, bass: true})} onMouseLeave={() => setHover({...hover, bass: false})} style={{backgroundColor: hover['bass'] ? "#5e0087" : instrumentColor['bass']}} className={styles.instruments} onClick={handleInstrumentClicked}>Bass</div>
                </div>

                <div className={styles.melodyButtonContainer}>
                    <button className={styles.melodyButton} onClick={handleSend}>Generate Melody</button>
                </div>
            </>
            )}
        </div>
    );
};

export default AccompaintmentPage;
