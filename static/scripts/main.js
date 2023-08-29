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

// Handle hints click
function handleHintsClick(recognition) {
    recognition.start();
    console.log('Ready to receive a command.');
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
const hints = document.querySelector('#hints');
const form = document.getElementById('user-form');
const outputDiv = document.getElementById('text-output');

// Set up event listeners
hints.onclick = () => handleHintsClick(recognition);
recognition.onresult = (event) => handleRecognitionResult(event, diagnostic);
recognition.onspeechend = () => recognition.stop();
recognition.onerror = (event) => handleRecognitionError(event, diagnostic);
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleFormSubmit(form, outputDiv);
});
