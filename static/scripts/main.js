import { actions, fadeToAction, api } from "./robot.js";
import { setNativejs } from "./nativeSTT.js";
// import { whisperSTT } from './whisperSTT.js';
// import { googleSTT } from './googleSTT.js';
import { backendModel } from "./backendModel.js";

// Global variables
let selectedModel = document.getElementById("modelSelect").value;

document.getElementById("modelSelect").addEventListener("change", function () {
  const model = document.getElementById("modelSelect").value;
  const popover = document.getElementById("model-intro");
  if (model === "whisper") {
    selectedModel = "whisper";
    popover.innerHTML = "whisper";
    console.log("switched to whisper");
  } else if (model === "nativejs") {
    console.log("switched to nativejs");
    popover.innerHTML = "nativejs";
    selectedModel = "nativejs";
  } else if (model === "google-cloud") {
    console.log("switched to google-cloud");
    popover.innerHTML = "google-cloud";
    selectedModel = "google-cloud";
  }
});

// Execute the STT Model by clicking the start-recording button
document
  .getElementById("start-recording")
  .addEventListener("click", function () {
    const model = selectedModel;
    if (model === "nativejs") {
      console.log("start nativejs");
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

form.addEventListener("submit", async (e) => {
  e.preventDefault();
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
