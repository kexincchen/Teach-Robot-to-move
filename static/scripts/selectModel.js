function switchScript() {
    const modelSelect = document.getElementById("modelSelect").value;
    const head = document.getElementsByTagName("head")[0];
    let newScript;

    // Remove existing script, if any
    const existingScript = document.getElementById("dynamic-script");
    if(existingScript) {
        head.removeChild(existingScript);
    }

    if (modelSelect === "whisper") {
        newScript = "{{ url_for('static', filename='scripts/speechRecognition.js') }}";
        console.log("Change to whiser");
    } else if (modelSelect === "nativejs") {
        newScript = "{{ url_for('static', filename='scripts/mediaRecorder.js') }}";
        console.log("Change to nativejs");
    }

    // Create new script element
    let scriptElement = document.createElement("script");
    scriptElement.type = "text/javascript";
    scriptElement.src = newScript;
    scriptElement.id = "dynamic-script";
    
    // Append new script element to <head>
    head.appendChild(scriptElement);
}