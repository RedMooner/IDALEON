const { app, BrowserWindow, Menu, Tray, ipcMain } = require("electron");
const electronLocalshortcut = require("electron-localshortcut");
let demo;
var drag = false;
const Notification = require("@wuild/electron-notification");
app.on("ready", () => {
  createBrowser();
  SetTray();
  electronLocalshortcut.register(demo, "Alt+=", () => {
    console.log("You pressed alt & + ++++");
    demo.webContents.send("web_view_range", "plus");
  });
  electronLocalshortcut.register(demo, "Ctrl+E", () => {
    console.log("disable_skip");
    demo.webContents.send("disable_skip", "false");
  });
  electronLocalshortcut.register(demo, "Alt+-", () => {
    console.log("You pressed alt & ------");
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
  const contextMenu = Menu.buildFromTemplate([
    { label: "Exit", role: "quit" },
    {
      label: "Disable/Enable Skip Mouse Events",
      click: function() {
        console.log("disable");
        demo.setIgnoreMouseEvents(false);
        demo.webContents.send("disable_skip_tray", "false");
      }
    }
  ]);
  tray.setToolTip("This is my application.");
  tray.setContextMenu(contextMenu);
}
function createBrowser() {
  demo = new BrowserWindow({
    transparent: true,
    frame: false,
    alwaysOnTop: true
  });
  demo.loadURL(`file:///${__dirname}/demo1-horizontal-light.html`);
  demo.on("close", () => {
    demo = null;
  });
}
function ShowNoty(value_title, value_body) {
  let note = new Notification({
    theme: "dark",
    title: value_title,
    sound: "absolute path to audio file",
    body: value_body,
    position: "bottom-right"
  });

  note.on("close", function() {
    console.log("Notification has been closed");
  });

  note.show();
}
ipcMain.on("noty", (event, arg) => {
  ShowNoty("Заблокировано!", arg);
});
