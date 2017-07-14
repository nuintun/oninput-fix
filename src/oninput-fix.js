'use strict';

var $ = require('jquery');

var INPUTRE = /^INPUT|TEXTAREA$/;
var INPUTNODE = document.createElement('input');
var ISIE9 = /MSIE 9.0;/i.test(navigator.appVersion || '');

function isInputElement(element) {
  return INPUTRE.test(element.nodeName);
}

if ('oninput' in INPUTNODE) {
  var addEventListener = function() {};
  var removeEventListener = function() {};

  if (INPUTNODE.addEventListener) {
    addEventListener = function(element, event, fn) {
      element.addEventListener(event, fn, false);
    };
  } else if (INPUTNODE.attachEvent) {
    addEventListener = function(element, event, fn) {
      element.attachEvent(event, fn);
    };
  }

  if (INPUTNODE.removeEventListener) {
    removeEventListener = function(element, event, fn) {
      element.removeEventListener(event, fn, false);
    };
  } else if (INPUTNODE.detachEvent) {
    removeEventListener = function(element, event, fn) {
      element.detachEvent(event, fn);
    };
  }

  var handler = function(event) {
    event = $.event.fix(event || window.event);
    event.type = 'input';

    return $.event.dispatch.call(this, event);
  };

  var IE9HackHander = function(event) {
    event.keyCode === 8 && $.event.trigger('input', null, this);
  };

  $.event.special.input = {
    setup: function() {
      var element = this;

      if (!isInputElement(element)) return false;

      addEventListener(element, 'input', handler);

      ISIE9 && $.event.add(element, 'keydown', IE9HackHander);
    },
    teardown: function() {
      var element = this;

      if (!isInputElement(element)) return false;

      removeEventListener(element, 'input', handler);

      ISIE9 && $.event.remove(element, 'keydown', IE9HackHander);
    }
  };
} else if ('onpropertychange' in INPUTNODE) {
  var handler = function(event) {
    // only trigger input event on value change
    event.originalEvent.propertyName === 'value' && $.event.trigger('input', null, this);
  };

  $.event.special.input = {
    setup: function() {
      var element = this;

      if (!isInputElement(element)) return false;

      // bind propertychange event
      $.event.add(element, 'propertychange', handler);
    },
    teardown: function() {
      var element = this;

      if (!isInputElement(element)) return false;

      $.event.remove(element, 'propertychange', handler);
    }
  };
}

$.fn.extend({
  input: function(fn) {
    return fn ? this.on('input', fn) : this.trigger('input');
  },
  uninput: function(fn) {
    return this.off('input', fn);
  }
});

module.exports = $;
