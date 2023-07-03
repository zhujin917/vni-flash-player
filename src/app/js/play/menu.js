const menuList = [{
    label: "文件",
    submenu: [
        {
            label: "打开...",
            role: "open",
            key: "Ctrl+O"
        }, {
            type: "separator"
        }, {
            label: "退出",
            role: "quit",
            key: "Ctrl+Q"
        }
    ]
}, {
    label: "播放",
    submenu: [
        {
            label: "播放/暂停",
            role: "play",
            key: "空格"
        }, {
            type: "separator"
        }, {
            label: "向后",
            role: "backward",
            key: "左方括号"
        }, {
            label: "向前",
            role: "forward",
            key: "右方括号"
        }, {
            type: "separator"
        }, {
            label: "重新播放",
            role: "replay",
            key: "Ctrl+R"
        }, {
            label: "停止播放",
            role: "cancel",
            key: "Ctrl+C"
        }
    ]
}, {
    label: "窗口",
    submenu: [
        {
            label: "最小化",
            role: "minimize",
            key: "Ctrl+M"
        }, {
            label: "切换全屏",
            role: "fullscreen",
            key: "F11"
        }
    ]
}, {
    label: "帮助",
    submenu: [
        {
            label: "设置",
            role: "settings",
            key: "Ctrl+,"
        }, {
            label: "检查更新",
            role: "update"
        }, {
            type: "separator"
        }, {
            label: "关于",
            role: "about"
        }
    ]
}];
const contextList = [{
    label: "播放/暂停",
    role: "play",
    key: "空格"
}, {
    type: "separator"
}, {
    label: "向后",
    role: "backward",
    key: "左方括号"
}, {
    label: "向前",
    role: "forward",
    key: "右方括号"
}, {
    type: "separator"
}, {
    label: "重新播放",
    role: "replay",
    key: "Ctrl+R"
}, {
    label: "停止播放",
    role: "cancel",
    key: "Ctrl+C"
}, {
    type: "separator"
}, {
    label: "最小化",
    role: "minimize",
    key: "Ctrl+M"
}, {
    label: "切换全屏",
    role: "fullscreen",
    key: "F11"
}, {
    type: "separator"
}, {
    label: "打开...",
    role: "open",
    key: "Ctrl+O"
}, {
    type: "separator"
}, {
    label: "设置",
    role: "settings",
    key: "Ctrl+,"
}, {
    label: "关于",
    role: "about"
}];

let menu_canClick = false;
for (let i = 0; i < menuList.length; i += 1) {
    let el = document.createElement("div");
    el.classList.add("menu_sub");
    el.style["left"] = String(i * 50) + "px";
    el.hidden = true;
    for (let j = 0; j < menuList[i]["submenu"].length; j += 1) {
        if ("type" in menuList[i]["submenu"][j] && menuList[i]["submenu"][j]["type"] == "separator") {
            el.appendChild(document.createElement("hr"));
            continue;
        }
        let el_sub = document.createElement("div");
        el_sub.id = "menu_role_" + menuList[i]["submenu"][j]["role"];
        el_sub.classList.add("menu_submenu");
        el_sub.innerHTML = menuList[i]["submenu"][j]["label"];
        if ("key" in menuList[i]["submenu"][j]) {
            el_sub.innerHTML += `<span style='position:absolute;right:14px'>${menuList[i]["submenu"][j]["key"]}</span>`;
        }
        el.appendChild(el_sub);
    }
    document.body.appendChild(el);

    el = document.createElement("div");
    el.classList.add("menu_tab");
    el.innerHTML = menuList[i]["label"];
    el.onmousedown = function () {
        menu_canClick = true;
        document.getElementById("menu_back").hidden = false;
        this.onmouseover();
    };
    el.onmouseover = function () {
        if (!menu_canClick) {
            return;
        }
        for (let j = 0; j < document.getElementsByClassName("menu_tab").length; j += 1) {
            if (document.getElementsByClassName("menu_tab")[j] === this) {
                document.getElementsByClassName("menu_tab")[j].classList.add("menu_tab_active");
                document.getElementsByClassName("menu_sub")[j + 1].hidden = false;
            }
            else {
                document.getElementsByClassName("menu_tab")[j].classList.remove("menu_tab_active");
                document.getElementsByClassName("menu_sub")[j + 1].hidden = true;
            }
        }
    };
    document.getElementById("menu").appendChild(el);
}
function menuBack() {
    menu_canClick = false;
    for (let i = 0; i < document.getElementsByClassName("menu_tab").length; i += 1) {
        document.getElementsByClassName("menu_tab")[i].classList.remove("menu_tab_active");
        document.getElementsByClassName("menu_sub")[i + 1].hidden = true;
    }
    document.getElementById("menu_back").hidden = true;
};
document.getElementById("menu_back").onmousedown = menuBack;

let context = document.getElementById("context");
context.classList.add("menu_sub");
for (let i = 0; i < contextList.length; i += 1) {
    if ("type" in contextList[i] && contextList[i]["type"] == "separator") {
        context.appendChild(document.createElement("hr"));
        continue;
    }
    let elm = document.createElement("div");
    elm.id = "context_role_" + contextList[i]["role"];
    elm.classList.add("menu_submenu");
    elm.innerHTML = contextList[i]["label"];
    if ("key" in contextList[i]) {
        elm.innerHTML += `<span style='position:absolute;right:14px;'>${contextList[i]["key"]}</span>`;
    }
    context.appendChild(elm);
}
function contextShow(event) {
    let posX = (event.x < innerWidth - 170) ? event.x : (event.x - 170);
    let posY = (event.y < innerHeight - 290) ? event.y : (event.y - 290);
    context.style = `z-index:12;position:fixed;left:${posX}px;top:${posY}px;`;
    document.getElementById("context_back").hidden = false;
    context.hidden = false;
};
document.getElementById("play").oncontextmenu = contextShow;
function contextBack() {
    context.hidden = true;
    document.getElementById("context_back").hidden = true;
};
document.getElementById("context_back").onmousedown = contextBack;
document.getElementById("context_back").oncontextmenu = function (event) {
    contextBack();
    contextShow(event);
};
window.onresize = function () {
    contextBack();
};
document.getElementsByTagName("object")[0].oncontextmenu = function (event) {
    if (localStorage.getItem("MENU_CONTEXT") == "YES") {
        event.preventDefault();
        contextShow(event);
    }
};

document.getElementById("menu_role_quit").onmouseup = function () {
    menuBack();
    ipcRenderer.send("role", "quit");
};
document.getElementById("menu_role_minimize").onmouseup = document.getElementById("context_role_minimize").onmouseup = function () {
    menuBack(); contextBack();
    ipcRenderer.send("role", "minimize");
};
document.getElementById("menu_role_fullscreen").onmouseup = document.getElementById("context_role_fullscreen").onmouseup = function () {
    menuBack(); contextBack();
    fullScreen(!isFullScreen);
};
document.getElementById("menu_role_settings").onmouseup = document.getElementById("context_role_settings").onmouseup = function () {
    menuBack(); contextBack();
    ipcRenderer.send("role", "settings");
};
document.getElementById("menu_role_about").onmouseup = document.getElementById("context_role_about").onmouseup = function () {
    menuBack(); contextBack();
    if (isCtrl) {
        ipcRenderer.send("role", "rip");
    }
    else {
        ipcRenderer.send("role", "about");
    }
};
document.getElementById("menu_role_update").onmouseup = function () {
    menuBack();
    ipcRenderer.send("alert", {
        type: "error",
        title: "错误",
        message: "检查更新时发生错误",
        detail: "此 VNI.FlashPlayer 副本无法检查更新。",
        buttons: ["知道了"],
        noLink: true
    });
};

document.getElementById("menu_role_open").onmouseup = document.getElementById("context_role_open").onmouseup = function () {
    menuBack(); contextBack();
    document.getElementById("openFile").click();
};
document.getElementById("menu_role_play").onmouseup = document.getElementById("context_role_play").onmouseup = function () {
    menuBack(); contextBack();
    playOrStop();
};
document.getElementById("menu_role_forward").onmouseup = document.getElementById("context_role_forward").onmouseup = function () {
    menuBack(); contextBack();
    playForward();
};
document.getElementById("menu_role_backward").onmouseup = document.getElementById("context_role_backward").onmouseup = function () {
    menuBack(); contextBack();
    playBackward();
};
document.getElementById("menu_role_replay").onmouseup = document.getElementById("context_role_replay").onmouseup = function () {
    menuBack(); contextBack();
    playRewind();
};
document.getElementById("menu_role_cancel").onmouseup = document.getElementById("context_role_cancel").onmouseup = function () {
    menuBack(); contextBack();
    playCancel();
};