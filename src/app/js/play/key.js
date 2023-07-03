let isCtrl = false;
document.addEventListener("keydown", (event) => {
    if (event.key == "Control") {
        isCtrl = true;
    }
    else {
        if (isCtrl) {
            isCtrl = false;
            switch (event.key) {
                case "o":
                    document.getElementById("openFile").click();
                    break;
                case "q":
                    ipcRenderer.send("role", "quit");
                    break;
                case "r":
                    playRewind();
                    break;
                case "c":
                    playCancel();
                    break;
                case "m":
                    ipcRenderer.send("role", "minimize");
                    break;
                case ",":
                    ipcRenderer.send("role", "settings");
                    break;
            }
        }
        else {
            switch (event.key) {
                case " ":
                    playOrStop();
                    break;
                case "[":
                    playBackward();
                    break;
                case "]":
                    playForward();
                    break;
                case "F11":
                    fullScreen(!isFullScreen);
                    break;
            }
        }
    }
});

document.addEventListener("keyup", () => {
    isCtrl = false;
});
window.addEventListener("blur", () => {
    isCtrl = false;
});