var s = function(sel) {
    return document.querySelector(sel);
  };
  var sId = function(sel) {
    return document.getElementById(sel);
  };
  var removeClass = function(el, clss) {
    el.className = el.className.replace(new RegExp('\\b' + clss + ' ?\\b', 'g'), '');
  }
  var joysticks = {
    dynamic: {
      zone: s('.zone.dynamic'),
      color: 'blue',
      multitouch: true
    },
    semi: {
      zone: s('.zone.semi'),
      mode: 'semi',
      catchDistance: 150,
      color: 'white'
    },
    static: {
      zone: s('.zone.static'),
      mode: 'static',
      position: {
        left: '50%',
        top: '50%'
      },
      color: 'red'
    }
  };
  var joystick;
  
  // Get debug elements and map them
  var elDebug = sId('debug');
  var elDump = elDebug.querySelector('.dump');
  var els = {
    position: {
      x: elDebug.querySelector('.position .x .data'),
      y: elDebug.querySelector('.position .y .data')
    },
    force: elDebug.querySelector('.force .data'),
    pressure: elDebug.querySelector('.pressure .data'),
    distance: elDebug.querySelector('.distance .data'),
    angle: {
      radian: elDebug.querySelector('.angle .radian .data'),
      degree: elDebug.querySelector('.angle .degree .data')
    },
    direction: {
      x: elDebug.querySelector('.direction .x .data'),
      y: elDebug.querySelector('.direction .y .data'),
      angle: elDebug.querySelector('.direction .angle .data')
    }
  };
  
  
  var timeoutCreate;
  function createThrottle (evt) {
    clearTimeout(timeoutCreate);
    timeoutCreate = setTimeout(() => {
      createNipple(evt);
    }, 100);
  }
  
  sId('buttons').onclick = sId('buttons').ontouchend = createThrottle;
  
  createNipple('dynamic');
  
  function bindNipple() {
    joystick.on('start end', function(evt, data) {
      dump(evt.type);
      debug(data);
    }).on('move', function(evt, data) {
      debug(data);
    }).on('dir:up plain:up dir:left plain:left dir:down ' +
          'plain:down dir:right plain:right',
          function(evt, data) {
      dump(evt.type);
    }
         ).on('pressure', function(evt, data) {
      debug({
        pressure: data
      });
    });
  }
  
  function createNipple(evt) {
    var type = typeof evt === 'string' ?
        evt : evt.target.getAttribute('data-type');
    if (joystick) {
      joystick.destroy();
    }
    removeClass(s('.zone.active'), 'active');
    removeClass(s('.button.active'), 'active');
    removeClass(s('.highlight.active'), 'active');
    s('.highlight.' + type).className += ' active';
    s('.button.' + type).className += ' active';
    s('.zone.' + type).className += ' active';
    joystick = nipplejs.create(joysticks[type]);
    console.log(joystick, nipplejs);
    bindNipple();
  }
  
  // Print data into elements
  function debug(obj) {
    function parseObj(sub, el) {
      for (var i in sub) {
        if (typeof sub[i] === 'object' && el) {
          parseObj(sub[i], el[i]);
        } else if (el && el[i]) {
          el[i].innerHTML = sub[i];
        }
      }
    }
    setTimeout(function() {
      parseObj(obj, els);
    }, 0);
  }
  
  var nbEvents = 0;
  
  // Dump data
  function dump(evt) {
    setTimeout(function() {
      if (elDump.children.length > 4) {
        elDump.removeChild(elDump.firstChild);
      }
      var newEvent = document.createElement('div');
      newEvent.innerHTML = '#' + nbEvents + ' : <span class="data">' +
        evt + '</span>';
      elDump.appendChild(newEvent);
      nbEvents += 1;
    }, 0);
  }