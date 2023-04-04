var commonUtils = (function (exports) {
  'use strict';

  /**
   * exec function when dom loaded. can directly use it to declare
   * @param {() => void} domReadyAction
   * @param {boolean} instant
   */
  function exec(domReadyAction,instant=false) {
    if(instant) {
      domReadyAction();
    } else {
      const load = window.onload;
      window.onload = () => {
        // concat func
          load && load();
          domReadyAction();
      }; 
    }
  }

  /**
   * debounce function
   * @param {Function} callback
   * @param {number} wait
   * @returns
   */
  function debounce(callback, wait) {
    let timeoutId = null;
    return (...args) => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        callback.apply(null, args);
      }, wait);
    };
  }

  /**
   * debounce function
   * @param {Function} callback
   * @param {number} wait
   * @returns
   */
  function throttle(callback, wait) {
    let prev = 0;
    return (...args) => {
      let now = new Date().getTime();
      if (now - prev > wait) {
        prev = now;
        return callback(...args);
      }
    };
  }

  const consoleStyle = `color: white; background: #483D8B; padding: 0.25rem;`;
  /**
   *
   * @param {string} str
   * @param {string} style
   */
  const styledLog = {
    log: (str, style = undefined) => console.log(`%c ${str}`, style || consoleStyle),
    error: (str)  => console.log(`%c ${str} `, `color: white; background: #8b0000; padding: 0.25rem;`)
  }

  
  // piping utils
  const pipe =
    (...fns) =>
    (x) =>
      fns.reduce((v, f) => f(v), x);

  const flattenArray = (input) => input.reduce((acc, item) => [...acc, ...(Array.isArray(item) ? item : [item])], []);

  const map = (fn) => (input) => input.map(fn);
  const mapTo = (a) => (input) => input.map((_) => a);

  exports.exec = exec;
  exports.debounce = debounce;
  exports.throttle = throttle;
  exports.styledLog = styledLog;
  exports.pipe = pipe;
  exports.map = map;
  exports.mapTo = mapTo;
  exports.flattenArray = flattenArray;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
})({});
