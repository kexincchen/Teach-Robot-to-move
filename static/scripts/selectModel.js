function switchScript() {
    const modelSelect = document.getElementById("modelSelect").value;
    
    if (modelSelect === "whisper") {
        console.log("Change to whiser");
    } else if (modelSelect === "Mozilla") {
        console.log("Change to Mozilla");
    } else if (modelSelect == "google-cloud"){
        cosnole.log("Change to google cloud");
    }
}

