// Global variables
let selectedModel = 'nativejs';  // Default model

// Switch the model when the user changes the selection
document.getElementById('modelSelect').addEventListener('change', function() {
    selectedModel = this.value;
    if (selectedModel === 'whisper') {
        console.log("switched to whisper");
        // document.getElementById('hints').removeEventListener("click");
        initMediaRecorder();
    } else if (selectedModel === 'nativejs') {
        console.log("switched to nativejs");
    }
});

// Common method to start recognition
function startRecognition() {
    if (selectedModel === 'whisper') {
        // handleHintsClick(recognition);
        
    } else if (selectedModel === 'nativejs') {
        document.getElementById('hints').click(); // trigger native JS click event
        
    }
}

// Initialize Speech Recognition
function initSpeechRecognition() {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    window.SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

    const recognition = new window.SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    return recognition;
}

// Handle start click
function handleStartClick(recognition) {
    console.log('Ready to receive a command.');
    recognition.start();

    
}

// Handle recognition results
function handleRecognitionResult(event, diagnostic) {
    const result = event.results[0][0].transcript;
    console.log(result);
    diagnostic.value = result;
}

// Handle recognition errors
function handleRecognitionError(event, diagnostic) {
    diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
}

// Handle form submission
async function handleFormSubmit(form, outputDiv) {
    const inputText = form.draft.value;

    const response = await fetch('/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            input_text: inputText
        })
    });

    const data = await response.json();
    outputDiv.innerHTML = `<h3>Generated Output:</h3><p>${data.output_text}</p>`;
}

// Main code
const recognition = initSpeechRecognition();
const diagnostic = document.querySelector('.output');
const start = document.querySelector('#start-recording');
const form = document.getElementById('user-form');
const stopBtn = document.getElementById('stop');
const outputDiv = document.getElementById('text-output');

// Set up event listeners
start.addEventListener("click", () => {
    console.log("Start clicking...");
    handleStartClick(recognition);
});
recognition.onresult = (event) => handleRecognitionResult(event, diagnostic);
// recognition.onspeechend = () => recognition.stop();
recognition.onerror = (event) => handleRecognitionError(event, diagnostic);
stopBtn.addEventListener("click", () => recognition.stop());
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleFormSubmit(form, outputDiv);
});


function initMediaRecorder() {
    console.log("whisper is ready");
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log("getUserMedia supported.");
        
        return navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then(function (stream) {
            const mediaRecorder = new MediaRecorder(stream);
            let chunks = [];

            // Start recording
            document.getElementById('hints').onclick = function() {
                if (selectedModel === 'nativejs') {
                    mediaRecorder.start();
                    console.log(mediaRecorder.state);
                    console.log("recorder started");
                    document.getElementById('hints').disabled = true;
                    document.getElementById('stop').disabled = false;
                }
            };
            
            // On data available
            mediaRecorder.ondataavailable = function (e) {
                chunks.push(e.data);
            };

            // Stop recording
            document.getElementById('stop').onclick = function() {
                if (selectedModel === 'nativejs') {
                    mediaRecorder.stop();
                    console.log(mediaRecorder.state);
                    console.log("recorder stopped");
                    document.getElementById('hints').disabled = false;
                    document.getElementById('stop').disabled = true;
                }
            };

            // On stop
            mediaRecorder.onstop = function() {
                console.log("recorder stopped");
                const audioBlob = new Blob(chunks, { type: "audio/wav" });
                chunks = [];
                const audioUrl = URL.createObjectURL(audioBlob);
                document.getElementById('downloadLink').href = audioUrl;
                document.getElementById('downloadLink').style.display = 'block';
                uploadAudio(audioBlob);
            };

            return mediaRecorder;
          })
          .catch(function (err) {
            console.log("The following getUserMedia error occurred: " + err);
            return null;
          });
    } else {
        console.log("getUserMedia not supported on your browser!");
        return null;
    }
}
