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
    demo.setIgnoreMouseEvents(true);
    ShowNoty("Окно заблокировано!", "Ctrl D или трей");
  });
  electronLocalshortcut.register(demo, "Ctrl+D", () => {
    console.log("disable_skip");
    demo.webContents.send("disable_skip", "false");
    demo.setIgnoreMouseEvents(false);
  });
  electronLocalshortcut.register(demo, "Alt+-", () => {
    console.log("You pressed alt & ------");
    demo.webContents.send("web_view_range", "minus");
  });
});
function SetTray() {
  tray = new Tray("img/tray.png");
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Unlock Window",
      click: function() {
        console.log("disable");
        demo.setIgnoreMouseEvents(false);
        demo.webContents.send("disable_skip_tray", "false");
      }
    },
    { label: "Close IDALEON", role: "quit" }
  ]);
  tray.setToolTip("This is my application.");
  tray.setContextMenu(contextMenu);
}
function createBrowser() {
  demo = new BrowserWindow({
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    icon: "img/main.png"
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
  ShowNoty("Окно заблокировано!", arg);
});
