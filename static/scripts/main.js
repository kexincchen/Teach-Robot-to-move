import { actions, fadeToAction, api } from "./robot.js";
import { setNativejs } from "./nativeSTT.js";
import { backendModel } from "./backendModel.js";

// Global variables
let selectedModel = document.getElementById("modelSelect").value;

document.getElementById("modelSelect").addEventListener("change", function () {
  const model = document.getElementById("modelSelect").value;
  const popover = document.getElementById("model-intro");
  if (model === "whisper") {
    selectedModel = "whisper";
    popover.innerHTML =
      "Whisper is an automatic speech recognition (ASR) system trained on 680,000 hours of multilingual and multitask supervised data collected from the web. OpenAI shows that the use of such a large and diverse dataset leads to improved robustness to accents, background noise and technical language. Moreover, it enables transcription in multiple languages, as well as translation from those languages into English. OpenAI are open-sourcing models and inference code to serve as a foundation for building useful applications and for further research on robust speech processing.";
    console.log("switched to whisper");
  } else if (model === "Mozilla") {
    console.log("switched to Mozilla");
    selectedModel = "Mozilla";
    popover.innerHTML =
      "Speech recognition involves receiving speech through a device's microphone, which is then checked by a speech recognition service against a list of grammar (basically, the vocabulary you want to have recognized in a particular app.) When a word or phrase is successfully recognized, it is returned as a result (or list of results) as a text string, and further actions can be initiated as a result. The Web Speech API has a main controller interface for this — SpeechRecognition — plus a number of closely-related interfaces for representing grammar, results, etc.";
  } else if (model === "google-cloud") {
    console.log("switched to google-cloud");
    popover.innerHTML =
      "Google Cloud accurately converts speech into text with an API powered by the best of Google’s AI research and technology. It provides hints to boost the transcription accuracy of rare and domain-specific words or phrases. Use classes to automatically convert spoken numbers into addresses, years, currencies, and more. ";
    selectedModel = "google-cloud";
  }
});

// Execute the STT Model by clicking the start-recording button
document
  .getElementById("start-recording")
  .addEventListener("click", function () {
    const model = selectedModel;
    if (model === "Mozilla") {
      console.log("start Mozilla");
      setNativejs();
    } else {
      backendModel.startProcessing(model);
    }
  });

// Handle form submission
async function handleFormSubmit(form, outputDiv) {
  document.getElementById("output-block").style.display = "none";
  document.getElementById("output-loading").style.display = "inline-block";

  const inputText = form.draft.value;
  const response = await fetch("/processing/generate-command", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input_text: inputText,
    }),
  });

  const data = await response.json();
  document.getElementById("output-loading").style.display = "none";
  document.getElementById("output-block").style.display = "inline";
  document.getElementById("output-command").textContent = data.output_text;
  // outputDiv.innerHTML = `<h3>Generated Output:</h3><p>${data.output_text}</p>`;
}

// Main code
// const recognition = initSpeechRecognition();
// const diagnostic = document.querySelector('.output');
// const start = document.querySelector('#start-recording');
const form = document.getElementById("user-form");
// const stopBtn = document.getElementById('stop');
const outputDiv = document.getElementById("text-output");

const retryBtn = document.getElementById("retryBtn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  await handleFormSubmit(form, outputDiv);
});

retryBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  console.log("HandleSubmit");
  await handleFormSubmit(form, outputDiv);
});

// Assuming the command might be the name of the animation action, for example, "Walking"
document
  .querySelector("#btn-perform-action")
  .addEventListener("click", function () {
    console.log("GO!");
    const command = document
      .getElementById("output-command")
      .textContent.trim();

    if (actions[command]) {
      api.state = command; // Set the new state
      fadeToAction(api.state, 0.5); // Call the function to change the robot's state/action
    } else {
      console.error("Command not recognized:", command);
    }
  });
