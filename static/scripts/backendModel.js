export const backendModel = (function(){
    let mediaRecorder = null;
    let chunks = [];
    const start = document.querySelector('#start-recording');
    const stopBtn = document.getElementById('stop');
    const notice = document.getElementById("record-notice");

    function startProcessing(model){
        stopBtn.style.display = "inline";
        start.style.display = "none";
        notice.style.visibility = "visible";
        console.log("mediaRecorder is ready");
        console.log(model + " is used.");
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            console.log("Media is supported.");
            navigator.mediaDevices
              .getUserMedia({ audio: true })
              .then(function (stream) {
                mediaRecorder = new MediaRecorder(stream);

                // The entry of start recording
                mediaRecorder.start();
                mediaRecorder.ondataavailable = function (e) {
                    chunks.push(e.data);
                };
            
                stopBtn.addEventListener("click", stopRecording);

                mediaRecorder.onstop = function() {
                    const audioBlob = new Blob(chunks, { type: "audio/wav" });
                    chunks = [];
                    uploadAudio(audioBlob, model);
                    stream.getTracks().forEach(track => track.stop());
                };

            })
            .catch(function (err) {
                console.log("The following getUserMedia error occurred: " + err);
        });
        }
        else {
            console.log("getUserMedia not supported on your browser!");
        }
    }// end of startProcessing

    function stopRecording() {
        if (mediaRecorder) {
            mediaRecorder.stop();
            console.log(mediaRecorder.state);
            console.log("recorder stopped");
            stopBtn.style.display = "none";
            start.style.display = "inline";
            notice.style.visibility = "hidden";
            stopBtn.removeEventListener("click", stopRecording);
        }
    }

    function uploadAudio(blob, model) {
        const formData = new FormData();
        formData.append('file', blob, 'recording.wav');
        fetch(('/processing/stt/'+ model), {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.textOutput) {
                console.log ("Audio uploaded successfully!");
                let diagnostic = document.querySelector('.output');
                diagnostic.value =  data.textOutput;
                console.log(model + " is used.");
                console.log(data.textOutput);
            } else {
                console.log ( "Error uploading audio.");
             }
        })
        .catch(error => {
            console.error('Error:', error);
            
        });
      }
      
    return {
        startProcessing: startProcessing
    };
})();