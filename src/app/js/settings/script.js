function id(id) {
    return document.getElementById(id);
};

if (localStorage.getItem("THEME_DARKMODE") == "YES") {
    document.body.classList.add("dark");
}
document.documentElement.style.setProperty("--theme-color", localStorage.getItem("THEME_COLOR"));

let isFullScreen = ($_GET["isfullscreen"] == "true") ? true : false;
// document.getElementById("set_fulscr_now").onclick = function () {
//     isFullScreen = !isFullScreen;
//     ipcRenderer.send("role", `${!isFullScreen ? "!" : ""}fullscreen`);
// };

for (let i = 0; i < document.getElementsByClassName("bar").length; i += 1) {
    document.getElementsByClassName("bar")[i].onclick = function () {
        for (let j = 0; j < document.getElementsByClassName("bar").length; j += 1) {
            document.getElementsByClassName("bar")[j].children[0].style["font-size"] = "16px";
            document.getElementsByClassName("bar")[j].children[0].style["font-weight"] = "normal";
            document.getElementsByClassName("line")[j].hidden = true;
            if (document.getElementsByClassName("bar")[j] === this) {
                document.getElementById("main").style["left"] = `-${j * 100}%`;
            }
        }
        this.children[0].style["font-size"] = "20px";
        this.children[0].style["font-weight"] = "bolder";
        this.children[1].hidden = false;
    };
}

id("set_aper_darkmode").value = localStorage.getItem("THEME_DARKMODE");
id("set_aper_darkmode").onmouseup = function () {
    localStorage.setItem("THEME_DARKMODE", this.value);
    if (localStorage.getItem("THEME_DARKMODE") == "YES") {
        document.body.classList.add("dark");
    }
    else {
        document.body.classList.remove("dark");
    }
    ipcRenderer.send("role", "reloadAppr");
};

id("set_aper_color").value = localStorage.getItem("THEME_COLOR");
id("set_aper_color").onmouseup = function () {
    localStorage.setItem("THEME_COLOR", this.value);
    document.documentElement.style.setProperty("--theme-color", localStorage.getItem("THEME_COLOR"));
    ipcRenderer.send("role", "reloadAppr");
};

id("set_startup_normal").value = localStorage.getItem("START_NORMAL");
id("set_startup_normal").onmouseup = function () {
    localStorage.setItem("START_NORMAL", this.value);
};

id("set_startup_play").value = localStorage.getItem("START_PLAY");
id("set_startup_play").onmouseup = function () {
    localStorage.setItem("START_PLAY", this.value);
};

id("set_player_forward").value = localStorage.getItem("PLAY_FORWARD");
id("set_player_forward").onkeyup = function () {
    localStorage.setItem("PLAY_FORWARD", this.value);
};

id("set_player_backward").value = localStorage.getItem("PLAY_BACKWARD");
id("set_player_backward").onkeyup = function () {
    localStorage.setItem("PLAY_BACKWARD", this.value);
};

id("set_player_context").value = localStorage.getItem("MENU_CONTEXT");
id("set_player_context").onmouseup = function () {
    localStorage.setItem("MENU_CONTEXT", this.value);
};

id("set_player_drop").value = localStorage.getItem("OBJ_DROP");
id("set_player_drop").onmouseup = function () {
    localStorage.setItem("OBJ_DROP", this.value);
};

id("set_fulscr_top").value = localStorage.getItem("FULSCR_TOP");
id("set_fulscr_top").onmouseup = function () {
    localStorage.setItem("FULSCR_TOP", this.value);
    ipcRenderer.send("role", `${!isFullScreen ? "!" : ""}fullscreen`);
};

id("set_fulscr_bottom").value = localStorage.getItem("FULSCR_BOTTOM");
id("set_fulscr_bottom").onmouseup = function () {
    localStorage.setItem("FULSCR_BOTTOM", this.value);
    ipcRenderer.send("role", `${!isFullScreen ? "!" : ""}fullscreen`);
};

id("set_adv_quit").onclick = function () {
    ipcRenderer.send("role", "quit");
};

id("set_adv_def").onclick = function () {
    ipcRenderer.send("alert", "clrHis");
};
ipcRenderer.on("clrHisN", () => {
    localStorage.clear();
    ipcRenderer.send("role", "relaunch");
});