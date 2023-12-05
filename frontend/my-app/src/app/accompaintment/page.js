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
    const waveformRef2 = useRef(null);
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
    const [accompaintment, setAccompaintment] = useState(null)

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
            height: 50,
            barHeight: 10,
          });
    
          // Load the selected audio file
          wavesurfer.load(URL.createObjectURL(file));

          wavesurferRef.current = wavesurfer;
    
          // Clean up on component unmount
          return () => wavesurfer.destroy();
        }
      }, [file]);

      useEffect(() => {
        if (accompaintment) {
          // Initialize WaveSurfer
          const wavesurfer = WaveSurfer.create({
            container: waveformRef2.current,
            waveColor: 'violet',
            progressColor: 'purple',
            responsive: true,
            height: 100,
            barHeight: 17,
          });
    
          // Load the selected audio file
          wavesurfer.load(URL.createObjectURL(accompaintment));

          wavesurferRef.current = wavesurfer;
    
          // Clean up on component unmount
          return () => wavesurfer.destroy();
        }
      }, [accompaintment]);
  
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
            const formData = new FormData();
            formData.append('instruments', JSON.stringify(instruments));
            formData.append('audioFile', file);
            
            axios
                .post('http://127.0.0.1:8000/api/melodyGenerate/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                responseType: 'blob', // Set the response type to 'blob' for binary data
                })
                .then(response => {
                    // Handle the response, which is a blob representing the audio file
                    const audioBlob = new Blob([response.data], { type: 'audio/wav' });

                    // Create a temporary URL for the blob
                    const audioUrl = URL.createObjectURL(audioBlob);
                    
                    // Set the generated melody as the current accompaniment
                    setAccompaintment(audioBlob);
                    console.log(audioBlob)
                    
                    // Now you can use audioUrl to play or display the processed audio file

                    console.log('Response from server:', response);
                })
                .catch(error => {
                    console.error('Error receiving audio file:', error);
                });
        }          
    };

    return (
        <div>
            <div>
                <h1 className={styles.textCenter}>Accompaintment Generation</h1>
            </div>


            <form onSubmit={handleFileChange}>
                    <div className="mt-5">
                        <div className="mr-auto ml-auto w-1/2 relative border-dotted h-20 rounded-lg border-2 border-pink-700 bg-pink-200 flex justify-center items-center">
                            <div className="absolute">
                                <div className="flex flex-col items-center"><span className="block text-gray-400 font-normal">Upload melody</span></div>
                            </div> 
                            <input type="file" className="h-full w-full opacity-0" name="" onChange={handleFileChange}></input>
                        </div>
                    </div>
            </form>

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

                {accompaintment && (
                        <>
                            <div className={styles.generatedMelodyTitle}>
                                <h3>Generated Accompaintment</h3>
                            </div>
                            <div ref={waveformRef2} onClick={handleWaveformClick} className={styles.waveformContainer} />
                        </>
                )}
            </>
            )}
        </div>
    );
};

export default AccompaintmentPage;
