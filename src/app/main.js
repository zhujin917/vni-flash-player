const electron = require("electron");
const { app, BrowserWindow, Menu, ipcMain, dialog, shell } = electron;
const path = require("path");

if (!app.requestSingleInstanceLock()) {
    app.quit();
    return;
}

app.commandLine.appendSwitch("ppapi-flash-path", path.join(__dirname, "../flash/pepflashplayer_32_0_0_321.dll"));
app.commandLine.appendSwitch("ppapi-flash-version", "32.0.0.321");

let mainWindow = null;
app.on("ready", () => {
    mainWindow = new BrowserWindow({
        height: 620,
        width: 880,
        minHeight: 405,
        minWidth: 485,
        title: "VNI.FlashPlayer",
        backgroundColor: "#FAFAFA",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            plugins: true
        },
        show: false
    });
    mainWindow.loadURL(path.join(__dirname, "html/play.html"));
    // mainWindow.webContents.openDevTools();
    Menu.setApplicationMenu(null);
    mainWindow.on("ready-to-show", () => {
        mainWindow.show();
        if (process.argv.length > 2) {
            mainWindow.webContents.send("openFile", "err");
        }
        else if (process.argv.length == 2) {
            mainWindow.webContents.send("openFile", process.argv[1]);
        }
    });
    mainWindow.webContents.on("will-navigate", (event, url) => {
        event.preventDefault();
        shell.openExternal(url);
    });
    mainWindow.webContents.on("new-window", (event, url) => {
        event.preventDefault();
        shell.openExternal(url);
    });
});

app.on("second-instance", (event, commandLine) => {
    if (mainWindow.isMinimized()) {
        mainWindow.restore();
    }
    mainWindow.focus();
    if (commandLine.length > 4) {
        mainWindow.webContents.send("openFile", "err");
    }
    else if (commandLine.length == 4) {
        mainWindow.webContents.send("openFile", commandLine[3]);
    }
});

ipcMain.on("role", (event, data) => {
    switch (data) {
        case "quit":
            app.quit();
            break;
        case "relaunch":
            app.quit();
            app.relaunch();
            break;
        case "minimize":
            mainWindow.minimize();
            break;
        case "maximize":
            mainWindow.maximize();
            break;
        case "fullscreen":
            mainWindow.setFullScreen(true);
            mainWindow.webContents.send("fullscreen", true);
            break;
        case "!fullscreen":
            mainWindow.setFullScreen(false);
            mainWindow.webContents.send("fullscreen", false);
            break;
        case "reloadAppr":
            mainWindow.webContents.send("reloadAppr");
            break;
        case "about":
            openAboutWindow("html/about.html");
            break;
        case "rip":
            openAboutWindow("html/rip.html");
            break;
        case "settings":
            openSettingsWindow();
            break;
    };
});
let aboutWin = null;
function openAboutWindow(file) {
    aboutWin = new BrowserWindow({
        parent: mainWindow,
        modal: true,
        width: 550,
        height: 350,
        resizable: false,
        minimizable: false,
        title: "关于 VNI.FlashPlayer",
        backgroundColor: "#FFFFFF",
        show: false
    });
    aboutWin.loadURL(path.join(__dirname, file));
    aboutWin.on("ready-to-show", () => {
        aboutWin.show();
    });
};
let settingsWin = null;
function openSettingsWindow() {
    settingsWin = new BrowserWindow({
        parent: mainWindow,
        modal: true,
        width: 650,
        height: 426,
        resizable: false,
        minimizable: false,
        title: "设置",
        backgroundColor: "#FFFFFF",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        show: false
    });
    // settingsWin.webContents.openDevTools();
    settingsWin.loadURL(path.join(__dirname, `html/settings.html?back=${mainWindow.getTitle().substr(18, mainWindow.getTitle().length - 18)}&isfullscreen=${mainWindow.isFullScreen()}`));
    settingsWin.on("ready-to-show", () => {
        settingsWin.show();
    });
};

ipcMain.on("alert", (event, options) => {
    if (options === "clrHis") {
        dialog.showMessageBox(settingsWin, {
            message: "确定要重置设置？",
            type: "warning",
            buttons: ["确定", "取消"],
            defaultId: 0,
            title: "重置设置",
            detail: "这将会恢复 VNI.FlashPlayer 的所有设置至默认状态，然后重新启动。",
            noLink: true
        }, (result) => {
            if (result === 0) {
                event.sender.send("clrHisN");
            }
        });
        return;
    }
    dialog.showMessageBox(mainWindow, options);
});