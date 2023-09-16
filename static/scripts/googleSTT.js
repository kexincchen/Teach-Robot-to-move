
/**
 * whisperSTT Module
 * 
 * This module provides an encapsulated interface for initializing and controlling
 * the whisper speech-to-text functionality using the getUserMedia API.
 * 
 * Usage:
 * 1. Initialize the whisper functionality using whisperSTT.init()
 * 2. Start recording using whisperSTT.startRecording()   **already in init()
 * 3. Stop recording using whisperSTT.stopRecording()     **already in init()
 * 4. Remove any associated event listeners using whisperSTT.removeListeners()
 * 
 * Note: Ensure the module is correctly imported before using its methods.
 * 
 * @module googleSTT
 */

// Define the whisperSTT module
export const googleSTT = (function() {
    let mediaRecorder = null;
    const start = document.querySelector('#start-recording');
    const stopBtn = document.getElementById('stop');
    const notice = document.getElementById("record-notice");
  
    function init() {
        stopBtn.style.display = "inline";
        notice.style.visibility = "visible";
        start.style.display = "none";
  
        console.log("Google cloud is ready");
  
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            console.log("getUserMedia supported.");
            navigator.mediaDevices
                .getUserMedia({ audio: true })
                .then(function (stream) {
                    mediaRecorder = new MediaRecorder(stream);
                    let chunks = [];
                    mediaRecorder.start();
                    console.log(mediaRecorder.state);
                    console.log("recorder started");
  
                    mediaRecorder.ondataavailable = function (e) {
                        chunks.push(e.data);
                    };
  
                    stopBtn.addEventListener("click", stopRecording);
  
                    mediaRecorder.onstop = function() {
                        //console.log("Whisper recorder stopped");
                        const audioBlob = new Blob(chunks, { type: "audio/wav" });
                        chunks = [];
                        uploadAudio(audioBlob);
                        stream.getTracks().forEach(track => track.stop());
                    };
                })
                .catch(function (err) {
                    console.log("The following getUserMedia error occurred: " + err);
                });
        } else {
            console.log("getUserMedia not supported on your browser!");
        }
    }
  
    function stopRecording() {
        if (mediaRecorder) {
            mediaRecorder.stop();
            console.log(mediaRecorder.state);
            console.log("recorder stopped");
            stopBtn.style.display = "none";
            start.style.display = "inline";
            notice.style.visibility = "hidden";
        }
    }
  
    function removeListeners() {
        stopBtn.removeEventListener("click", stopRecording);
    }
    // Upload audio blob to server
    function uploadAudio(blob) {
      const formData = new FormData();
      formData.append('file', blob, 'recording.wav');
    
      fetch('/processing/stt/google-cloud', {
          method: 'POST',
          body: formData
      })
      .then(response => response.json())
      .then(data => {
        console.log(data.textOutput);
          if (data.textOutput) {
              console.log ("Audio uploaded successfully!");
              let diagnostic = document.querySelector('.output');
              diagnostic.value =  data.textOutput;
          } else {
              console.log ( "Error uploading audio.");
           }
      })
      .catch(error => {
          console.error('Error:', error);
          //document.getElementById('status').textContent = "Error uploading audio.";
      });
    }
  
    return {
        init: init,
        removeListeners: removeListeners
    };
  })();
  
  
  
  