var app = document.querySelector('#app');

app.stepSize = 0.25;
var modified = true;
var layoutWidthCurr = 15;
var layoutHeightCurr = 5;
var layout = {};

app.saveLayout = function() {
  var blob = new Blob([serialize(layout)], {type: 'text/plain;charset=utf-8'});
  saveAs(blob, 'layout.json');
};

app.loadLayout = function() {

};

app.loadPreset = function() {
  $.getJSON('../presets/layouts/60.json', function( data ) {
    layout = data;
    renderLayout();
    resizeLayout();
  });

  document.querySelector('#saveLayout').removeAttribute('disabled');
  document.querySelector('#layoutAddKey').removeAttribute('disabled');

  document.querySelector('#layout').addEventListener(
    'tap', keyHTML.onTap, false);

  var zoomSlider = document.querySelector('#zoomSlider');
  zoomSlider.removeAttribute('disabled');
  zoomSlider.addEventListener('immediate-value-change', function() {
    updateLayout();
    resizeLayout();
  });

  var showCaps = document.querySelector('#showCaps');
  showCaps.removeAttribute('disabled');
  showCaps.addEventListener('change', function(event) {
    for (var k in layout.keys) {
      document.querySelector('#key_' + k).showCap =
        event.target.hasAttribute('checked');
    }
  });
};

app.layoutAddKey = function() {
  modified = true;

  var key = {
    'k': '',
    'x': 0,
    'y': 0,
    'w': 1,
    'h': 1,
    'r': 0
  };

  var container = document.querySelector('#layoutContainer');
  var unitSize = document.querySelector('#zoomSlider').immediateValue;
  var numKeys = layout.keys.length;
  var lastKey = layout.keys[numKeys - 1];
  if ((lastKey.x + lastKey.w) > (layoutWidth() - 1)) {
    key.x = 0;
    key.y = lastKey.y + 1;
  } else {
    key.x = lastKey.x + lastKey.w;
    key.y = lastKey.y;
  }

  //key.k = 'NEW<br>' + numKeys;
  layout.keys.push(key);

  var keySwitch = document.createElement('ionize-switch');
  keySwitch.id = 'switch_' + numKeys;
  keySwitch.setAttribute('unit-size', unitSize);
  keySwitch.setAttribute('x', key.x);
  keySwitch.setAttribute('y', key.y);
  container.appendChild(keySwitch);

  container.appendChild(keyHTML.create(numKeys));
  keyHTML.update(numKeys);
  resizeLayout();
};

app.layoutDeleteKey = function() {
  modified = true;

  var keys = document.querySelectorAll('.selected');

  for (var i = 0; i < keys.length; i++) {
    var key = keys.item(i);
    var k = parseInt(key.id.replace('key_', ''), 10);

    // Delete the key's html
    key.remove();

    for (var ii = k + 1; ii < layout.keys.length; ii++) {
      document.querySelector('#key_' + ii).id = 'key_' + (ii - 1);
    }

    // Delete the key in the layout array
    layout.keys.splice(k, 1);
    //delete layout.keys[k];
  }

  document.querySelector('#layoutDeleteKey').setAttribute('disabled');

  //sortLayout();
  resizeLayout();
};

app.moveKey = function(dir) {
  modified = true;

  var container = document.querySelector('#layoutContainer');
  var keys = document.querySelectorAll('.selected');
  var canMove = true;

  for (var i = 0; i < keys.length; i++) {
    var key = layout.keys[parseInt(keys.item(i).id.replace('key_', ''), 10)];
    if ((key.x < app.stepSize && dir == 'left') ||
        (key.y < app.stepSize && dir == 'up')) {
      canMove = false;
      break;
    }
  }

  if (canMove) {
    for (var i = 0; i < keys.length; i++) {
      var k = parseInt(keys.item(i).id.replace('key_', ''), 10);
      var key = layout.keys[k];

      switch (dir) {
        case 'up':
          key.y -= app.stepSize;
          keyHTML.update(k);
          break;
        case 'down':
          key.y += app.stepSize;
          keyHTML.update(k);
          break;
        case 'left':
          key.x -= app.stepSize;
          keyHTML.update(k);
          break;
        case 'right':
          key.x += app.stepSize;
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
  simple.push([[]]);

  var defaults = {};
  defaults.s = obj.meta.s;
  defaults.t = obj.meta.t;
  defaults.l = obj.meta.l;
  defaults.st = obj.meta.st;
  defaults.r = 0;
  defaults.w = 1;
  defaults.h = 1;

  var row = 0;

  for (var k in obj.keys) {
    var key = obj.keys[k];
    var vals = {};

    if (key.s !== defaults.s) {
      vals.s = key.s;
      defaults.s = vals.s;
    }
    if (key.t !== defaults.t) {
      vals.t = key.t;
      defaults.t = vals.t;
    }
    if (key.l !== defaults.l) {
      vals.l = key.l;
      defaults.l = vals.l;
    }
    if (key.st !== defaults.st) {
      vals.st = key.st;
      defaults.st = vals.st;
    }
    if (key.r !== defaults.r) {
      vals.r = key.r;
      defaults.r = vals.r;
    }
    if (key.w !== defaults.w) {
      vals.w = key.w;
      defaults.w = vals.w;
    }
    if (key.h !== defaults.h) {
      vals.h = key.h;
      defaults.h = vals.h;
    }

    if (Object.keys(vals).length > 0) {
      simple[1][row].push(vals);
    }

    vals = {};
    vals.k = key.k;
    if (k == 0 && key.x == 0 && key.y == 0) {

    } else if ((simple[1][row].length > 0) &&
               (key.x == (obj.keys[k - 1].x + obj.keys[k - 1].w)) &&
               (key.y == obj.keys[k - 1].y)) {

    } else {
      vals.x = key.x;
      vals.y = key.y;
    }

    if (key.x2 !== 0) {
      vals.x2 = key.x2;
    }
    if (key.y2 !== 0) {
      vals.y2 = key.y2;
    }
    if (key.w2 !== key.w) {
      vals.w2 = key.w2;
    }
    if (key.h2 !== key.h) {
      vals.h2 = key.h2;
    }
    if (key.sw !== key.w) {
      vals.sw = key.sw;
    }
    if (key.sr !== key.r) {
      vals.sr = key.sr;
    }

    if (Object.keys(vals).length > 1) {
      simple[1][row].push(vals);
    } else {
      simple[1][row].push(key.k);
    }
  }

  //return JSON.stringify(obj, null, 2);
  return JSON.stringify(simple, null, 2);
};

var deserialize = function(serialized) {
  return JSON.parse(serialized);
};

var renderLayout = function() {
  if (document.querySelector('#layoutContainer') !== null) {
    document.querySelector('#layoutContainer').remove();
  }

  var keyboard = document.createElement('paper-material');
  keyboard.style.position = 'absolute';
  keyboard.style.margin = '16px';
  //keyboard.style.borderRadius = '8px';
  keyboard.setAttribute('elevation', 1);

  var container = document.createElement('div');
  container.id = 'layoutContainer';
  container.style.position = 'absolute';

  keyboard.appendChild(container);

  document.querySelector('#layout').appendChild(keyboard);

  for (var k in layout.keys) {
    container.appendChild(keyHTML.create(k));
    keyHTML.update(k);
  }

  resizeLayout();
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

  /*var list = $('.key').get();
  list.sort(function(a, b) {
    var c = {}, d = {};
    c.x = parseInt(a.getAttribute('x'), 10);
    c.y = parseInt(a.getAttribute('y'), 10);
    d.x = parseInt(b.getAttribute('x'), 10);
    d.y = parseInt(b.getAttribute('y'), 10);
    return sortKeys(c, d);
  });
  for (var i = 0; i < list.length; i++) {
    list[i].parentNode.appendChild(list[i]);
    list[i].id = 'key_' + i;
  }*/
};

var resizeLayout = function() {
  var container = document.querySelector('#layoutContainer');
  var keyboard = container.parentNode;
  var unitSize = document.querySelector('#zoomSlider').immediateValue;

  keyboard.style.padding = (unitSize / 4) + 'px';
  keyboard.style.width = (layoutWidth() * unitSize) + 'px';
  keyboard.style.height = (layoutHeight() * unitSize) + 'px';

  container.style.left = (unitSize / 4) + 'px';
  container.style.top = (unitSize / 4) + 'px';
  container.style.width = (layoutWidth() * unitSize) + 'px';
  container.style.height = (layoutHeight() * unitSize) + 'px';

  modified = false;
};

var layoutWidth = function() {
  if (modified) {
    layoutWidthCurr = Math.max.apply(Math, layout.keys.map(function(key) {
      return key.x + key.w;
    }));
  }

  return layoutWidthCurr;
};

var layoutHeight = function() {
  if (modified) {
    layoutHeightCurr = Math.max.apply(Math, layout.keys.map(function(key) {
      return key.y + key.h;
    }));
  }

  return layoutHeightCurr;
};

var keyHTML = {};

keyHTML.create = function(k) {
  var key = document.createElement('ionize-key');
  key.id = 'key_' + k;
  key.unitSize = document.querySelector('#zoomSlider').immediateValue;
  key.k = 'NEW<br>' + k;
  key.x = 0;
  key.y = 0;
  key.w = 1;
  key.h = 1;
  key.showCap = document.querySelector('#showCaps').hasAttribute('checked');

  return key;
};

keyHTML.update = function(k) {
  var keyData = layout.keys[k];
  var key = document.querySelector('#key_' + k);
  key.unitSize = document.querySelector('#zoomSlider').immediateValue;
  key.k = keyData.k;
  key.x = keyData.x;
  key.y = keyData.y;
  key.w = keyData.w;
  key.h = keyData.h;
};

keyHTML.onTap = function(event) {
  var key;
  if (document.querySelector('#showCaps').hasAttribute('checked')) {
    key = event.target.closest('.keyBG');
  } else {
    key = event.target.closest('.switch');
  }

  if (key !== null) {
    key = key.parentNode;
    var id = parseInt(key.id.replace('key_', ''), 10);
    var lastKey = document.querySelector('.last');

    if (app.shiftKey) {
      if (lastKey !== null) {
        // Get index of previous key
        var lastID = parseInt(lastKey.id.replace('key_', ''), 10);

        // Remove .last from previous key
        lastKey.classList.remove('last');

        // Swap the values
        if (lastID > id) {
          var tmp = id;
          id = lastID;
          lastID = tmp;
        }

        // Select all the keys in between
        for (var i = lastID; i <= id; i++) {
          var currKey = document.querySelector('#key_' + i);
          currKey.classList.add('selected');
        }
      }

      // Add .selected.last to the clicked key
      key.classList.add('selected', 'last');
    } else if (app.controlKey) {
      // Add .selected.last to the clicked key
      if (key.classList.toggle('last', key.classList.toggle('selected'))) {
        // Remove .last from previous key
        if (lastKey !== null) {
          lastKey.classList.remove('last');
        }
      }
    } else {
      keyHTML.deselectAll();

      // Add .selected.last to the clicked key
      key.classList.add('selected', 'last');
    }

    if (document.querySelector('.selected') !== null) {
      document.querySelector('#layoutDeleteKey').removeAttribute('disabled');
    } else {
      document.querySelector('#layoutDeleteKey').setAttribute('disabled');
    }
  } else {
    keyHTML.deselectAll();
  }
};

keyHTML.deselectAll = function() {
  var keys = document.querySelectorAll('.selected');
  for (var i = 0; i < keys.length; i++) {
    keys.item(i).classList.remove('selected', 'last');
  }

  document.querySelector('#layoutDeleteKey').setAttribute('disabled');
};
