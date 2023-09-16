function switchScript() {
    const modelSelect = document.getElementById("modelSelect").value;
    
    if (modelSelect === "whisper") {
        console.log("Change to whiser");
    } else if (modelSelect === "nativejs") {
        console.log("Change to nativejs");
    } else if (modelSelect == "google-cloud"){
        cosnole.log("Change to google cloud");
    }

}

