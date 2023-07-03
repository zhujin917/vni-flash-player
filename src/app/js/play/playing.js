let isPlay = false, isPoint = false, isFullScreen = false;
function loadMenu() {
    let menuSwitchList = ["play", "forward", "backward", "replay", "cancel"];
    menuSwitchList.forEach((el) => {
        if (isPlay) {
            document.getElementById("menu_role_" + el).classList.remove("menu_disabled");
            document.getElementById("context_role_" + el).classList.remove("menu_disabled");
        }
        else {
            document.getElementById("menu_role_" + el).classList.add("menu_disabled");
            document.getElementById("context_role_" + el).classList.add("menu_disabled");
        }
    });
};
loadMenu();

const play_obj = document.getElementById("play_obj");
function openFile(file) {
    file.outerHTML = file.outerHTML;
    if (file.files.length > 1) {
        ipcRenderer.send("alert", {
            type: "error",
            title: "错误",
            message: "打开文件时发生错误",
            detail: "不支持一次打开多个文件。",
            buttons: ["知道了"],
            noLink: true
        });
        return;
    }
    playFile(file.files[0]["path"]);
};
function playFile(path) {
    if (path.substr(-4).toUpperCase() != ".SWF") {
        ipcRenderer.send("alert", {
            type: "error",
            title: "错误",
            message: "打开文件时发生错误",
            detail: "仅支持打开拓展名为 SWF 的文件。",
            buttons: ["知道了"],
            noLink: true
        });
        return;
    }
    playCancel();
    document.getElementById("play_loading_text").innerText = `正在打开：${decodeURIComponent(path)}`;
    document.getElementById("play_loading").hidden = false;
    document.getElementById("play_logo").hidden = true;
    setTimeout(() => {
        isPlay = true;
        loadMenu();
        document.title += " - " + decodeURI(path);
        document.getElementById("control_bar_left").hidden = false;
        document.getElementById("control_bar_point").hidden = false;
        document.getElementsByTagName("object")[0].hidden = false;
        play_obj.src = path;
    }, 1500);
}
function playOrStop() {
    if (!isPlay) {
        return;
    }
    if (play_obj.IsPlaying()) {
        play_obj.StopPlay();
    }
    else {
        play_obj.Play();
    }
};
function playForward() {
    if (!isPlay) {
        return;
    }
    play_obj.GotoFrame(play_obj.CurrentFrame() + Number(localStorage.getItem("PLAY_FORWARD")));
};
function playBackward() {
    if (!isPlay) {
        return;
    }
    play_obj.GotoFrame(play_obj.CurrentFrame() - Number(localStorage.getItem("PLAY_BACKWARD")));
};
function playRewind() {
    if (!isPlay) {
        return;
    }
    play_obj.Rewind();
};
function playCancel() {
    document.getElementById("play_loading_text").innerText = "";
    document.getElementById("play_loading").hidden = true;
    document.getElementById("play_logo").hidden = false;
    isPlay = false;
    loadMenu();
    document.title = document.title.substr(0, 15);
    document.getElementById("control_bar_left").hidden = true;
    document.getElementById("control_bar_point").hidden = true;
    document.getElementsByTagName("object")[0].hidden = true;
    play_obj.src = "";
};
function fullScreen(stat) {
    ipcRenderer.send("role", `${!stat ? "!" : ""}fullscreen`);
};
document.getElementById("play").ondragenter = function (e) {
    e.stopPropagation(); e.preventDefault();
};
document.getElementById("play").ondragover = function (e) {
    e.stopPropagation(); e.preventDefault();
};
document.getElementById("play").ondrop = function (e) {
    e.stopPropagation(); e.preventDefault();
    openFile(e.dataTransfer);
};
play_obj.ondragenter = (e) => {
    if (localStorage.getItem("OBJ_DROP") == "YES") {
        e.stopPropagation(); e.preventDefault();
    }
};
play_obj.ondragover = (e) => {
    if (localStorage.getItem("OBJ_DROP") == "YES") {
        e.stopPropagation(); e.preventDefault();
    }
};
play_obj.ondrop = (e) => {
    if (localStorage.getItem("OBJ_DROP") == "YES") {
        e.stopPropagation(); e.preventDefault();
        openFile(e.dataTransfer);
    }
};

document.getElementById("control_play").onclick = playOrStop;
document.getElementById("control_forward").onclick = playForward;
document.getElementById("control_backward").onclick = playBackward;
document.getElementById("control_replay").onclick = playRewind;
document.getElementById("control_cancel").onclick = playCancel;
document.getElementById("control_fulscr").onclick = function () {
    fullScreen(!isFullScreen);
};
document.getElementById("control_bar").onmousedown = function (event) {
    if (!isPlay) {
        return;
    }
    play_obj.GotoFrame(Math.round((event.x - 15) / ((innerWidth - 30) / (play_obj.TotalFrames() - 1))));
    isPoint = true;
};
document.getElementById("control_bar").addEventListener("touchstart", (event) => {
    if (!isPlay) {
        return;
    }
    play_obj.GotoFrame(Math.round((event.touches[0].clientX - 15) / ((innerWidth - 30) / (play_obj.TotalFrames() - 1))));
    isPoint = true;
});
document.onmousemove = function (event) {
    if (!isPoint) {
        return;
    }
    play_obj.GotoFrame(Math.round((event.x - 15) / ((innerWidth - 30) / (play_obj.TotalFrames() - 1))));
};
document.addEventListener("touchmove", (event) => {
    if (!isPoint) {
        return;
    }
    play_obj.GotoFrame(Math.round((event.touches[0].clientX - 15) / ((innerWidth - 30) / (play_obj.TotalFrames() - 1))));
});
document.onmouseup = function () {
    if (isPoint) {
        isPoint = false;
    }
};
document.addEventListener("touchend", () => {
    if (isPoint) {
        isPoint = false;
    }
});

function reFreshInner() {
    if (!isPlay) {
        document.getElementById("control_text").innerHTML = "准备就绪";
        document.getElementById("control_play").firstElementChild.src = "../img/icons/play-one.svg";
    }
    else {
        document.getElementById("control_text").innerHTML = (play_obj.CurrentFrame() + 1) + " / " + play_obj.TotalFrames();
        document.getElementById("control_bar_left").style["width"] = document.getElementById("control_bar_point").style["left"] = (play_obj.CurrentFrame() / (play_obj.TotalFrames() - 1) * 100) + "%";
        if (!play_obj.IsPlaying()) {
            document.getElementById("control_play").firstElementChild.src = "../img/icons/play-one.svg";
        }
        else {
            document.getElementById("control_play").firstElementChild.src = "../img/icons/pause.svg";
        }
    }
    if (isFullScreen) {
        document.getElementById("control_fulscr").firstElementChild.src = "../img/icons/off-screen-two.svg";
    }
    else {
        document.getElementById("control_fulscr").firstElementChild.src = "../img/icons/full-screen-two.svg";
    }
    setTimeout(() => {
        reFreshInner();
    }, 5);
};
reFreshInner();

ipcRenderer.on("openFile", (event, file) => {
    if (file == "err") {
        ipcRenderer.send("alert", {
            type: "error",
            title: "错误",
            message: "打开文件时发生错误",
            detail: "不支持一次打开多个文件。",
            buttons: ["知道了"],
            noLink: true
        });
    }
    else {
        playFile(file);
    }
});