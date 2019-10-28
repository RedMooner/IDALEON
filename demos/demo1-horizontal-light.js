const { app, BrowserWindow, Menu, Tray, ipcMain } = require("electron");
const electronLocalshortcut = require("electron-localshortcut");
let demo;
var drag = false;
app.on("ready", () => {
  createBrowser();
  SetTray();
  electronLocalshortcut.register(demo, "Alt+=", () => {
    console.log("You pressed ctrl & + ++++");
    demo.webContents.send("web_view_range", "plus");
  });
  electronLocalshortcut.register(demo, "Alt+-", () => {
    console.log("You pressed ctrl & ------");
    demo.webContents.send("web_view_range", "minus");
  });
  electronLocalshortcut.register(demo, "Ctrl+D", () => {
    if (drag == false) {
      demo.webContents.send("drag", "true");
      drag = true;
      console.log("Drag" + drag);
    } else {
      demo.webContents.send("drag", "false");
      drag = false;
      console.log("Drag" + drag);
    }
  });
});
function SetTray() {
  tray = new Tray("img/tray.jpg");
  const contextMenu = Menu.buildFromTemplate([{ label: "Exit", role: "quit" }]);
  tray.setToolTip("This is my application.");
  tray.setContextMenu(contextMenu);
}
function createBrowser() {
  demo = new BrowserWindow({
    transparent: true,
    frame: false
  });
  demo.loadURL(`file:///${__dirname}/demo1-horizontal-light.html`);
  demo.on("close", () => {
    demo = null;
  });
}
