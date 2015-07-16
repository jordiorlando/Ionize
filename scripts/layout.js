var app = document.querySelector('#app');

app.unitSize = 90; // Size in px of 1U
app.stepSize = 0.25;
var layout = {};

app.saveLayout = function() {
  var blob = new Blob([serialize(layout)], {type: "text/plain;charset=utf-8"}); // TODO: make sure hashes are not included
  saveAs(blob, "layout.json");
};

app.loadLayout = function() {

};

app.loadPreset = function() {
  $.getJSON("../presets/layouts/60.json", function( data ) {
    layout = data;
    renderLayout();
  });

  document.querySelector("#addKey").removeAttribute("disabled");
};

app.addKey = function() {
  var key = {
    "k": "",
    "x": 0,
    "y": 0,
    "w": 1,
    "h": 1,
    "r": 0
  };

  var container = document.querySelector("#layoutContainer");
  var numKeys = layout.keys.length;
  var lastKey = layout.keys[numKeys - 1];
  if ((lastKey.swtc.x + lastKey.cap.w) > (layoutWidth() - 1)) {
    key.swtc.x = 0;
    key.swtc.y = lastKey.swtc.y + 1;

    container.style.height = ((key.swtc.y + key.cap.h) * app.unitSize) + "px";
  } else {
    key.swtc.x = lastKey.swtc.x + lastKey.cap.w;
    key.swtc.y = lastKey.swtc.y;
  }

  //key.k = "NEW<br>" + numKeys;
  layout.keys.push(key);

  container.appendChild(keyHTML.create(numKeys));
  keyHTML.update(numKeys);
};

app.deleteKey = function() {
  var keys = document.querySelectorAll(".selected");

  for (var i = 0; i < keys.length; i++) {
    var key = keys.item(i);
    var k = parseInt(key.id.replace("key_", ""), 10);

    // Delete the key's html
    key.remove();

    for (var ii = k + 1; ii < layout.keys.length; ii++) {
      document.querySelector("#key_" + ii).id = "key_" + (ii - 1);
    }

    // Delete the key in the layout array
    layout.keys.splice(k, 1);
    //delete layout.keys[k];
  }

  document.querySelector("#deleteKey").setAttribute("disabled");

  //sortLayout();
  resizeLayout();
};

app.moveKey = function(dir) {
  var container = document.querySelector("#layoutContainer");
  var keys = document.querySelectorAll(".selected");
  var canMove = true;

  for (var i = 0; i < keys.length; i++) {
    var key = layout.keys[parseInt(keys.item(i).id.replace("key_", ""), 10)];
    if ((key.swtc.x < app.stepSize && dir == "left") || (key.swtc.y < app.stepSize && dir == "up")) {
      canMove = false;
      break;
    }
  }

  if (canMove) {
    for (var i = 0; i < keys.length; i++) {
      var k = parseInt(keys.item(i).id.replace("key_", ""), 10);
      var key = layout.keys[k];

      switch (dir) {
        case "up":
          key.swtc.y -= app.stepSize;
          keyHTML.update(k);
          break;
        case "down":
          key.swtc.y += app.stepSize;
          keyHTML.update(k);
          break;
        case "left":
          key.swtc.x -= app.stepSize;
          keyHTML.update(k);
          break;
        case "right":
          key.swtc.x += app.stepSize;
          keyHTML.update(k);
          break;
      }
    }

    //sortLayout();
    resizeLayout();
  }
};



var serialize = function(obj) {
  var simple = [];
  simple.push(obj.meta);
  simple.push([]);

  var defaults = {};
  defaults.s = obj.meta.s;
  defaults.t = obj.meta.t;
  defaults.l = obj.meta.l;
  defaults.st = obj.meta.st;
  defaults.r = 0;
  defaults.w = 1;
  defaults.h = 1;

  for (var k in obj.keys) {
    var key = obj.keys[k];
    var vals = {};

    if (key.swtc.s !== defaults.s) {
      vals.s = key.swtc.s;
      defaults.s = vals.s;
    }
    if (key.swtc.t !== defaults.t) {
      vals.t = key.swtc.t;
      defaults.t = vals.t;
    }
    if (key.swtc.l !== defaults.l) {
      vals.l = key.swtc.l;
      defaults.l = vals.l;
    }
    if (key.stab.st !== defaults.st) {
      vals.st = key.stab.st;
      defaults.st = vals.st;
    }
    if (key.swtc.r !== defaults.r) {
      vals.r = key.swtc.r;
      defaults.r = vals.r;
    }
    if (key.cap.w !== defaults.w) {
      vals.w = key.cap.w;
      defaults.w = vals.w;
    }
    if (key.cap.h !== defaults.h) {
      vals.h = key.cap.h;
      defaults.h = vals.h;
    }

    if (Object.keys(vals).length !== 0) {
      simple[1].push(vals);
    }

    vals = {};
    vals.k = key.swtc.k;
    vals.x = key.swtc.x;
    vals.y = key.swtc.y;
    if (key.cap.x2 !== 0) {
      vals.x2 = key.cap.x2;
    }
    if (key.cap.y2 !== 0) {
      vals.y2 = key.cap.y2;
    }
    if (key.cap.w2 !== key.cap.w) {
      vals.w2 = key.cap.w2;
    }
    if (key.cap.h2 !== key.cap.h) {
      vals.h2 = key.cap.h2;
    }
    if (key.stab.sw !== key.cap.w) {
      vals.sw = key.stab.sw;
    }
    if (key.stab.sr !== key.swtc.r) {
      vals.sr = key.stab.sr;
    }

    simple[1].push(vals);
  }

  //return JSON.stringify(obj, null, 2);
  return JSON.stringify(simple, null, 2);
};

var deserialize = function(serialized) {
  return JSON.parse(serialized);
};

var renderLayout = function() {
  document.querySelector("#layout").innerHTML = "<paper-material elevation=\"1\" style=\"position: absolute; margin: 16px; padding: 25px;\" id=\"layoutContainer\"></paper-material>";
  var container = document.querySelector("#layoutContainer");
  container.innerHTML = null;

  for (var k in layout.keys) {
    container.appendChild(keyHTML.create(k));
    keyHTML.update(k);
  }
  container.style.width = (15 * app.unitSize) + "px";
  container.style.height = (5 * app.unitSize) + "px";
  container.addEventListener("click", keyHTML.onClick, false);
};

var updateLayout = function() {
  for (var k in layout.keys) {
    keyHTML.update(k);
  }
};

var sortLayout = function() {
  var width = layoutWidth();

  var sortKeys = function(a, b) {
    return (a.x + (a.y * width)) - (b.x + (b.y * width));
  };

  layout.keys.sort(sortKeys);

  /*var list = $(".key").get();
  list.sort(function(a, b) {
    var c = {}, d = {};
    c.x = parseInt(a.getAttribute("x"), 10);
    c.y = parseInt(a.getAttribute("y"), 10);
    d.x = parseInt(b.getAttribute("x"), 10);
    d.y = parseInt(b.getAttribute("y"), 10);
    return sortKeys(c, d);
  });
  for (var i = 0; i < list.length; i++) {
    list[i].parentNode.appendChild(list[i]);
    list[i].id = "key_" + i;
  }*/
};

var resizeLayout = function() {
  var container = document.querySelector("#layoutContainer");

  container.style.width = (layoutWidth() * app.unitSize) + "px";
  container.style.height = (layoutHeight() * app.unitSize) + "px";
};

var layoutWidth = function() {
  return Math.max.apply(Math, layout.keys.map(function(key){return key.swtc.x + key.swtc.w;}));
};

var layoutHeight = function() {
  return Math.max.apply(Math, layout.keys.map(function(key){return key.swtc.y + key.swtc.h;}));
};

var keyHTML = {};

keyHTML.create = function(k) {
  var html = document.createElement("div");
  html.id = "key_" + k;
  html.className = "key";
  html.style.width = app.unitSize + "px";
  html.style.height = app.unitSize + "px";

  var keyBG = document.createElement("div");
  keyBG.className = "keyBG";
  keyBG.style.width = (app.unitSize * 72.5 / 75) + "px";
  keyBG.style.height = (app.unitSize * 72.5 / 75) + "px";
  keyBG.style.borderRadius = (app.unitSize / 10) + "px";

  var keyMG = document.createElement("div");
  keyMG.className = "keyMG";
  keyMG.style.width = (app.unitSize * 55 / 75) + "px";
  keyMG.style.height = (app.unitSize * 55 / 75) + "px";
  keyMG.style.borderRadius = (app.unitSize / 10) + "px";

  var keyFG = document.createElement("div");
  keyFG.className = "keyFG";
  keyFG.style.width = (app.unitSize * 55 / 75) + "px";
  keyFG.style.height = (app.unitSize * 55 / 75) + "px";
  keyFG.style.borderRadius = (app.unitSize / 10) + "px";

  var keyName = document.createElement("div");
  //keyName.className = "keyName";
  keyName.style.textAlign = "center";
  keyName.innerHTML = "NEW<br>" + k;

  keyFG.appendChild(keyName);
  keyMG.appendChild(keyFG);
  keyBG.appendChild(keyMG);
  html.appendChild(keyBG);

  return html;
};

keyHTML.update = function(k) {
  var key = layout.keys[k];
  var html = document.querySelector("#key_" + k);
  html.style.left = ((key.swtc.x + 0.25) * app.unitSize) + "px";
  //html.setAttribute("x", key.swtc.x);
  html.style.top = ((key.swtc.y + 0.25) * app.unitSize) + "px";
  //html.setAttribute("y", key.swtc.y);
  html.style.width = (key.cap.w * app.unitSize) + "px";
  html.style.height = (key.cap.h * app.unitSize) + "px";

  var keyBG = html.firstElementChild;
  keyBG.style.width = ((key.cap.w * app.unitSize) - (app.unitSize * 2.5 / 75)) + "px";
  keyBG.style.height = ((key.cap.h * app.unitSize) - (app.unitSize * 2.5 / 75)) + "px";

  var keyMG = keyBG.firstElementChild;
  keyMG.style.width = ((key.cap.w * app.unitSize) - (app.unitSize * 20 / 75)) + "px";
  keyMG.style.height = ((key.cap.h * app.unitSize) - (app.unitSize * 20 / 75)) + "px";

  var keyFG = keyMG.firstElementChild;
  keyFG.style.width = ((key.cap.w * app.unitSize) - (app.unitSize * 20 / 75)) + "px";
  keyFG.style.height = ((key.cap.h * app.unitSize) - (app.unitSize * 20 / 75)) + "px";

  var keyName = keyFG.firstElementChild;
  keyName.innerHTML = key.swtc.k;
};

keyHTML.onClick = function(event) {
  var key = event.target.closest(".keyBG");

  if (key !== null) {
    key = key.parentNode;
    var id = parseInt(key.id.replace("key_", ""), 10);
    var lastKey = document.querySelector(".last");

    if (app.shiftKey) {
      if (lastKey !== null) {
        // Get index of previous key
        var lastID = parseInt(lastKey.id.replace("key_", ""), 10);

        // Remove .last from previous key
        lastKey.className = lastKey.className.replace(" last", "");

        // Select all the keys in between
        if (lastID <= id) {
          for (var i = lastID; i <= id; i++) {
            var currKey = document.querySelector("#key_" + i);
            if (currKey.className.indexOf("selected") == -1) {
              currKey.className += " selected";
            }
          }
        } else {
          for (var i = lastID; i >= id; i--) {
            var currKey = document.querySelector("#key_" + i);
            if (currKey.className.indexOf("selected") == -1) {
              currKey.className += " selected";
            }
          }
        }
      }

      // Add .selected.last to the clicked key
      if (key.className.indexOf("selected") == -1) {
        key.className += " selected";
      }
      if (key.className.indexOf("last") == -1) {
        key.className += " last";
      }
    } else if (app.controlKey) {
      // Add .selected.last to the clicked key
      if (key.className.indexOf("selected") == -1) {
        key.className += " selected";
        if (key.className.indexOf("last") == -1) {
          key.className += " last";
        }
        if (lastKey !== null) {
          // Remove .last from previous key
          lastKey.className = lastKey.className.replace(" last", "");
        }
      } else {
        key.className = key.className.replace(" last", "").replace(" selected", "");
      }
    } else {
      keyHTML.deselectAll();

      // Add .selected.last to the clicked key
      if (key.className.indexOf("selected") == -1) {
        key.className += " selected";
      }
      if (key.className.indexOf("last") == -1) {
        key.className += " last";
      }
    }

    if (document.querySelector(".selected") !== null) {
      document.querySelector("#deleteKey").removeAttribute("disabled");
    } else {
      document.querySelector("#deleteKey").setAttribute("disabled");
    }
  } else {
    keyHTML.deselectAll();
  }
};

keyHTML.deselectAll = function() {
  var keys = document.querySelectorAll(".selected");
  for (var i = 0; i < keys.length; i++) {
    keys.item(i).className = keys.item(i).className.replace(" last", "").replace(" selected", "");
  }

  document.querySelector("#deleteKey").setAttribute("disabled");
};

/*$(".key").hover(function() {
  $(this).style.border = "1px solid #000";
}, function() {
  $(this).style.borderStyle = "none";
});*/
