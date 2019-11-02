const { app, BrowserWindow, Menu, Tray, ipcMain } = require("electron");
const electronLocalshortcut = require("electron-localshortcut");
let demo;
var ignore = false;
const Notification = require("@wuild/electron-notification");
app.on("ready", () => {
  createBrowser();
  SetTray();
  // для прозрачности

  electronLocalshortcut.register(demo, "Ctrl+1", () => {
    demo.webContents.send("change_opacity", 0.2);
  });
  electronLocalshortcut.register(demo, "Ctrl+2", () => {
    demo.webContents.send("change_opacity", 0.3);
  });
  electronLocalshortcut.register(demo, "Ctrl+3", () => {
    demo.webContents.send("change_opacity", 0.4);
  });
  electronLocalshortcut.register(demo, "Ctrl+4", () => {
    demo.webContents.send("change_opacity", 0.5);
  });
  electronLocalshortcut.register(demo, "Ctrl+5", () => {
    demo.webContents.send("change_opacity", 0.6);
  });
  electronLocalshortcut.register(demo, "Ctrl+6", () => {
    demo.webContents.send("change_opacity", 0.7);
  });
  electronLocalshortcut.register(demo, "Ctrl+7", () => {
    demo.webContents.send("change_opacity", 0.8);
  });
  electronLocalshortcut.register(demo, "Ctrl+8", () => {
    demo.webContents.send("change_opacity", 0.9);
  });
  electronLocalshortcut.register(demo, "Ctrl+9", () => {
    demo.webContents.send("change_opacity", 1);
  });
  // для общих настроек
  electronLocalshortcut.register(demo, "Alt+=", () => {
    console.log("You pressed alt & + ++++");
    demo.webContents.send("web_view_range", "plus");
  });
  electronLocalshortcut.register(demo, "Ctrl+E", () => {
    if (ignore == false) {
      console.log("disable_skip");
      demo.setIgnoreMouseEvents(true);
      ShowNoty("Окно заблокировано!", "Ctrl D или трей");
      ignore = true;
      demo.webContents.send("add_class", "transition");
    } else {
      console.log("disable_skip");
      demo.webContents.send("disable_skip", "false");
      demo.setIgnoreMouseEvents(false);
      ignore = false;
      demo.webContents.send("remove_class", "transition");
    }
  });
  electronLocalshortcut.register(demo, "Ctrl+D", () => {
    var top = demo.isAlwaysOnTop();
    if (top == true) {
      demo.setAlwaysOnTop(false);
      top = false;
      //  alert("не top");
    } else {
      demo.setAlwaysOnTop(true);
      top = true;
      // alert("top");
    }
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
        demo.webContents.send("remove_class", "transition");
      }
    },
    {
      label: "Over all windows",
      click: function() {
        var top = demo.isAlwaysOnTop();
        if (top == true) {
          demo.setAlwaysOnTop(false);
          top = false;
          //  alert("не top");
        } else {
          demo.setAlwaysOnTop(true);
          top = true;
          // alert("top");
        }
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
  setTimeout(() => {
    note.close();
  }, 5000);
}
ipcMain.on("noty", (event, arg) => {
  ShowNoty("Окно заблокировано!", arg);
});
ipcMain.on("ignore", (event, arg) => {
  ignore = arg;
  console.log(arg);
});
