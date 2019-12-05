﻿const {
  app,
  BrowserWindow,
  Menu,
  Tray,
  ipcMain,
  globalShortcut
} = require("electron");
const child_process = require("child_process");
const Path = require("path");
const fs = require("fs");
const electronLocalshortcut = require("electron-localshortcut");
const translation = require("./src/language/translate");
const trayWindow = require("./src/tray/tray");
let demo;
var ignore = false;
var lang_data;
var short_cuts = true;

// перевод
var exit_tray = "quit IDALEON";
var open = "Open IDALEON";
var noty_title_lock_true = "Idaleon was locked!";
var noty_title_lock_false = "Idaleon was unlocked!";
var noty_title_top_true = "Idaleon over on windows!";
var noty_title_top_false = "Idaleon did't over on windows";
var noty_title_sc_true = "ShortCuts enabled";
var noty_title_sc_false = "ShortCuts dinabled";
var noty_info = "Info message";
let trayWIN;
//
const Notification = require("@wuild/electron-notification");


var shouldQuit = app.makeSingleInstance(function (
  commandLine,
  workingDirectory
) {
  // Someone tried to run a second instance, we should focus our window.
  if (demo) {
    if (demo.isMinimized()) myWindow.restore();
    demo.focus();
  }
});

if (shouldQuit) {
  app.quit();
  return;
}

app.on("ready", () => {

  let path = require("path");

  let relreadpath_c = "\\native\\Checker\\ProcessChecker.exe";
  let basereadpath_c = path.dirname(__dirname);
  let filereadpath_c = basereadpath_c + relreadpath_c;

  if (!fs.existsSync(filereadpath_c)) {
    filereadpath_c = path.dirname(basereadpath_c) + relreadpath_c;
    console.log(filereadpath_c);
  }

  let child_reader_c = child_process.spawn(filereadpath_c, []);
  child_reader_c.stdout.on("data", function (data) {
    if (data == "true") {
      //app.exit();
      Debug_Text("sdsdsdsdsdsd");
    } else {
      console.log("KO");
    }
  });

  //
  let relreadpath = "\\native\\language\\Reader.exe";
  let basereadpath = path.dirname(__dirname);
  let filereadpath = basereadpath + relreadpath;

  if (!fs.existsSync(filereadpath)) {
    filereadpath = path.dirname(basereadpath) + relreadpath;
    console.log(filereadpath);
  }
  console.log(filereadpath);

  let child_reader = child_process.spawn(filereadpath, []);
  child_reader.stdout.on("data", function (data) {
    if (data != "err") {
      lang_data = Buffer.from(Buffer.from(data).toString("utf-8"), "base64");
      a = JSON.parse(lang_data);
      exit_tray = translation.translate_str("exit", JSON.parse(lang_data));
      open = translation.translate_str("open", JSON.parse(lang_data));
      // присаваеваем перевод текстам уведомлений
      noty_title_lock_false = translation.translate_str(
        "noty_title_lock_false",
        JSON.parse(lang_data)
      );
      demo.webContents.send("noty_title_lock_false", noty_title_lock_false);
      noty_title_lock_true = translation.translate_str(
        "noty_title_lock_true",
        JSON.parse(lang_data)
      );
      demo.webContents.send("noty_title_lock_true", noty_title_lock_true);
      noty_title_top_true = translation.translate_str(
        "noty_title_top_true",
        JSON.parse(lang_data)
      );
      demo.webContents.send("noty_title_top_true", noty_title_top_true);
      noty_title_top_false = translation.translate_str(
        "noty_title_top_false",
        JSON.parse(lang_data)
      );
      demo.webContents.send("noty_title_top_false", noty_title_top_false);

      noty_info = translation.translate_str("noty_info", JSON.parse(lang_data));
      demo.webContents.send("noty_info", noty_info);
    } else {
      lang_data = "err";
    }
  });
  createBrowser();


  demo.setThumbarButtons([
    {
      tooltip: "Example",

      click() { console.log('button1 clicked') }
    }
  ]);
  demo.webContents.send("lang_data_event", lang_data);
  demo.setAlwaysOnTop(false);

  //SetTray();
  tray = new Tray("img/tray.png"); //
  trayWIN = new BrowserWindow({
    width: 340,
    height: 380,

    frame: false,

    transparent: true,
    skipTaskbar: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  trayWIN.loadURL(`file:///${__dirname}/src/tray/tray.html`);
  trayWindow.setOptions({
    window: trayWIN,
    tray: tray
  });
  tray.on("click", function () {
    demo.show();
  });

  // для прозрачности

  globalShortcut.register("CommandOrControl+1", () => {
    demo.webContents.send("change_opacity", 0.2);
  });
  globalShortcut.register("CommandOrControl+2", () => {
    demo.webContents.send("change_opacity", 0.3);
  });
  globalShortcut.register("CommandOrControl+3", () => {
    demo.webContents.send("change_opacity", 0.4);
  });
  globalShortcut.register("CommandOrControl+4", () => {
    demo.webContents.send("change_opacity", 0.5);
  });
  globalShortcut.register("CommandOrControl+5", () => {
    demo.webContents.send("change_opacity", 0.6);
  });
  globalShortcut.register("CommandOrControl+6", () => {
    demo.webContents.send("change_opacity", 0.7);
  });
  globalShortcut.register("CommandOrControl+7", () => {
    demo.webContents.send("change_opacity", 0.8);
  });
  globalShortcut.register("CommandOrControl+8", () => {
    demo.webContents.send("change_opacity", 0.9);
  });
  globalShortcut.register("CommandOrControl+9", () => {
    demo.webContents.send("change_opacity", 1);
  });
  // для общих настроек
  globalShortcut.register("CommandOrControl+i", () => {
    demo.webContents.openDevTools({ mode: "detach" });
  });
  function Debug_Text(value) {
    fs.writeFile("file.tmp", value, function (err) {
      if (err) throw err;
    });
  }
  globalShortcut.register("Alt+=", () => {
    console.log("You pressed alt & + ++++");
    demo.webContents.send("web_view_range", "plus");
  });
  globalShortcut.register("CommandOrControl+E", () => {
    if (ignore == false) {
      console.log("disable_skip");
      demo.setIgnoreMouseEvents(true);
      ShowNoty(noty_info, noty_title_lock_true, "Notification_lock_on");
      ignore = true;
      demo.webContents.send("add_class", "transition");
    } else {
      console.log("disable_skip");
      demo.webContents.send("disable_skip", "false");
      demo.setIgnoreMouseEvents(false);
      ShowNoty(noty_info, noty_title_lock_false, "Notification_lock_off");
      ignore = false;
      demo.webContents.send("remove_class", "transition");
    }
    change_icon();
  });
  globalShortcut.register("CommandOrControl+D", () => {
    var top = demo.isAlwaysOnTop();
    if (top == true) {
      demo.setAlwaysOnTop(false);
      top = false;
      ShowNoty(noty_info, noty_title_top_false, "Notification_layer_off");
      //  alert("не top");
    } else {
      demo.setAlwaysOnTop(true);
      top = true;
      ShowNoty(noty_info, noty_title_top_true, "Notification_layer_on");
      // alert("top");
    }
    change_icon();
  });
  globalShortcut.register("CommandOrControl+Space", () => {
    setTimeout(() => {
      disable_sc();
      console.log("O");
    }, 100);
  });
  globalShortcut.register("Alt+-", () => {
    console.log("You pressed alt & ------");
    demo.webContents.send("web_view_range", "minus");
  });

});
app.on("window-all-closed", () => {
  app.hide();
});


function OverAll() {
  var top = demo.isAlwaysOnTop();
  if (top == true) {
    demo.setAlwaysOnTop(false);
    top = false;
    ShowNoty(noty_info, noty_title_top_false, "Notification_layer_off");
    //  alert("не top");
  } else {
    demo.setAlwaysOnTop(true);
    top = true;
    ShowNoty(noty_info, noty_title_top_true, "Notification_layer_on");
    // alert("top");
  }
  change_icon();
}
function disable_sc() {
  if (short_cuts == true) {
    short_cuts = false;
    console.log("false");
    globalShortcut.unregisterAll();
    globalShortcut.register("CommandOrControl+Space", () => {
      setTimeout(() => {
        disable_sc();
        console.log("O");
      }, 100);
    });
    ShowNoty(noty_info, noty_title_sc_false, "Notification_hotket_off");

    demo.webContents.send("hotkey", false);
    trayWIN.webContents.send("sc_tray", false)
      ;
  } else {
    trayWIN.webContents.send("sc_tray", true);
    globalShortcut.unregisterAll();
    short_cuts = true;
    ShowNoty(noty_info, noty_title_sc_true, "Notification_hotket_on");
    demo.webContents.send("hotkey", true);
    console.log("true");
    globalShortcut.register("CommandOrControl+Space", () => {
      setTimeout(() => {
        disable_sc();
        console.log("O");
      }, 100);
    });
    globalShortcut.register("CommandOrControl+1", () => {
      demo.webContents.send("change_opacity", 0.2);
    });
    globalShortcut.register("CommandOrControl+2", () => {
      demo.webContents.send("change_opacity", 0.3);
    });
    globalShortcut.register("CommandOrControl+3", () => {
      demo.webContents.send("change_opacity", 0.4);
    });
    globalShortcut.register("CommandOrControl+4", () => {
      demo.webContents.send("change_opacity", 0.5);
    });
    globalShortcut.register("CommandOrControl+5", () => {
      demo.webContents.send("change_opacity", 0.6);
    });
    globalShortcut.register("CommandOrControl+6", () => {
      demo.webContents.send("change_opacity", 0.7);
    });
    globalShortcut.register("CommandOrControl+7", () => {
      demo.webContents.send("change_opacity", 0.8);
    });
    globalShortcut.register("CommandOrControl+8", () => {
      demo.webContents.send("change_opacity", 0.9);
    });
    globalShortcut.register("CommandOrControl+9", () => {
      demo.webContents.send("change_opacity", 1);
    });
    // для общих настроек
    globalShortcut.register("CommandOrControl+i", () => {
      demo.webContents.openDevTools({ mode: "detach" });
    });
    globalShortcut.register("Alt+=", () => {
      console.log("You pressed alt & + ++++");
      demo.webContents.send("web_view_range", "plus");
    });
    globalShortcut.register("CommandOrControl+E", () => {
      if (ignore == false) {
        console.log("disable_skip");
        demo.setIgnoreMouseEvents(true);
        ShowNoty(noty_info, noty_title_lock_true, "Notification_lock_on");
        ignore = true;
        demo.webContents.send("add_class", "transition");
      } else {
        console.log("disable_skip");
        demo.webContents.send("disable_skip", "false");
        demo.setIgnoreMouseEvents(false);
        ShowNoty(noty_info, noty_title_lock_false, "Notification_lock_off");
        ignore = false;
        demo.webContents.send("remove_class", "transition");
      }
      change_icon();
    });

    globalShortcut.register("CommandOrControl+D", () => {
      var top = demo.isAlwaysOnTop();
      if (top == true) {
        demo.setAlwaysOnTop(false);
        top = false;
        ShowNoty(noty_info, noty_title_top_false, "Notification_layer_off");
        //  alert("не top");
      } else {
        demo.setAlwaysOnTop(true);
        top = true;
        ShowNoty(noty_info, noty_title_top_true, "Notification_lock_on");
        // alert("top");
      }
      change_icon();
    });

    globalShortcut.register("Alt+-", () => {
      console.log("You pressed alt & ------");
      demo.webContents.send("web_view_range", "minus");
    });
  }
}
function Unlock() {
  if (ignore == true) {
    console.log("disable");

    demo.setIgnoreMouseEvents(false);
    demo.webContents.send("disable_skip_tray", "false");
    demo.webContents.send("remove_class", "transition");
    ignore = false;
    ShowNoty(noty_info, noty_title_lock_false, "Notification_lock_off");
    change_icon();
  } else {
    console.log("disable");

    demo.setIgnoreMouseEvents(true);
    demo.webContents.send("disable_skip_tray", "true");
    demo.webContents.send("add_class", "transition");
    ignore = true;
    ShowNoty(noty_info, noty_title_lock_true, "Notification_lock_on");
    change_icon();
  }
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
function ShowNoty(value_title, value_body, icon) {
  if (icon == "null") {
    let note = new Notification({
      theme: "dark",
      title: value_title,
      sound: "absolute path to audio file",
      body: value_body,
      position: "bottom-right",
      icon: Path.join(__dirname, '../img/Notification_hotket_off.png')
    });
    console.log(__dirname);

    note.on("close", function () {
      console.log("Notification has been closed");
    });

    note.show();
    setTimeout(() => {
      note.close();
    }, 5000);

  } else {
    let note = new Notification({
      theme: "dark",
      title: value_title,
      sound: "absolute path to audio file",
      body: value_body,
      position: "bottom-right",
      icon: Path.join(__dirname, '../img/' + icon + '.png')
    });
    console.log(__dirname);

    note.on("close", function () {
      console.log("Notification has been closed");
    });

    note.show();
    setTimeout(() => {
      note.close();
    }, 5000);

  }
}
ipcMain.on("show_noty_lock_false", (event, arg) => {
  ShowNoty(noty_info, noty_title_lock_false, "Notification_lock_off");
});
ipcMain.on("show_noty_lock_true", (event, arg) => {
  ShowNoty(noty_info, noty_title_lock_true, "Notification_lock_on");
});
ipcMain.on("show_noty_top_true", (event, arg) => {
  ShowNoty(noty_info, noty_title_top_true, "Notification_layer_on");
});
ipcMain.on("show_noty_top_false", (event, arg) => {
  ShowNoty(noty_info, noty_title_top_false, "Notification_layer_off");
});
ipcMain.on("ignore", (event, arg) => {
  ignore = arg;
  console.log(arg);

});

ipcMain.on("disable_sc", (event, args) => {
  disable_sc();
});
ipcMain.on("change_icon", (event, arg) => {
  change_icon();
});
ipcMain.on("exit_ida", (event, arg) => {
  app.exit();
});
ipcMain.on("lock", (event, arg) => {
  Unlock();
});
ipcMain.on("tray_start", (event, arg) => {
  trayWIN.webContents.send("lang_data_event", lang_data);
});
ipcMain.on("Over", (event, arg) => {
  OverAll();
});
ipcMain.on("open", (event, arg) => {
  demo.show();
});
ipcMain.on("tray-window-clicked", (e, a) => {
  console.log("clicked the tray icon");
  //console.log(e.window)
  //console.log(e.tray)

  // demo.focus();
});
ipcMain.on("demo_load", (e, a) => {
  demo.webContents.send("lang_data_event", lang_data);
});
ipcMain.on("hotkey", (e, a) => {
  if (a == true) {
    short_cuts = true;
  } else {
    short_cuts = false;
  }
  disable_sc();
});
ipcMain.on("demo_load", (e, a) => {
  change_icon();
});
function change_icon() {
  var top = demo.isAlwaysOnTop();
  console.log("ignore=" + ignore + "___" + "top=" + top);
  if (ignore == true && top == true) {
    demo.setIcon("img/icon_4.png");
    demo.webContents.send("lock", true);
    demo.webContents.send("over_top", true);
    trayWIN.webContents.send("lock", true);
    trayWIN.webContents.send("over_top", true);
  } else {
    if (ignore == false) {
      demo.webContents.send("lock", false);
      trayWIN.webContents.send("lock", false);
    }
    if (top == false) {
      trayWIN.webContents.send("over_top", false);
    }
    if (ignore == false && top == false) {
      demo.setIcon("img/icon_2.png");
      demo.webContents.send("lock", false);
      demo.webContents.send("over_top", false);
      trayWIN.webContents.send("lock", false);
      trayWIN.webContents.send("over_top", false);
      console.log("false flase");
    } else {
      if (ignore == true) {
        demo.setIcon("img/icon_3.png");
        demo.webContents.send("lock", true);
        trayWIN.webContents.send("lock", true);
      }
      if (top == true) {
        demo.setIcon("img/main.png");
        demo.webContents.send("over_top", true);
        trayWIN.webContents.send("over_top", true);
      }
    }
  }
}
// локализация

// отпрвавление
