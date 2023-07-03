const defaultLocalStorage = [
    { name: "THEME_DARKMODE", value: "NO" },
    { name: "THEME_COLOR", value: "#C01011" },
    { name: "START_PLAY", value: "NORMAL" },
    { name: "START_NORMAL", value: "NORMAL" },
    { name: "PLAY_FORWARD", value: "1" },
    { name: "PLAY_BACKWARD", value: "1" },
    { name: "MENU_CONTEXT", value: "YES" },
    { name: "OBJ_DROP", value: "NO" },
    { name: "FULSCR_TOP", value: "NO" },
    { name: "FULSCR_BOTTOM", value: "NO" }
];
defaultLocalStorage.forEach((dls) => {
    if (localStorage.getItem(dls["name"]) == null) {
        localStorage.setItem(dls["name"], dls["value"]);
    }
});

function reloadAppr() {
    if (localStorage.getItem("THEME_DARKMODE") == "YES") {
        document.body.classList.add("dark");
    }
    else if (document.body.classList.contains("dark")) {
        document.body.classList.remove("dark");
    }
    document.documentElement.style.setProperty("--theme-color", localStorage.getItem("THEME_COLOR"));
};
window.addEventListener("load", reloadAppr);
ipcRenderer.on("reloadAppr", reloadAppr);

if ($_GET["file"] == "undefined") {
    switch (localStorage.getItem("START_NORMAL")) {
        case "MAXIMIZE":
            ipcRenderer.send("role", "maximize");
            break;
        case "FULLSCREEN":
            fullScreen(true);
            ipcRenderer.send("role", "fullscreen");
            break;
    }
}
else {
    switch (localStorage.getItem("START_PLAY")) {
        case "MAXIMIZE":
            ipcRenderer.send("role", "maximize");
            break;
        case "FULLSCREEN":
            fullScreen(true);
            ipcRenderer.send("role", "fullscreen");
            break;
    }
}

ipcRenderer.on("fullscreen", (event, state) => {
    let heightPlus = 0;
    let heightBottom = 100;
    if (state) {
        if (localStorage.getItem("FULSCR_TOP") == "YES") {
            document.getElementById("menu").hidden = true;
            heightPlus += 23;
        }
        else {
            document.getElementById("menu").hidden = false;
        }
        if (localStorage.getItem("FULSCR_BOTTOM") == "YES") {
            document.getElementById("control").hidden = true;
            heightPlus += 100;
            heightBottom = 0;
        }
        else {
            document.getElementById("control").hidden = false;
        }
        play_obj.style = document.getElementsByTagName("object")[0].style = `bottom:${heightBottom}px;height:calc(100% - 123px + ${heightPlus}px)`;
    }
    else {
        document.getElementById("menu").hidden = document.getElementById("control").hidden = false;
        play_obj.style = document.getElementsByTagName("object")[0].style = "bottom:100px;height:calc(100% - 123px)";
    }
    isFullScreen = state;
});