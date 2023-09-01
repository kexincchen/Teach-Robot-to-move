

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    console.log("getUserMedia supported.");
    navigator.mediaDevices
      .getUserMedia(
        // constraints - only audio needed for this web
        {
          audio: true,
        },
      )

      // Success callback
      .then(function (stream) {
        const mediaRecorder = new MediaRecorder(stream);

        document.getElementById('hints').onclick = () => {
            mediaRecorder.start();
            console.log(mediaRecorder.state);
            console.log("recorder started");
        
            document.getElementById('hints').disabled = true;
            document.getElementById('stop').disabled = false;
        };
        
        let chunks = [];
        
        mediaRecorder.ondataavailable = function (e) {
          chunks.push(e.data);
        };
        
        document.getElementById('stop').onclick = () => {
            mediaRecorder.stop();
            console.log(mediaRecorder.state);
            console.log("[stop button] recorder stopped");
        
            document.getElementById('hints').disabled = false;
            document.getElementById('stop').disabled = true;
        };

        mediaRecorder.onstop = () => {
            console.log("[mediaRecorder] recorder stopped");
            let audioBlob = new Blob(chunks, { type: "audio/wav"});
            chunks = [];
            //Create a URL from Blob to download
            const audioUrl = URL.createObjectURL(audioBlob);
            document.getElementById('downloadLink').href = audioUrl;
            document.getElementById('downloadLink').style.display = 'block';
        
            uploadAudio(audioBlob);
        }; 
        
        
      })
  
      // Error callback
      .catch(function (err) {
        console.log("The following getUserMedia error occured: " + err);
      });
  } else {
    console.log("getUserMedia not supported on your browser!");
  }



function uploadAudio(blob) {
    const formData = new FormData();
    formData.append('file', blob, 'recording.wav');

    fetch('/processing/speech-to-text', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
      console.log(data.textOutput);
        if (data.textOutput) {
            document.getElementById('status').textContent = "Audio uploaded successfully!";
            var diagnostic = document.querySelector('.output');
            diagnostic.value =  data.textOutput;
        } else {
            document.getElementById('status').textContent = "Error uploading audio.";
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('status').textContent = "Error uploading audio.";
    });
}

