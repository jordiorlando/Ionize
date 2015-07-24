(function(document) {
  'use strict';

  var app = document.querySelector('#app');

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {
    //console.log('Bindings have been resolved, content is loaded');

    document.querySelector('paper-slider').
    addEventListener('immediate-value-change', function() {
      updateLayout();
    });
  });

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {
    // imports are loaded and elements have been registered
  });

  app.shiftKey = false;
  app.controlKey = false;

  window.addEventListener('keydown', function(event) {
    if (event.defaultPrevented) {
      return; // Should do nothing if the key event was already consumed.
    }

    switch (event.key) {
      case 'Shift':
        app.shiftKey = true;
        break;
      case 'Control':
        app.controlKey = true;
        break;
      case 'Alt':
        app.controlKey = true;
        break;
      case 'Meta':
        app.controlKey = true;
        break;
      case 'OS':
        //app.osKey = true;
        break;
      case 'Escape':
        keyHTML.deselectAll();
        break;
      case 'Delete':
        app.layoutDeleteKey();
        break;
      case 'ArrowUp':
        app.moveKey('up');
        break;
      case 'ArrowDown':
        app.moveKey('down');
        break;
      case 'ArrowLeft':
        app.moveKey('left');
        break;
      case 'ArrowRight':
        app.moveKey('right');
        break;
      default:
        return; // Quit when this doesn't handle the key event.
    }

    // Consume the event for suppressing 'double action'.
    event.preventDefault();
  }, true);

  window.addEventListener('keyup', function(event) {
    if (event.defaultPrevented) {
      return; // Should do nothing if the key event was already consumed.
    }

    switch (event.key) {
      case 'Shift':
        app.shiftKey = false;
        break;
      case 'Control':
        app.controlKey = false;
        break;
      case 'Alt':
        app.controlKey = false;
        break;
      case 'Meta':
        app.controlKey = false;
        break;
      case 'OS':
        //app.osKey = false;
        break;
      default:
        return; // Quit when this doesn't handle the key event.
    }

    // Consume the event for suppressing 'double action'.
    event.preventDefault();
  }, true);

  // Close drawer after menu item is selected if drawerPanel is narrow
  app.onMenuSelect = function() {
    var drawerPanel = document.querySelector('#paperDrawerPanel');
    if (drawerPanel.narrow) {
      drawerPanel.closeDrawer();
    }
  };

  app.searchAction = function() {
    // TODO: site search
  };
})(document);
