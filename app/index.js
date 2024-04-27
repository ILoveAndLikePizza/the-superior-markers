const { app, BrowserWindow, globalShortcut } = require("electron");
const { join } = require("path");

/** @type {BrowserWindow} */
let window;

app.on("ready", () => {
    window = new BrowserWindow({
        title: "The Superior Markers",
        icon: join(__dirname, "window", "icon.png"),
        minWidth: 1000,
        minHeight: 800,
        webPreferences: {
            preload: join(__dirname, "window", "preload.js"),
            webviewTag: true,
            sandbox: false,
            contextIsolation: false
        }
    });

    window.maximize();
    window.removeMenu();
    window.loadFile(join(__dirname, "window", "index.html"));
    window.on("ready-to-show", () => window.show());

    globalShortcut.register("F11", () => {
        window.setFullScreen(!window.isFullScreen());       
    });
    globalShortcut.register("CommandOrControl+`", () => {
        window.webContents.send("toggle-lef");        
    });
    globalShortcut.register("CommandOrControl+Q", () => app.quit());
    globalShortcut.register("CommandOrControl+W", () => app.quit());
});
