(function (f) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = f();
  } else if (typeof define === "function" && define.amd) {
    define([], f);
  } else {
    var g;
    if (typeof window !== "undefined") {
      g = window;
    } else if (typeof global !== "undefined") {
      g = global;
    } else if (typeof self !== "undefined") {
      g = self;
    } else {
      g = this;
    }
    g.FakeTimers = f();
  }
})(function () {
  var define, module, exports;
  return (function () {
    function r(e, n, t) {
      function o(i, f) {
        if (!n[i]) {
          if (!e[i]) {
            var c = "function" == typeof require && require;
            if (!f && c) return c(i, !0);
            if (u) return u(i, !0);
            var a = new Error("Cannot find module '" + i + "'");
            throw ((a.code = "MODULE_NOT_FOUND"), a);
          }
          var p = (n[i] = { exports: {} });
          e[i][0].call(
            p.exports,
            function (r) {
              var n = e[i][1][r];
              return o(n || r);
            },
            p,
            p.exports,
            r,
            e,
            n,
            t,
          );
        }
        return n[i].exports;
      }
      for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
      return o;
    }
    return r;
  })()(
    {
      1: [
        function (require, module, exports) {
          "use strict";

          var every = require("./prototypes/array").every;

          /**
           * @private
           */
          function hasCallsLeft(callMap, spy) {
            if (callMap[spy.id] === undefined) {
              callMap[spy.id] = 0;
            }

            return callMap[spy.id] < spy.callCount;
          }

          /**
           * @private
           */
          function checkAdjacentCalls(callMap, spy, index, spies) {
            var calledBeforeNext = true;

            if (index !== spies.length - 1) {
              calledBeforeNext = spy.calledBefore(spies[index + 1]);
            }

            if (hasCallsLeft(callMap, spy) && calledBeforeNext) {
              callMap[spy.id] += 1;
              return true;
            }

            return false;
          }

          /**
           * A Sinon proxy object (fake, spy, stub)
           *
           * @typedef {object} SinonProxy
           * @property {Function} calledBefore - A method that determines if this proxy was called before another one
           * @property {string} id - Some id
           * @property {number} callCount - Number of times this proxy has been called
           */

          /**
           * Returns true when the spies have been called in the order they were supplied in
           *
           * @param  {SinonProxy[] | SinonProxy} spies An array of proxies, or several proxies as arguments
           * @returns {boolean} true when spies are called in order, false otherwise
           */
          function calledInOrder(spies) {
            var callMap = {};
            // eslint-disable-next-line no-underscore-dangle
            var _spies = arguments.length > 1 ? arguments : spies;

            return every(_spies, checkAdjacentCalls.bind(null, callMap));
          }

          module.exports = calledInOrder;
        },
        { "./prototypes/array": 9 },
      ],
      2: [
        function (require, module, exports) {
          "use strict";

          var functionName = require("./function-name");

          /**
           * Returns a display name for a value from a constructor
           *
           * @param  {object} value A value to examine
           * @returns {(string|null)} A string or null
           */
          function className(value) {
            return (
              (value.constructor && value.constructor.name) ||
              // The next branch is for IE11 support only:
              // Because the name property is not set on the prototype
              // of the Function object, we finally try to grab the
              // name from its definition. This will never be reached
              // in node, so we are not able to test this properly.
              // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name
              (typeof value.constructor === "function" &&
                /* istanbul ignore next */
                functionName(value.constructor)) ||
              null
            );
          }

          module.exports = className;
        },
        { "./function-name": 5 },
      ],
      3: [
        function (require, module, exports) {
          (function (process) {
            (function () {
              /* eslint-disable no-console */
              "use strict";

              /**
               * Returns a function that will invoke the supplied function and print a
               * deprecation warning to the console each time it is called.
               *
               * @param  {Function} func
               * @param  {string} msg
               * @returns {Function}
               */
              exports.wrap = function (func, msg) {
                var wrapped = function () {
                  exports.printWarning(msg);
                  return func.apply(this, arguments);
                };
                if (func.prototype) {
                  wrapped.prototype = func.prototype;
                }
                return wrapped;
              };

              /**
               * Returns a string which can be supplied to `wrap()` to notify the user that a
               * particular part of the sinon API has been deprecated.
               *
               * @param  {string} packageName
               * @param  {string} funcName
               * @returns {string}
               */
              exports.defaultMsg = function (packageName, funcName) {
                return (
                  packageName +
                  "." +
                  funcName +
                  " is deprecated and will be removed from the public API in a future version of " +
                  packageName +
                  "."
                );
              };

              /**
               * Prints a warning on the console, when it exists
               *
               * @param  {string} msg
               * @returns {undefined}
               */
              exports.printWarning = function (msg) {
                /* istanbul ignore next */
                if (typeof process === "object" && process.emitWarning) {
                  // Emit Warnings in Node
                  process.emitWarning(msg);
                } else if (console.info) {
                  console.info(msg);
                } else {
                  console.log(msg);
                }
              };
            }).call(this);
          }).call(this, require("_process"));
        },
        { _process: 40 },
      ],
      4: [
        function (require, module, exports) {
          "use strict";

          /**
           * Returns true when fn returns true for all members of obj.
           * This is an every implementation that works for all iterables
           *
           * @param  {object}   obj
           * @param  {Function} fn
           * @returns {boolean}
           */
          module.exports = function every(obj, fn) {
            var pass = true;

            try {
              // eslint-disable-next-line @sinonjs/no-prototype-methods/no-prototype-methods
              obj.forEach(function () {
                if (!fn.apply(this, arguments)) {
                  // Throwing an error is the only way to break `forEach`
                  throw new Error();
                }
              });
            } catch (e) {
              pass = false;
            }

            return pass;
          };
        },
        {},
      ],
      5: [
        function (require, module, exports) {
          "use strict";

          /**
           * Returns a display name for a function
           *
           * @param  {Function} func
           * @returns {string}
           */
          module.exports = function functionName(func) {
            if (!func) {
              return "";
            }

            try {
              return (
                func.displayName ||
                func.name ||
                // Use function decomposition as a last resort to get function
                // name. Does not rely on function decomposition to work - if it
                // doesn't debugging will be slightly less informative
                // (i.e. toString will say 'spy' rather than 'myFunc').
                (String(func).match(/function ([^\s(]+)/) || [])[1]
              );
            } catch (e) {
              // Stringify may fail and we might get an exception, as a last-last
              // resort fall back to empty string.
              return "";
            }
          };
        },
        {},
      ],
      6: [
        function (require, module, exports) {
          (function (global) {
            (function () {
              "use strict";

              /**
               * A reference to the global object
               *
               * @type {object} globalObject
               */
              var globalObject;

              /* istanbul ignore else */
              if (typeof global !== "undefined") {
                // Node
                globalObject = global;
              } else if (typeof window !== "undefined") {
                // Browser
                globalObject = window;
              } else {
                // WebWorker
                globalObject = self;
              }

              module.exports = globalObject;
            }).call(this);
          }).call(
            this,
            typeof global !== "undefined"
              ? global
              : typeof self !== "undefined"
              ? self
              : typeof window !== "undefined"
              ? window
              : {},
          );
        },
        {},
      ],
      7: [
        function (require, module, exports) {
          "use strict";

          module.exports = {
            global: require("./global"),
            calledInOrder: require("./called-in-order"),
            className: require("./class-name"),
            deprecated: require("./deprecated"),
            every: require("./every"),
            functionName: require("./function-name"),
            orderByFirstCall: require("./order-by-first-call"),
            prototypes: require("./prototypes"),
            typeOf: require("./type-of"),
            valueToString: require("./value-to-string"),
          };
        },
        {
          "./called-in-order": 1,
          "./class-name": 2,
          "./deprecated": 3,
          "./every": 4,
          "./function-name": 5,
          "./global": 6,
          "./order-by-first-call": 8,
          "./prototypes": 12,
          "./type-of": 17,
          "./value-to-string": 18,
        },
      ],
      8: [
        function (require, module, exports) {
          "use strict";

          var sort = require("./prototypes/array").sort;
          var slice = require("./prototypes/array").slice;

          /**
           * @private
           */
          function comparator(a, b) {
            // uuid, won't ever be equal
            var aCall = a.getCall(0);
            var bCall = b.getCall(0);
            var aId = (aCall && aCall.callId) || -1;
            var bId = (bCall && bCall.callId) || -1;

            return aId < bId ? -1 : 1;
          }

          /**
           * A Sinon proxy object (fake, spy, stub)
           *
           * @typedef {object} SinonProxy
           * @property {Function} getCall - A method that can return the first call
           */

          /**
           * Sorts an array of SinonProxy instances (fake, spy, stub) by their first call
           *
           * @param  {SinonProxy[] | SinonProxy} spies
           * @returns {SinonProxy[]}
           */
          function orderByFirstCall(spies) {
            return sort(slice(spies), comparator);
          }

          module.exports = orderByFirstCall;
        },
        { "./prototypes/array": 9 },
      ],
      9: [
        function (require, module, exports) {
          "use strict";

          var copyPrototype = require("./copy-prototype");

          module.exports = copyPrototype(Array.prototype);
        },
        { "./copy-prototype": 10 },
      ],
      10: [
        function (require, module, exports) {
          "use strict";

          var call = Function.call;

          module.exports = function copyPrototypeMethods(prototype) {
            // eslint-disable-next-line @sinonjs/no-prototype-methods/no-prototype-methods
            return Object.getOwnPropertyNames(prototype).reduce(function (result, name) {
              // ignore size because it throws from Map
              if (
                name !== "size" &&
                name !== "caller" &&
                name !== "callee" &&
                name !== "arguments" &&
                typeof prototype[name] === "function"
              ) {
                result[name] = call.bind(prototype[name]);
              }

              return result;
            }, Object.create(null));
          };
        },
        {},
      ],
      11: [
        function (require, module, exports) {
          "use strict";

          var copyPrototype = require("./copy-prototype");

          module.exports = copyPrototype(Function.prototype);
        },
        { "./copy-prototype": 10 },
      ],
      12: [
        function (require, module, exports) {
          "use strict";

          module.exports = {
            array: require("./array"),
            function: require("./function"),
            map: require("./map"),
            object: require("./object"),
            set: require("./set"),
            string: require("./string"),
          };
        },
        { "./array": 9, "./function": 11, "./map": 13, "./object": 14, "./set": 15, "./string": 16 },
      ],
      13: [
        function (require, module, exports) {
          "use strict";

          var copyPrototype = require("./copy-prototype");

          module.exports = copyPrototype(Map.prototype);
        },
        { "./copy-prototype": 10 },
      ],
      14: [
        function (require, module, exports) {
          "use strict";

          var copyPrototype = require("./copy-prototype");

          module.exports = copyPrototype(Object.prototype);
        },
        { "./copy-prototype": 10 },
      ],
      15: [
        function (require, module, exports) {
          "use strict";

          var copyPrototype = require("./copy-prototype");

          module.exports = copyPrototype(Set.prototype);
        },
        { "./copy-prototype": 10 },
      ],
      16: [
        function (require, module, exports) {
          "use strict";

          var copyPrototype = require("./copy-prototype");

          module.exports = copyPrototype(String.prototype);
        },
        { "./copy-prototype": 10 },
      ],
      17: [
        function (require, module, exports) {
          "use strict";

          var type = require("type-detect");

          /**
           * Returns the lower-case result of running type from type-detect on the value
           *
           * @param  {*} value
           * @returns {string}
           */
          module.exports = function typeOf(value) {
            return type(value).toLowerCase();
          };
        },
        { "type-detect": 41 },
      ],
      18: [
        function (require, module, exports) {
          "use strict";

          /**
           * Returns a string representation of the value
           *
           * @param  {*} value
           * @returns {string}
           */
          function valueToString(value) {
            if (value && value.toString) {
              // eslint-disable-next-line @sinonjs/no-prototype-methods/no-prototype-methods
              return value.toString();
            }
            return String(value);
          }

          module.exports = valueToString;
        },
        {},
      ],
      19: [
        function (require, module, exports) {
          "use strict";

          const globalObject = require("@sinonjs/commons").global;

          /**
           * @typedef {object} IdleDeadline
           * @property {boolean} didTimeout - whether or not the callback was called before reaching the optional timeout
           * @property {function():number} timeRemaining - a floating-point value providing an estimate of the number of milliseconds remaining in the current idle period
           */

          /**
           * Queues a function to be called during a browser's idle periods
           *
           * @callback RequestIdleCallback
           * @param {function(IdleDeadline)} callback
           * @param {{timeout: number}} options - an options object
           * @returns {number} the id
           */

          /**
           * @callback NextTick
           * @param {VoidVarArgsFunc} callback - the callback to run
           * @param {...*} arguments - optional arguments to call the callback with
           * @returns {void}
           */

          /**
           * @callback SetImmediate
           * @param {VoidVarArgsFunc} callback - the callback to run
           * @param {...*} arguments - optional arguments to call the callback with
           * @returns {NodeImmediate}
           */

          /**
           * @callback VoidVarArgsFunc
           * @param {...*} callback - the callback to run
           * @returns {void}
           */

          /**
           * @typedef RequestAnimationFrame
           * @property {function(number):void} requestAnimationFrame
           * @returns {number} - the id
           */

          /**
           * @typedef Performance
           * @property {function(): number} now
           */

          /* eslint-disable jsdoc/require-property-description */
          /**
           * @typedef {object} Clock
           * @property {number} now - the current time
           * @property {Date} Date - the Date constructor
           * @property {number} loopLimit - the maximum number of timers before assuming an infinite loop
           * @property {RequestIdleCallback} requestIdleCallback
           * @property {function(number):void} cancelIdleCallback
           * @property {setTimeout} setTimeout
           * @property {clearTimeout} clearTimeout
           * @property {NextTick} nextTick
           * @property {queueMicrotask} queueMicrotask
           * @property {setInterval} setInterval
           * @property {clearInterval} clearInterval
           * @property {SetImmediate} setImmediate
           * @property {function(NodeImmediate):void} clearImmediate
           * @property {function():number} countTimers
           * @property {RequestAnimationFrame} requestAnimationFrame
           * @property {function(number):void} cancelAnimationFrame
           * @property {function():void} runMicrotasks
           * @property {function(string | number): number} tick
           * @property {function(string | number): Promise<number>} tickAsync
           * @property {function(): number} next
           * @property {function(): Promise<number>} nextAsync
           * @property {function(): number} runAll
           * @property {function(): number} runToFrame
           * @property {function(): Promise<number>} runAllAsync
           * @property {function(): number} runToLast
           * @property {function(): Promise<number>} runToLastAsync
           * @property {function(): void} reset
           * @property {function(number | Date): void} setSystemTime
           * @property {Performance} performance
           * @property {function(number[]): number[]} hrtime - process.hrtime (legacy)
           * @property {function(): void} uninstall Uninstall the clock.
           * @property {Function[]} methods - the methods that are faked
           * @property {boolean} [shouldClearNativeTimers] inherited from config
           */
          /* eslint-enable jsdoc/require-property-description */

          /**
           * Configuration object for the `install` method.
           *
           * @typedef {object} Config
           * @property {number|Date} [now] a number (in milliseconds) or a Date object (default epoch)
           * @property {string[]} [toFake] names of the methods that should be faked.
           * @property {number} [loopLimit] the maximum number of timers that will be run when calling runAll()
           * @property {boolean} [shouldAdvanceTime] tells FakeTimers to increment mocked time automatically (default false)
           * @property {number} [advanceTimeDelta] increment mocked time every <<advanceTimeDelta>> ms (default: 20ms)
           * @property {boolean} [shouldClearNativeTimers] forwards clear timer calls to native functions if they are not fakes (default: false)
           */

          /* eslint-disable jsdoc/require-property-description */
          /**
           * The internal structure to describe a scheduled fake timer
           *
           * @typedef {object} Timer
           * @property {Function} func
           * @property {*[]} args
           * @property {number} delay
           * @property {number} callAt
           * @property {number} createdAt
           * @property {boolean} immediate
           * @property {number} id
           * @property {Error} [error]
           */

          /**
           * A Node timer
           *
           * @typedef {object} NodeImmediate
           * @property {function(): boolean} hasRef
           * @property {function(): NodeImmediate} ref
           * @property {function(): NodeImmediate} unref
           */
          /* eslint-enable jsdoc/require-property-description */

          /* eslint-disable complexity */

          /**
           * Mocks available features in the specified global namespace.
           *
           * @param {*} _global Namespace to mock (e.g. `window`)
           * @returns {FakeTimers}
           */
          function withGlobal(_global) {
            const userAgent = _global.navigator && _global.navigator.userAgent;
            const isRunningInIE = userAgent && userAgent.indexOf("MSIE ") > -1;
            const maxTimeout = Math.pow(2, 31) - 1; //see https://heycam.github.io/webidl/#abstract-opdef-converttoint
            const idCounterStart = 1e12; // arbitrarily large number to avoid collisions with native timer IDs
            const NOOP = function () {
              return undefined;
            };
            const NOOP_ARRAY = function () {
              return [];
            };
            const timeoutResult = _global.setTimeout(NOOP, 0);
            const addTimerReturnsObject = typeof timeoutResult === "object";
            const hrtimePresent = _global.process && typeof _global.process.hrtime === "function";
            const hrtimeBigintPresent = hrtimePresent && typeof _global.process.hrtime.bigint === "function";
            const nextTickPresent = _global.process && typeof _global.process.nextTick === "function";
            const utilPromisify = _global.process && require("util").promisify;
            const performancePresent = _global.performance && typeof _global.performance.now === "function";
            const hasPerformancePrototype =
              _global.Performance && (typeof _global.Performance).match(/^(function|object)$/);
            const hasPerformanceConstructorPrototype =
              _global.performance && _global.performance.constructor && _global.performance.constructor.prototype;
            const queueMicrotaskPresent = _global.hasOwnProperty("queueMicrotask");
            const requestAnimationFramePresent =
              _global.requestAnimationFrame && typeof _global.requestAnimationFrame === "function";
            const cancelAnimationFramePresent =
              _global.cancelAnimationFrame && typeof _global.cancelAnimationFrame === "function";
            const requestIdleCallbackPresent =
              _global.requestIdleCallback && typeof _global.requestIdleCallback === "function";
            const cancelIdleCallbackPresent =
              _global.cancelIdleCallback && typeof _global.cancelIdleCallback === "function";
            const setImmediatePresent = _global.setImmediate && typeof _global.setImmediate === "function";

            // Make properties writable in IE, as per
            // https://www.adequatelygood.com/Replacing-setTimeout-Globally.html
            /* eslint-disable no-self-assign */
            if (isRunningInIE) {
              _global.setTimeout = _global.setTimeout;
              _global.clearTimeout = _global.clearTimeout;
              _global.setInterval = _global.setInterval;
              _global.clearInterval = _global.clearInterval;
              _global.Date = _global.Date;
            }

            // setImmediate is not a standard function
            // avoid adding the prop to the window object if not present
            if (setImmediatePresent) {
              _global.setImmediate = _global.setImmediate;
              _global.clearImmediate = _global.clearImmediate;
            }
            /* eslint-enable no-self-assign */

            _global.clearTimeout(timeoutResult);

            const NativeDate = _global.Date;
            let uniqueTimerId = idCounterStart;

            /**
             * @param {number} num
             * @returns {boolean}
             */
            function isNumberFinite(num) {
              if (Number.isFinite) {
                return Number.isFinite(num);
              }

              return isFinite(num);
            }

            let isNearInfiniteLimit = false;

            /**
             * @param {Clock} clock
             * @param {number} i
             */
            function checkIsNearInfiniteLimit(clock, i) {
              if (clock.loopLimit && i === clock.loopLimit - 1) {
                isNearInfiniteLimit = true;
              }
            }

            /**
             *
             */
            function resetIsNearInfiniteLimit() {
              isNearInfiniteLimit = false;
            }

            /**
             * Parse strings like "01:10:00" (meaning 1 hour, 10 minutes, 0 seconds) into
             * number of milliseconds. This is used to support human-readable strings passed
             * to clock.tick()
             *
             * @param {string} str
             * @returns {number}
             */
            function parseTime(str) {
              if (!str) {
                return 0;
              }

              const strings = str.split(":");
              const l = strings.length;
              let i = l;
              let ms = 0;
              let parsed;

              if (l > 3 || !/^(\d\d:){0,2}\d\d?$/.test(str)) {
                throw new Error("tick only understands numbers, 'm:s' and 'h:m:s'. Each part must be two digits");
              }

              while (i--) {
                parsed = parseInt(strings[i], 10);

                if (parsed >= 60) {
                  throw new Error(`Invalid time ${str}`);
                }

                ms += parsed * Math.pow(60, l - i - 1);
              }

              return ms * 1000;
            }

            /**
             * Get the decimal part of the millisecond value as nanoseconds
             *
             * @param {number} msFloat the number of milliseconds
             * @returns {number} an integer number of nanoseconds in the range [0,1e6)
             *
             * Example: nanoRemainer(123.456789) -> 456789
             */
            function nanoRemainder(msFloat) {
              const modulo = 1e6;
              const remainder = (msFloat * 1e6) % modulo;
              const positiveRemainder = remainder < 0 ? remainder + modulo : remainder;

              return Math.floor(positiveRemainder);
            }

            /**
             * Used to grok the `now` parameter to createClock.
             *
             * @param {Date|number} epoch the system time
             * @returns {number}
             */
            function getEpoch(epoch) {
              if (!epoch) {
                return 0;
              }
              if (typeof epoch.getTime === "function") {
                return epoch.getTime();
              }
              if (typeof epoch === "number") {
                return epoch;
              }
              throw new TypeError("now should be milliseconds since UNIX epoch");
            }

            /**
             * @param {number} from
             * @param {number} to
             * @param {Timer} timer
             * @returns {boolean}
             */
            function inRange(from, to, timer) {
              return timer && timer.callAt >= from && timer.callAt <= to;
            }

            /**
             * @param {Clock} clock
             * @param {Timer} job
             */
            function getInfiniteLoopError(clock, job) {
              const infiniteLoopError = new Error(
                `Aborting after running ${clock.loopLimit} timers, assuming an infinite loop!`,
              );

              if (!job.error) {
                return infiniteLoopError;
              }

              // pattern never matched in Node
              const computedTargetPattern = /target\.*[<|(|[].*?[>|\]|)]\s*/;
              let clockMethodPattern = new RegExp(String(Object.keys(clock).join("|")));

              if (addTimerReturnsObject) {
                // node.js environment
                clockMethodPattern = new RegExp(`\\s+at (Object\\.)?(?:${Object.keys(clock).join("|")})\\s+`);
              }

              let matchedLineIndex = -1;
              job.error.stack.split("\n").some(function (line, i) {
                // If we've matched a computed target line (e.g. setTimeout) then we
                // don't need to look any further. Return true to stop iterating.
                const matchedComputedTarget = line.match(computedTargetPattern);
                /* istanbul ignore if */
                if (matchedComputedTarget) {
                  matchedLineIndex = i;
                  return true;
                }

                // If we've matched a clock method line, then there may still be
                // others further down the trace. Return false to keep iterating.
                const matchedClockMethod = line.match(clockMethodPattern);
                if (matchedClockMethod) {
                  matchedLineIndex = i;
                  return false;
                }

                // If we haven't matched anything on this line, but we matched
                // previously and set the matched line index, then we can stop.
                // If we haven't matched previously, then we should keep iterating.
                return matchedLineIndex >= 0;
              });

              const stack = `${infiniteLoopError}\n${job.type || "Microtask"} - ${
                job.func.name || "anonymous"
              }\n${job.error.stack
                .split("\n")
                .slice(matchedLineIndex + 1)
                .join("\n")}`;

              try {
                Object.defineProperty(infiniteLoopError, "stack", {
                  value: stack,
                });
              } catch (e) {
                // noop
              }

              return infiniteLoopError;
            }

            /**
             * @param {Date} target
             * @param {Date} source
             * @returns {Date} the target after modifications
             */
            function mirrorDateProperties(target, source) {
              let prop;
              for (prop in source) {
                if (source.hasOwnProperty(prop)) {
                  target[prop] = source[prop];
                }
              }

              // set special now implementation
              if (source.now) {
                target.now = function now() {
                  return target.clock.now;
                };
              } else {
                delete target.now;
              }

              // set special toSource implementation
              if (source.toSource) {
                target.toSource = function toSource() {
                  return source.toSource();
                };
              } else {
                delete target.toSource;
              }

              // set special toString implementation
              target.toString = function toString() {
                return source.toString();
              };

              target.prototype = source.prototype;
              target.parse = source.parse;
              target.UTC = source.UTC;
              target.prototype.toUTCString = source.prototype.toUTCString;

              return target;
            }

            //eslint-disable-next-line jsdoc/require-jsdoc
            function createDate() {
              /**
               * @param {number} year
               * @param {number} month
               * @param {number} date
               * @param {number} hour
               * @param {number} minute
               * @param {number} second
               * @param {number} ms
               *
               * @returns {Date}
               */
              function ClockDate(year, month, date, hour, minute, second, ms) {
                // the Date constructor called as a function, ref Ecma-262 Edition 5.1, section 15.9.2.
                // This remains so in the 10th edition of 2019 as well.
                if (!(this instanceof ClockDate)) {
                  return new NativeDate(ClockDate.clock.now).toString();
                }

                // if Date is called as a constructor with 'new' keyword
                // Defensive and verbose to avoid potential harm in passing
                // explicit undefined when user does not pass argument
                switch (arguments.length) {
                  case 0:
                    return new NativeDate(ClockDate.clock.now);
                  case 1:
                    return new NativeDate(year);
                  case 2:
                    return new NativeDate(year, month);
                  case 3:
                    return new NativeDate(year, month, date);
                  case 4:
                    return new NativeDate(year, month, date, hour);
                  case 5:
                    return new NativeDate(year, month, date, hour, minute);
                  case 6:
                    return new NativeDate(year, month, date, hour, minute, second);
                  default:
                    return new NativeDate(year, month, date, hour, minute, second, ms);
                }
              }

              return mirrorDateProperties(ClockDate, NativeDate);
            }

            //eslint-disable-next-line jsdoc/require-jsdoc
            function enqueueJob(clock, job) {
              // enqueues a microtick-deferred task - ecma262/#sec-enqueuejob
              if (!clock.jobs) {
                clock.jobs = [];
              }
              clock.jobs.push(job);
            }

            //eslint-disable-next-line jsdoc/require-jsdoc
            function runJobs(clock) {
              // runs all microtick-deferred tasks - ecma262/#sec-runjobs
              if (!clock.jobs) {
                return;
              }
              for (let i = 0; i < clock.jobs.length; i++) {
                const job = clock.jobs[i];
                job.func.apply(null, job.args);

                checkIsNearInfiniteLimit(clock, i);
                if (clock.loopLimit && i > clock.loopLimit) {
                  throw getInfiniteLoopError(clock, job);
                }
              }
              resetIsNearInfiniteLimit();
              clock.jobs = [];
            }

            /**
             * @param {Clock} clock
             * @param {Timer} timer
             * @returns {number} id of the created timer
             */
            function addTimer(clock, timer) {
              if (timer.func === undefined) {
                throw new Error("Callback must be provided to timer calls");
              }

              if (addTimerReturnsObject) {
                // Node.js environment
                if (typeof timer.func !== "function") {
                  throw new TypeError(
                    `[ERR_INVALID_CALLBACK]: Callback must be a function. Received ${
                      timer.func
                    } of type ${typeof timer.func}`,
                  );
                }
              }

              if (isNearInfiniteLimit) {
                timer.error = new Error();
              }

              timer.type = timer.immediate ? "Immediate" : "Timeout";

              if (timer.hasOwnProperty("delay")) {
                if (typeof timer.delay !== "number") {
                  timer.delay = parseInt(timer.delay, 10);
                }

                if (!isNumberFinite(timer.delay)) {
                  timer.delay = 0;
                }
                timer.delay = timer.delay > maxTimeout ? 1 : timer.delay;
                timer.delay = Math.max(0, timer.delay);
              }

              if (timer.hasOwnProperty("interval")) {
                timer.type = "Interval";
                timer.interval = timer.interval > maxTimeout ? 1 : timer.interval;
              }

              if (timer.hasOwnProperty("animation")) {
                timer.type = "AnimationFrame";
                timer.animation = true;
              }

              if (timer.hasOwnProperty("idleCallback")) {
                timer.type = "IdleCallback";
                timer.idleCallback = true;
              }

              if (!clock.timers) {
                clock.timers = {};
              }

              timer.id = uniqueTimerId++;
              timer.createdAt = clock.now;
              timer.callAt = clock.now + (parseInt(timer.delay) || (clock.duringTick ? 1 : 0));

              clock.timers[timer.id] = timer;

              if (addTimerReturnsObject) {
                const res = {
                  refed: true,
                  ref: function () {
                    this.refed = true;
                    return res;
                  },
                  unref: function () {
                    this.refed = false;
                    return res;
                  },
                  hasRef: function () {
                    return this.refed;
                  },
                  refresh: function () {
                    timer.callAt = clock.now + (parseInt(timer.delay) || (clock.duringTick ? 1 : 0));

                    // it _might_ have been removed, but if not the assignment is perfectly fine
                    clock.timers[timer.id] = timer;

                    return res;
                  },
                  [Symbol.toPrimitive]: function () {
                    return timer.id;
                  },
                };
                return res;
              }

              return timer.id;
            }

            /* eslint consistent-return: "off" */
            /**
             * Timer comparitor
             *
             * @param {Timer} a
             * @param {Timer} b
             * @returns {number}
             */
            function compareTimers(a, b) {
              // Sort first by absolute timing
              if (a.callAt < b.callAt) {
                return -1;
              }
              if (a.callAt > b.callAt) {
                return 1;
              }

              // Sort next by immediate, immediate timers take precedence
              if (a.immediate && !b.immediate) {
                return -1;
              }
              if (!a.immediate && b.immediate) {
                return 1;
              }

              // Sort next by creation time, earlier-created timers take precedence
              if (a.createdAt < b.createdAt) {
                return -1;
              }
              if (a.createdAt > b.createdAt) {
                return 1;
              }

              // Sort next by id, lower-id timers take precedence
              if (a.id < b.id) {
                return -1;
              }
              if (a.id > b.id) {
                return 1;
              }

              // As timer ids are unique, no fallback `0` is necessary
            }

            /**
             * @param {Clock} clock
             * @param {number} from
             * @param {number} to
             *
             * @returns {Timer}
             */
            function firstTimerInRange(clock, from, to) {
              const timers = clock.timers;
              let timer = null;
              let id, isInRange;

              for (id in timers) {
                if (timers.hasOwnProperty(id)) {
                  isInRange = inRange(from, to, timers[id]);

                  if (isInRange && (!timer || compareTimers(timer, timers[id]) === 1)) {
                    timer = timers[id];
                  }
                }
              }

              return timer;
            }

            /**
             * @param {Clock} clock
             * @returns {Timer}
             */
            function firstTimer(clock) {
              const timers = clock.timers;
              let timer = null;
              let id;

              for (id in timers) {
                if (timers.hasOwnProperty(id)) {
                  if (!timer || compareTimers(timer, timers[id]) === 1) {
                    timer = timers[id];
                  }
                }
              }

              return timer;
            }

            /**
             * @param {Clock} clock
             * @returns {Timer}
             */
            function lastTimer(clock) {
              const timers = clock.timers;
              let timer = null;
              let id;

              for (id in timers) {
                if (timers.hasOwnProperty(id)) {
                  if (!timer || compareTimers(timer, timers[id]) === -1) {
                    timer = timers[id];
                  }
                }
              }

              return timer;
            }

            /**
             * @param {Clock} clock
             * @param {Timer} timer
             */
            function callTimer(clock, timer) {
              if (typeof timer.interval === "number") {
                clock.timers[timer.id].callAt += timer.interval;
              } else {
                delete clock.timers[timer.id];
              }

              if (typeof timer.func === "function") {
                timer.func.apply(null, timer.args);
              } else {
                /* eslint no-eval: "off" */
                const eval2 = eval;
                (function () {
                  eval2(timer.func);
                })();
              }
            }

            /**
             * Gets clear handler name for a given timer type
             *
             * @param {string} ttype
             */
            function getClearHandler(ttype) {
              if (ttype === "IdleCallback" || ttype === "AnimationFrame") {
                return `cancel${ttype}`;
              }
              return `clear${ttype}`;
            }

            /**
             * Gets schedule handler name for a given timer type
             *
             * @param {string} ttype
             */
            function getScheduleHandler(ttype) {
              if (ttype === "IdleCallback" || ttype === "AnimationFrame") {
                return `request${ttype}`;
              }
              return `set${ttype}`;
            }

            /**
             * Creates an anonymous function to warn only once
             */
            function createWarnOnce() {
              let calls = 0;
              return function (msg) {
                // eslint-disable-next-line
                !calls++ && console.warn(msg);
              };
            }
            const warnOnce = createWarnOnce();

            /**
             * @param {Clock} clock
             * @param {number} timerId
             * @param {string} ttype
             */
            function clearTimer(clock, timerId, ttype) {
              if (!timerId) {
                // null appears to be allowed in most browsers, and appears to be
                // relied upon by some libraries, like Bootstrap carousel
                return;
              }

              if (!clock.timers) {
                clock.timers = {};
              }

              // in Node, the ID is stored as the primitive value for `Timeout` objects
              // for `Immediate` objects, no ID exists, so it gets coerced to NaN
              const id = Number(timerId);

              if (Number.isNaN(id) || id < idCounterStart) {
                const handlerName = getClearHandler(ttype);

                if (clock.shouldClearNativeTimers === true) {
                  const nativeHandler = clock[`_${handlerName}`];
                  return typeof nativeHandler === "function" ? nativeHandler(timerId) : undefined;
                }
                warnOnce(
                  `FakeTimers: ${handlerName} was invoked to clear a native timer instead of one created by this library.` +
                    "\nTo automatically clean-up native timers, use `shouldClearNativeTimers`.",
                );
              }

              if (clock.timers.hasOwnProperty(id)) {
                // check that the ID matches a timer of the correct type
                const timer = clock.timers[id];
                if (
                  timer.type === ttype ||
                  (timer.type === "Timeout" && ttype === "Interval") ||
                  (timer.type === "Interval" && ttype === "Timeout")
                ) {
                  delete clock.timers[id];
                } else {
                  const clear = getClearHandler(ttype);
                  const schedule = getScheduleHandler(timer.type);
                  throw new Error(`Cannot clear timer: timer created with ${schedule}() but cleared with ${clear}()`);
                }
              }
            }

            /**
             * @param {Clock} clock
             * @param {Config} config
             * @returns {Timer[]}
             */
            function uninstall(clock, config) {
              let method, i, l;
              const installedHrTime = "_hrtime";
              const installedNextTick = "_nextTick";

              for (i = 0, l = clock.methods.length; i < l; i++) {
                method = clock.methods[i];
                if (method === "hrtime" && _global.process) {
                  _global.process.hrtime = clock[installedHrTime];
                } else if (method === "nextTick" && _global.process) {
                  _global.process.nextTick = clock[installedNextTick];
                } else if (method === "performance") {
                  const originalPerfDescriptor = Object.getOwnPropertyDescriptor(clock, `_${method}`);
                  if (originalPerfDescriptor && originalPerfDescriptor.get && !originalPerfDescriptor.set) {
                    Object.defineProperty(_global, method, originalPerfDescriptor);
                  } else if (originalPerfDescriptor.configurable) {
                    _global[method] = clock[`_${method}`];
                  }
                } else {
                  if (_global[method] && _global[method].hadOwnProperty) {
                    _global[method] = clock[`_${method}`];
                  } else {
                    try {
                      delete _global[method];
                    } catch (ignore) {
                      /* eslint no-empty: "off" */
                    }
                  }
                }
              }

              if (config.shouldAdvanceTime === true) {
                _global.clearInterval(clock.attachedInterval);
              }

              // Prevent multiple executions which will completely remove these props
              clock.methods = [];

              // return pending timers, to enable checking what timers remained on uninstall
              if (!clock.timers) {
                return [];
              }
              return Object.keys(clock.timers).map(function mapper(key) {
                return clock.timers[key];
              });
            }

            /**
             * @param {object} target the target containing the method to replace
             * @param {string} method the keyname of the method on the target
             * @param {Clock} clock
             */
            function hijackMethod(target, method, clock) {
              clock[method].hadOwnProperty = Object.prototype.hasOwnProperty.call(target, method);
              clock[`_${method}`] = target[method];

              if (method === "Date") {
                const date = mirrorDateProperties(clock[method], target[method]);
                target[method] = date;
              } else if (method === "performance") {
                const originalPerfDescriptor = Object.getOwnPropertyDescriptor(target, method);
                // JSDOM has a read only performance field so we have to save/copy it differently
                if (originalPerfDescriptor && originalPerfDescriptor.get && !originalPerfDescriptor.set) {
                  Object.defineProperty(clock, `_${method}`, originalPerfDescriptor);

                  const perfDescriptor = Object.getOwnPropertyDescriptor(clock, method);
                  Object.defineProperty(target, method, perfDescriptor);
                } else {
                  target[method] = clock[method];
                }
              } else {
                target[method] = function () {
                  return clock[method].apply(clock, arguments);
                };

                Object.defineProperties(target[method], Object.getOwnPropertyDescriptors(clock[method]));
              }

              target[method].clock = clock;
            }

            /**
             * @param {Clock} clock
             * @param {number} advanceTimeDelta
             */
            function doIntervalTick(clock, advanceTimeDelta) {
              clock.tick(advanceTimeDelta);
            }

            /**
             * @typedef {object} Timers
             * @property {setTimeout} setTimeout
             * @property {clearTimeout} clearTimeout
             * @property {setInterval} setInterval
             * @property {clearInterval} clearInterval
             * @property {Date} Date
             * @property {SetImmediate=} setImmediate
             * @property {function(NodeImmediate): void=} clearImmediate
             * @property {function(number[]):number[]=} hrtime
             * @property {NextTick=} nextTick
             * @property {Performance=} performance
             * @property {RequestAnimationFrame=} requestAnimationFrame
             * @property {boolean=} queueMicrotask
             * @property {function(number): void=} cancelAnimationFrame
             * @property {RequestIdleCallback=} requestIdleCallback
             * @property {function(number): void=} cancelIdleCallback
             */

            /** @type {Timers} */
            const timers = {
              setTimeout: _global.setTimeout,
              clearTimeout: _global.clearTimeout,
              setInterval: _global.setInterval,
              clearInterval: _global.clearInterval,
              Date: _global.Date,
            };

            if (setImmediatePresent) {
              timers.setImmediate = _global.setImmediate;
              timers.clearImmediate = _global.clearImmediate;
            }

            if (hrtimePresent) {
              timers.hrtime = _global.process.hrtime;
            }

            if (nextTickPresent) {
              timers.nextTick = _global.process.nextTick;
            }

            if (performancePresent) {
              timers.performance = _global.performance;
            }

            if (requestAnimationFramePresent) {
              timers.requestAnimationFrame = _global.requestAnimationFrame;
            }

            if (queueMicrotaskPresent) {
              timers.queueMicrotask = true;
            }

            if (cancelAnimationFramePresent) {
              timers.cancelAnimationFrame = _global.cancelAnimationFrame;
            }

            if (requestIdleCallbackPresent) {
              timers.requestIdleCallback = _global.requestIdleCallback;
            }

            if (cancelIdleCallbackPresent) {
              timers.cancelIdleCallback = _global.cancelIdleCallback;
            }

            const originalSetTimeout = _global.setImmediate || _global.setTimeout;

            /**
             * @param {Date|number} [start] the system time - non-integer values are floored
             * @param {number} [loopLimit] maximum number of timers that will be run when calling runAll()
             * @returns {Clock}
             */
            function createClock(start, loopLimit) {
              // eslint-disable-next-line no-param-reassign
              start = Math.floor(getEpoch(start));
              // eslint-disable-next-line no-param-reassign
              loopLimit = loopLimit || 1000;
              let nanos = 0;
              const adjustedSystemTime = [0, 0]; // [millis, nanoremainder]

              if (NativeDate === undefined) {
                throw new Error(
                  "The global scope doesn't have a `Date` object" +
                    " (see https://github.com/sinonjs/sinon/issues/1852#issuecomment-419622780)",
                );
              }

              const clock = {
                now: start,
                Date: createDate(),
                loopLimit: loopLimit,
              };

              clock.Date.clock = clock;

              //eslint-disable-next-line jsdoc/require-jsdoc
              function getTimeToNextFrame() {
                return 16 - ((clock.now - start) % 16);
              }

              //eslint-disable-next-line jsdoc/require-jsdoc
              function hrtime(prev) {
                const millisSinceStart = clock.now - adjustedSystemTime[0] - start;
                const secsSinceStart = Math.floor(millisSinceStart / 1000);
                const remainderInNanos =
                  (millisSinceStart - secsSinceStart * 1e3) * 1e6 + nanos - adjustedSystemTime[1];

                if (Array.isArray(prev)) {
                  if (prev[1] > 1e9) {
                    throw new TypeError("Number of nanoseconds can't exceed a billion");
                  }

                  const oldSecs = prev[0];
                  let nanoDiff = remainderInNanos - prev[1];
                  let secDiff = secsSinceStart - oldSecs;

                  if (nanoDiff < 0) {
                    nanoDiff += 1e9;
                    secDiff -= 1;
                  }

                  return [secDiff, nanoDiff];
                }
                return [secsSinceStart, remainderInNanos];
              }

              if (hrtimeBigintPresent) {
                hrtime.bigint = function () {
                  const parts = hrtime();
                  return BigInt(parts[0]) * BigInt(1e9) + BigInt(parts[1]); // eslint-disable-line
                };
              }

              clock.requestIdleCallback = function requestIdleCallback(func, timeout) {
                let timeToNextIdlePeriod = 0;

                if (clock.countTimers() > 0) {
                  timeToNextIdlePeriod = 50; // const for now
                }

                const result = addTimer(clock, {
                  func: func,
                  args: Array.prototype.slice.call(arguments, 2),
                  delay:
                    typeof timeout === "undefined" ? timeToNextIdlePeriod : Math.min(timeout, timeToNextIdlePeriod),
                  idleCallback: true,
                });

                return Number(result);
              };

              clock.cancelIdleCallback = function cancelIdleCallback(timerId) {
                return clearTimer(clock, timerId, "IdleCallback");
              };

              clock.setTimeout = function setTimeout(func, timeout) {
                return addTimer(clock, {
                  func: func,
                  args: Array.prototype.slice.call(arguments, 2),
                  delay: timeout,
                });
              };
              if (typeof _global.Promise !== "undefined" && utilPromisify) {
                clock.setTimeout[utilPromisify.custom] = function promisifiedSetTimeout(timeout, arg) {
                  return new _global.Promise(function setTimeoutExecutor(resolve) {
                    addTimer(clock, {
                      func: resolve,
                      args: [arg],
                      delay: timeout,
                    });
                  });
                };
              }

              clock.clearTimeout = function clearTimeout(timerId) {
                return clearTimer(clock, timerId, "Timeout");
              };

              clock.nextTick = function nextTick(func) {
                return enqueueJob(clock, {
                  func: func,
                  args: Array.prototype.slice.call(arguments, 1),
                  error: isNearInfiniteLimit ? new Error() : null,
                });
              };

              clock.queueMicrotask = function queueMicrotask(func) {
                return clock.nextTick(func); // explicitly drop additional arguments
              };

              clock.setInterval = function setInterval(func, timeout) {
                // eslint-disable-next-line no-param-reassign
                timeout = parseInt(timeout, 10);
                return addTimer(clock, {
                  func: func,
                  args: Array.prototype.slice.call(arguments, 2),
                  delay: timeout,
                  interval: timeout,
                });
              };

              clock.clearInterval = function clearInterval(timerId) {
                return clearTimer(clock, timerId, "Interval");
              };

              if (setImmediatePresent) {
                clock.setImmediate = function setImmediate(func) {
                  return addTimer(clock, {
                    func: func,
                    args: Array.prototype.slice.call(arguments, 1),
                    immediate: true,
                  });
                };

                if (typeof _global.Promise !== "undefined" && utilPromisify) {
                  clock.setImmediate[utilPromisify.custom] = function promisifiedSetImmediate(arg) {
                    return new _global.Promise(function setImmediateExecutor(resolve) {
                      addTimer(clock, {
                        func: resolve,
                        args: [arg],
                        immediate: true,
                      });
                    });
                  };
                }

                clock.clearImmediate = function clearImmediate(timerId) {
                  return clearTimer(clock, timerId, "Immediate");
                };
              }

              clock.countTimers = function countTimers() {
                return Object.keys(clock.timers || {}).length + (clock.jobs || []).length;
              };

              clock.requestAnimationFrame = function requestAnimationFrame(func) {
                const result = addTimer(clock, {
                  func: func,
                  delay: getTimeToNextFrame(),
                  args: [clock.now + getTimeToNextFrame()],
                  animation: true,
                });

                return Number(result);
              };

              clock.cancelAnimationFrame = function cancelAnimationFrame(timerId) {
                return clearTimer(clock, timerId, "AnimationFrame");
              };

              clock.runMicrotasks = function runMicrotasks() {
                runJobs(clock);
              };

              /**
               * @param {number|string} tickValue milliseconds or a string parseable by parseTime
               * @param {boolean} isAsync
               * @param {Function} resolve
               * @param {Function} reject
               * @returns {number|undefined} will return the new `now` value or nothing for async
               */
              function doTick(tickValue, isAsync, resolve, reject) {
                const msFloat = typeof tickValue === "number" ? tickValue : parseTime(tickValue);
                const ms = Math.floor(msFloat);
                const remainder = nanoRemainder(msFloat);
                let nanosTotal = nanos + remainder;
                let tickTo = clock.now + ms;

                if (msFloat < 0) {
                  throw new TypeError("Negative ticks are not supported");
                }

                // adjust for positive overflow
                if (nanosTotal >= 1e6) {
                  tickTo += 1;
                  nanosTotal -= 1e6;
                }

                nanos = nanosTotal;
                let tickFrom = clock.now;
                let previous = clock.now;
                // ESLint fails to detect this correctly
                /* eslint-disable prefer-const */
                let timer, firstException, oldNow, nextPromiseTick, compensationCheck, postTimerCall;
                /* eslint-enable prefer-const */

                clock.duringTick = true;

                // perform microtasks
                oldNow = clock.now;
                runJobs(clock);
                if (oldNow !== clock.now) {
                  // compensate for any setSystemTime() call during microtask callback
                  tickFrom += clock.now - oldNow;
                  tickTo += clock.now - oldNow;
                }

                //eslint-disable-next-line jsdoc/require-jsdoc
                function doTickInner() {
                  // perform each timer in the requested range
                  timer = firstTimerInRange(clock, tickFrom, tickTo);
                  // eslint-disable-next-line no-unmodified-loop-condition
                  while (timer && tickFrom <= tickTo) {
                    if (clock.timers[timer.id]) {
                      tickFrom = timer.callAt;
                      clock.now = timer.callAt;
                      oldNow = clock.now;
                      try {
                        runJobs(clock);
                        callTimer(clock, timer);
                      } catch (e) {
                        firstException = firstException || e;
                      }

                      if (isAsync) {
                        // finish up after native setImmediate callback to allow
                        // all native es6 promises to process their callbacks after
                        // each timer fires.
                        originalSetTimeout(nextPromiseTick);
                        return;
                      }

                      compensationCheck();
                    }

                    postTimerCall();
                  }

                  // perform process.nextTick()s again
                  oldNow = clock.now;
                  runJobs(clock);
                  if (oldNow !== clock.now) {
                    // compensate for any setSystemTime() call during process.nextTick() callback
                    tickFrom += clock.now - oldNow;
                    tickTo += clock.now - oldNow;
                  }
                  clock.duringTick = false;

                  // corner case: during runJobs new timers were scheduled which could be in the range [clock.now, tickTo]
                  timer = firstTimerInRange(clock, tickFrom, tickTo);
                  if (timer) {
                    try {
                      clock.tick(tickTo - clock.now); // do it all again - for the remainder of the requested range
                    } catch (e) {
                      firstException = firstException || e;
                    }
                  } else {
                    // no timers remaining in the requested range: move the clock all the way to the end
                    clock.now = tickTo;

                    // update nanos
                    nanos = nanosTotal;
                  }
                  if (firstException) {
                    throw firstException;
                  }

                  if (isAsync) {
                    resolve(clock.now);
                  } else {
                    return clock.now;
                  }
                }

                nextPromiseTick =
                  isAsync &&
                  function () {
                    try {
                      compensationCheck();
                      postTimerCall();
                      doTickInner();
                    } catch (e) {
                      reject(e);
                    }
                  };

                compensationCheck = function () {
                  // compensate for any setSystemTime() call during timer callback
                  if (oldNow !== clock.now) {
                    tickFrom += clock.now - oldNow;
                    tickTo += clock.now - oldNow;
                    previous += clock.now - oldNow;
                  }
                };

                postTimerCall = function () {
                  timer = firstTimerInRange(clock, previous, tickTo);
                  previous = tickFrom;
                };

                return doTickInner();
              }

              /**
               * @param {string|number} tickValue number of milliseconds or a human-readable value like "01:11:15"
               * @returns {number} will return the new `now` value
               */
              clock.tick = function tick(tickValue) {
                return doTick(tickValue, false);
              };

              if (typeof _global.Promise !== "undefined") {
                /**
                 * @param {string|number} tickValue number of milliseconds or a human-readable value like "01:11:15"
                 * @returns {Promise}
                 */
                clock.tickAsync = function tickAsync(tickValue) {
                  return new _global.Promise(function (resolve, reject) {
                    originalSetTimeout(function () {
                      try {
                        doTick(tickValue, true, resolve, reject);
                      } catch (e) {
                        reject(e);
                      }
                    });
                  });
                };
              }

              clock.next = function next() {
                runJobs(clock);
                const timer = firstTimer(clock);
                if (!timer) {
                  return clock.now;
                }

                clock.duringTick = true;
                try {
                  clock.now = timer.callAt;
                  callTimer(clock, timer);
                  runJobs(clock);
                  return clock.now;
                } finally {
                  clock.duringTick = false;
                }
              };

              if (typeof _global.Promise !== "undefined") {
                clock.nextAsync = function nextAsync() {
                  return new _global.Promise(function (resolve, reject) {
                    originalSetTimeout(function () {
                      try {
                        const timer = firstTimer(clock);
                        if (!timer) {
                          resolve(clock.now);
                          return;
                        }

                        let err;
                        clock.duringTick = true;
                        clock.now = timer.callAt;
                        try {
                          callTimer(clock, timer);
                        } catch (e) {
                          err = e;
                        }
                        clock.duringTick = false;

                        originalSetTimeout(function () {
                          if (err) {
                            reject(err);
                          } else {
                            resolve(clock.now);
                          }
                        });
                      } catch (e) {
                        reject(e);
                      }
                    });
                  });
                };
              }

              clock.runAll = function runAll() {
                let numTimers, i;
                runJobs(clock);
                for (i = 0; i < clock.loopLimit; i++) {
                  if (!clock.timers) {
                    resetIsNearInfiniteLimit();
                    return clock.now;
                  }

                  numTimers = Object.keys(clock.timers).length;
                  if (numTimers === 0) {
                    resetIsNearInfiniteLimit();
                    return clock.now;
                  }

                  clock.next();
                  checkIsNearInfiniteLimit(clock, i);
                }

                const excessJob = firstTimer(clock);
                throw getInfiniteLoopError(clock, excessJob);
              };

              clock.runToFrame = function runToFrame() {
                return clock.tick(getTimeToNextFrame());
              };

              if (typeof _global.Promise !== "undefined") {
                clock.runAllAsync = function runAllAsync() {
                  return new _global.Promise(function (resolve, reject) {
                    let i = 0;
                    /**
                     *
                     */
                    function doRun() {
                      originalSetTimeout(function () {
                        try {
                          let numTimers;
                          if (i < clock.loopLimit) {
                            if (!clock.timers) {
                              resetIsNearInfiniteLimit();
                              resolve(clock.now);
                              return;
                            }

                            numTimers = Object.keys(clock.timers).length;
                            if (numTimers === 0) {
                              resetIsNearInfiniteLimit();
                              resolve(clock.now);
                              return;
                            }

                            clock.next();

                            i++;

                            doRun();
                            checkIsNearInfiniteLimit(clock, i);
                            return;
                          }

                          const excessJob = firstTimer(clock);
                          reject(getInfiniteLoopError(clock, excessJob));
                        } catch (e) {
                          reject(e);
                        }
                      });
                    }
                    doRun();
                  });
                };
              }

              clock.runToLast = function runToLast() {
                const timer = lastTimer(clock);
                if (!timer) {
                  runJobs(clock);
                  return clock.now;
                }

                return clock.tick(timer.callAt - clock.now);
              };

              if (typeof _global.Promise !== "undefined") {
                clock.runToLastAsync = function runToLastAsync() {
                  return new _global.Promise(function (resolve, reject) {
                    originalSetTimeout(function () {
                      try {
                        const timer = lastTimer(clock);
                        if (!timer) {
                          resolve(clock.now);
                        }

                        resolve(clock.tickAsync(timer.callAt));
                      } catch (e) {
                        reject(e);
                      }
                    });
                  });
                };
              }

              clock.reset = function reset() {
                nanos = 0;
                clock.timers = {};
                clock.jobs = [];
                clock.now = start;
              };

              clock.setSystemTime = function setSystemTime(systemTime) {
                // determine time difference
                const newNow = getEpoch(systemTime);
                const difference = newNow - clock.now;
                let id, timer;

                adjustedSystemTime[0] = adjustedSystemTime[0] + difference;
                adjustedSystemTime[1] = adjustedSystemTime[1] + nanos;
                // update 'system clock'
                clock.now = newNow;
                nanos = 0;

                // update timers and intervals to keep them stable
                for (id in clock.timers) {
                  if (clock.timers.hasOwnProperty(id)) {
                    timer = clock.timers[id];
                    timer.createdAt += difference;
                    timer.callAt += difference;
                  }
                }
              };

              if (performancePresent) {
                clock.performance = Object.create(null);
                clock.performance.now = function FakeTimersNow() {
                  const hrt = hrtime();
                  const millis = hrt[0] * 1000 + hrt[1] / 1e6;
                  return millis;
                };
              }

              if (hrtimePresent) {
                clock.hrtime = hrtime;
              }

              return clock;
            }

            /* eslint-disable complexity */

            /**
             * @param {Config=} [config] Optional config
             * @returns {Clock}
             */
            function install(config) {
              if (
                arguments.length > 1 ||
                config instanceof Date ||
                Array.isArray(config) ||
                typeof config === "number"
              ) {
                throw new TypeError(
                  `FakeTimers.install called with ${String(config)} install requires an object parameter`,
                );
              }

              // eslint-disable-next-line no-param-reassign
              config = typeof config !== "undefined" ? config : {};
              config.shouldAdvanceTime = config.shouldAdvanceTime || false;
              config.advanceTimeDelta = config.advanceTimeDelta || 20;
              config.shouldClearNativeTimers = config.shouldClearNativeTimers || false;

              if (config.target) {
                throw new TypeError("config.target is no longer supported. Use `withGlobal(target)` instead.");
              }

              let i, l;
              const clock = createClock(config.now, config.loopLimit);
              clock.shouldClearNativeTimers = config.shouldClearNativeTimers;

              clock.uninstall = function () {
                return uninstall(clock, config);
              };

              clock.methods = config.toFake || [];

              if (clock.methods.length === 0) {
                // do not fake nextTick by default - GitHub#126
                clock.methods = Object.keys(timers).filter(function (key) {
                  return key !== "nextTick" && key !== "queueMicrotask";
                });
              }

              if (config.shouldAdvanceTime === true) {
                const intervalTick = doIntervalTick.bind(null, clock, config.advanceTimeDelta);
                const intervalId = _global.setInterval(intervalTick, config.advanceTimeDelta);
                clock.attachedInterval = intervalId;
              }

              if (clock.methods.includes("performance")) {
                const proto = (() => {
                  if (hasPerformancePrototype) {
                    return _global.Performance.prototype;
                  }
                  if (hasPerformanceConstructorPrototype) {
                    return _global.performance.constructor.prototype;
                  }
                })();
                if (proto) {
                  Object.getOwnPropertyNames(proto).forEach(function (name) {
                    if (name !== "now") {
                      clock.performance[name] = name.indexOf("getEntries") === 0 ? NOOP_ARRAY : NOOP;
                    }
                  });
                } else if ((config.toFake || []).includes("performance")) {
                  // user explicitly tried to fake performance when not present
                  throw new ReferenceError("non-existent performance object cannot be faked");
                }
              }

              for (i = 0, l = clock.methods.length; i < l; i++) {
                const nameOfMethodToReplace = clock.methods[i];
                if (nameOfMethodToReplace === "hrtime") {
                  if (_global.process && typeof _global.process.hrtime === "function") {
                    hijackMethod(_global.process, nameOfMethodToReplace, clock);
                  }
                } else if (nameOfMethodToReplace === "nextTick") {
                  if (_global.process && typeof _global.process.nextTick === "function") {
                    hijackMethod(_global.process, nameOfMethodToReplace, clock);
                  }
                } else {
                  hijackMethod(_global, nameOfMethodToReplace, clock);
                }
              }

              return clock;
            }

            /* eslint-enable complexity */

            return {
              timers: timers,
              createClock: createClock,
              install: install,
              withGlobal: withGlobal,
            };
          }

          /**
           * @typedef {object} FakeTimers
           * @property {Timers} timers
           * @property {createClock} createClock
           * @property {Function} install
           * @property {withGlobal} withGlobal
           */

          /* eslint-enable complexity */

          /** @type {FakeTimers} */
          const defaultImplementation = withGlobal(globalObject);

          exports.timers = defaultImplementation.timers;
          exports.createClock = defaultImplementation.createClock;
          exports.install = defaultImplementation.install;
          exports.withGlobal = withGlobal;
        },
        { "@sinonjs/commons": 7, util: 23 },
      ],
      20: [
        function (require, module, exports) {
          (function (global) {
            (function () {
              "use strict";

              var possibleNames = [
                "BigInt64Array",
                "BigUint64Array",
                "Float32Array",
                "Float64Array",
                "Int16Array",
                "Int32Array",
                "Int8Array",
                "Uint16Array",
                "Uint32Array",
                "Uint8Array",
                "Uint8ClampedArray",
              ];

              var g = typeof globalThis === "undefined" ? global : globalThis;

              module.exports = function availableTypedArrays() {
                var out = [];
                for (var i = 0; i < possibleNames.length; i++) {
                  if (typeof g[possibleNames[i]] === "function") {
                    out[out.length] = possibleNames[i];
                  }
                }
                return out;
              };
            }).call(this);
          }).call(
            this,
            typeof global !== "undefined"
              ? global
              : typeof self !== "undefined"
              ? self
              : typeof window !== "undefined"
              ? window
              : {},
          );
        },
        {},
      ],
      21: [
        function (require, module, exports) {
          module.exports = function isBuffer(arg) {
            return (
              arg &&
              typeof arg === "object" &&
              typeof arg.copy === "function" &&
              typeof arg.fill === "function" &&
              typeof arg.readUInt8 === "function"
            );
          };
        },
        {},
      ],
      22: [
        function (require, module, exports) {
          // Currently in sync with Node.js lib/internal/util/types.js
          // https://github.com/nodejs/node/commit/112cc7c27551254aa2b17098fb774867f05ed0d9

          "use strict";

          var isArgumentsObject = require("is-arguments");
          var isGeneratorFunction = require("is-generator-function");
          var whichTypedArray = require("which-typed-array");
          var isTypedArray = require("is-typed-array");

          function uncurryThis(f) {
            return f.call.bind(f);
          }

          var BigIntSupported = typeof BigInt !== "undefined";
          var SymbolSupported = typeof Symbol !== "undefined";

          var ObjectToString = uncurryThis(Object.prototype.toString);

          var numberValue = uncurryThis(Number.prototype.valueOf);
          var stringValue = uncurryThis(String.prototype.valueOf);
          var booleanValue = uncurryThis(Boolean.prototype.valueOf);

          if (BigIntSupported) {
            var bigIntValue = uncurryThis(BigInt.prototype.valueOf);
          }

          if (SymbolSupported) {
            var symbolValue = uncurryThis(Symbol.prototype.valueOf);
          }

          function checkBoxedPrimitive(value, prototypeValueOf) {
            if (typeof value !== "object") {
              return false;
            }
            try {
              prototypeValueOf(value);
              return true;
            } catch (e) {
              return false;
            }
          }

          exports.isArgumentsObject = isArgumentsObject;
          exports.isGeneratorFunction = isGeneratorFunction;
          exports.isTypedArray = isTypedArray;

          // Taken from here and modified for better browser support
          // https://github.com/sindresorhus/p-is-promise/blob/cda35a513bda03f977ad5cde3a079d237e82d7ef/index.js
          function isPromise(input) {
            return (
              (typeof Promise !== "undefined" && input instanceof Promise) ||
              (input !== null &&
                typeof input === "object" &&
                typeof input.then === "function" &&
                typeof input.catch === "function")
            );
          }
          exports.isPromise = isPromise;

          function isArrayBufferView(value) {
            if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
              return ArrayBuffer.isView(value);
            }

            return isTypedArray(value) || isDataView(value);
          }
          exports.isArrayBufferView = isArrayBufferView;

          function isUint8Array(value) {
            return whichTypedArray(value) === "Uint8Array";
          }
          exports.isUint8Array = isUint8Array;

          function isUint8ClampedArray(value) {
            return whichTypedArray(value) === "Uint8ClampedArray";
          }
          exports.isUint8ClampedArray = isUint8ClampedArray;

          function isUint16Array(value) {
            return whichTypedArray(value) === "Uint16Array";
          }
          exports.isUint16Array = isUint16Array;

          function isUint32Array(value) {
            return whichTypedArray(value) === "Uint32Array";
          }
          exports.isUint32Array = isUint32Array;

          function isInt8Array(value) {
            return whichTypedArray(value) === "Int8Array";
          }
          exports.isInt8Array = isInt8Array;

          function isInt16Array(value) {
            return whichTypedArray(value) === "Int16Array";
          }
          exports.isInt16Array = isInt16Array;

          function isInt32Array(value) {
            return whichTypedArray(value) === "Int32Array";
          }
          exports.isInt32Array = isInt32Array;

          function isFloat32Array(value) {
            return whichTypedArray(value) === "Float32Array";
          }
          exports.isFloat32Array = isFloat32Array;

          function isFloat64Array(value) {
            return whichTypedArray(value) === "Float64Array";
          }
          exports.isFloat64Array = isFloat64Array;

          function isBigInt64Array(value) {
            return whichTypedArray(value) === "BigInt64Array";
          }
          exports.isBigInt64Array = isBigInt64Array;

          function isBigUint64Array(value) {
            return whichTypedArray(value) === "BigUint64Array";
          }
          exports.isBigUint64Array = isBigUint64Array;

          function isMapToString(value) {
            return ObjectToString(value) === "[object Map]";
          }
          isMapToString.working = typeof Map !== "undefined" && isMapToString(new Map());

          function isMap(value) {
            if (typeof Map === "undefined") {
              return false;
            }

            return isMapToString.working ? isMapToString(value) : value instanceof Map;
          }
          exports.isMap = isMap;

          function isSetToString(value) {
            return ObjectToString(value) === "[object Set]";
          }
          isSetToString.working = typeof Set !== "undefined" && isSetToString(new Set());
          function isSet(value) {
            if (typeof Set === "undefined") {
              return false;
            }

            return isSetToString.working ? isSetToString(value) : value instanceof Set;
          }
          exports.isSet = isSet;

          function isWeakMapToString(value) {
            return ObjectToString(value) === "[object WeakMap]";
          }
          isWeakMapToString.working = typeof WeakMap !== "undefined" && isWeakMapToString(new WeakMap());
          function isWeakMap(value) {
            if (typeof WeakMap === "undefined") {
              return false;
            }

            return isWeakMapToString.working ? isWeakMapToString(value) : value instanceof WeakMap;
          }
          exports.isWeakMap = isWeakMap;

          function isWeakSetToString(value) {
            return ObjectToString(value) === "[object WeakSet]";
          }
          isWeakSetToString.working = typeof WeakSet !== "undefined" && isWeakSetToString(new WeakSet());
          function isWeakSet(value) {
            return isWeakSetToString(value);
          }
          exports.isWeakSet = isWeakSet;

          function isArrayBufferToString(value) {
            return ObjectToString(value) === "[object ArrayBuffer]";
          }
          isArrayBufferToString.working =
            typeof ArrayBuffer !== "undefined" && isArrayBufferToString(new ArrayBuffer());
          function isArrayBuffer(value) {
            if (typeof ArrayBuffer === "undefined") {
              return false;
            }

            return isArrayBufferToString.working ? isArrayBufferToString(value) : value instanceof ArrayBuffer;
          }
          exports.isArrayBuffer = isArrayBuffer;

          function isDataViewToString(value) {
            return ObjectToString(value) === "[object DataView]";
          }
          isDataViewToString.working =
            typeof ArrayBuffer !== "undefined" &&
            typeof DataView !== "undefined" &&
            isDataViewToString(new DataView(new ArrayBuffer(1), 0, 1));
          function isDataView(value) {
            if (typeof DataView === "undefined") {
              return false;
            }

            return isDataViewToString.working ? isDataViewToString(value) : value instanceof DataView;
          }
          exports.isDataView = isDataView;

          // Store a copy of SharedArrayBuffer in case it's deleted elsewhere
          var SharedArrayBufferCopy = typeof SharedArrayBuffer !== "undefined" ? SharedArrayBuffer : undefined;
          function isSharedArrayBufferToString(value) {
            return ObjectToString(value) === "[object SharedArrayBuffer]";
          }
          function isSharedArrayBuffer(value) {
            if (typeof SharedArrayBufferCopy === "undefined") {
              return false;
            }

            if (typeof isSharedArrayBufferToString.working === "undefined") {
              isSharedArrayBufferToString.working = isSharedArrayBufferToString(new SharedArrayBufferCopy());
            }

            return isSharedArrayBufferToString.working
              ? isSharedArrayBufferToString(value)
              : value instanceof SharedArrayBufferCopy;
          }
          exports.isSharedArrayBuffer = isSharedArrayBuffer;

          function isAsyncFunction(value) {
            return ObjectToString(value) === "[object AsyncFunction]";
          }
          exports.isAsyncFunction = isAsyncFunction;

          function isMapIterator(value) {
            return ObjectToString(value) === "[object Map Iterator]";
          }
          exports.isMapIterator = isMapIterator;

          function isSetIterator(value) {
            return ObjectToString(value) === "[object Set Iterator]";
          }
          exports.isSetIterator = isSetIterator;

          function isGeneratorObject(value) {
            return ObjectToString(value) === "[object Generator]";
          }
          exports.isGeneratorObject = isGeneratorObject;

          function isWebAssemblyCompiledModule(value) {
            return ObjectToString(value) === "[object WebAssembly.Module]";
          }
          exports.isWebAssemblyCompiledModule = isWebAssemblyCompiledModule;

          function isNumberObject(value) {
            return checkBoxedPrimitive(value, numberValue);
          }
          exports.isNumberObject = isNumberObject;

          function isStringObject(value) {
            return checkBoxedPrimitive(value, stringValue);
          }
          exports.isStringObject = isStringObject;

          function isBooleanObject(value) {
            return checkBoxedPrimitive(value, booleanValue);
          }
          exports.isBooleanObject = isBooleanObject;

          function isBigIntObject(value) {
            return BigIntSupported && checkBoxedPrimitive(value, bigIntValue);
          }
          exports.isBigIntObject = isBigIntObject;

          function isSymbolObject(value) {
            return SymbolSupported && checkBoxedPrimitive(value, symbolValue);
          }
          exports.isSymbolObject = isSymbolObject;

          function isBoxedPrimitive(value) {
            return (
              isNumberObject(value) ||
              isStringObject(value) ||
              isBooleanObject(value) ||
              isBigIntObject(value) ||
              isSymbolObject(value)
            );
          }
          exports.isBoxedPrimitive = isBoxedPrimitive;

          function isAnyArrayBuffer(value) {
            return typeof Uint8Array !== "undefined" && (isArrayBuffer(value) || isSharedArrayBuffer(value));
          }
          exports.isAnyArrayBuffer = isAnyArrayBuffer;

          ["isProxy", "isExternal", "isModuleNamespaceObject"].forEach(function (method) {
            Object.defineProperty(exports, method, {
              enumerable: false,
              value: function () {
                throw new Error(method + " is not supported in userland");
              },
            });
          });
        },
        { "is-arguments": 35, "is-generator-function": 37, "is-typed-array": 38, "which-typed-array": 42 },
      ],
      23: [
        function (require, module, exports) {
          (function (process) {
            (function () {
              // Copyright Joyent, Inc. and other Node contributors.
              //
              // Permission is hereby granted, free of charge, to any person obtaining a
              // copy of this software and associated documentation files (the
              // "Software"), to deal in the Software without restriction, including
              // without limitation the rights to use, copy, modify, merge, publish,
              // distribute, sublicense, and/or sell copies of the Software, and to permit
              // persons to whom the Software is furnished to do so, subject to the
              // following conditions:
              //
              // The above copyright notice and this permission notice shall be included
              // in all copies or substantial portions of the Software.
              //
              // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
              // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
              // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
              // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
              // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
              // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
              // USE OR OTHER DEALINGS IN THE SOFTWARE.

              var getOwnPropertyDescriptors =
                Object.getOwnPropertyDescriptors ||
                function getOwnPropertyDescriptors(obj) {
                  var keys = Object.keys(obj);
                  var descriptors = {};
                  for (var i = 0; i < keys.length; i++) {
                    descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
                  }
                  return descriptors;
                };

              var formatRegExp = /%[sdj%]/g;
              exports.format = function (f) {
                if (!isString(f)) {
                  var objects = [];
                  for (var i = 0; i < arguments.length; i++) {
                    objects.push(inspect(arguments[i]));
                  }
                  return objects.join(" ");
                }

                var i = 1;
                var args = arguments;
                var len = args.length;
                var str = String(f).replace(formatRegExp, function (x) {
                  if (x === "%%") return "%";
                  if (i >= len) return x;
                  switch (x) {
                    case "%s":
                      return String(args[i++]);
                    case "%d":
                      return Number(args[i++]);
                    case "%j":
                      try {
                        return JSON.stringify(args[i++]);
                      } catch (_) {
                        return "[Circular]";
                      }
                    default:
                      return x;
                  }
                });
                for (var x = args[i]; i < len; x = args[++i]) {
                  if (isNull(x) || !isObject(x)) {
                    str += " " + x;
                  } else {
                    str += " " + inspect(x);
                  }
                }
                return str;
              };

              // Mark that a method should not be used.
              // Returns a modified function which warns once by default.
              // If --no-deprecation is set, then it is a no-op.
              exports.deprecate = function (fn, msg) {
                if (typeof process !== "undefined" && process.noDeprecation === true) {
                  return fn;
                }

                // Allow for deprecating things in the process of starting up.
                if (typeof process === "undefined") {
                  return function () {
                    return exports.deprecate(fn, msg).apply(this, arguments);
                  };
                }

                var warned = false;
                function deprecated() {
                  if (!warned) {
                    if (process.throwDeprecation) {
                      throw new Error(msg);
                    } else if (process.traceDeprecation) {
                      console.trace(msg);
                    } else {
                      console.error(msg);
                    }
                    warned = true;
                  }
                  return fn.apply(this, arguments);
                }

                return deprecated;
              };

              var debugs = {};
              var debugEnvRegex = /^$/;

              if (process.env.NODE_DEBUG) {
                var debugEnv = process.env.NODE_DEBUG;
                debugEnv = debugEnv
                  .replace(/[|\\{}()[\]^$+?.]/g, "\\$&")
                  .replace(/\*/g, ".*")
                  .replace(/,/g, "$|^")
                  .toUpperCase();
                debugEnvRegex = new RegExp("^" + debugEnv + "$", "i");
              }
              exports.debuglog = function (set) {
                set = set.toUpperCase();
                if (!debugs[set]) {
                  if (debugEnvRegex.test(set)) {
                    var pid = process.pid;
                    debugs[set] = function () {
                      var msg = exports.format.apply(exports, arguments);
                      console.error("%s %d: %s", set, pid, msg);
                    };
                  } else {
                    debugs[set] = function () {};
                  }
                }
                return debugs[set];
              };

              /**
               * Echos the value of a value. Trys to print the value out
               * in the best way possible given the different types.
               *
               * @param {Object} obj The object to print out.
               * @param {Object} opts Optional options object that alters the output.
               */
              /* legacy: obj, showHidden, depth, colors*/
              function inspect(obj, opts) {
                // default options
                var ctx = {
                  seen: [],
                  stylize: stylizeNoColor,
                };
                // legacy...
                if (arguments.length >= 3) ctx.depth = arguments[2];
                if (arguments.length >= 4) ctx.colors = arguments[3];
                if (isBoolean(opts)) {
                  // legacy...
                  ctx.showHidden = opts;
                } else if (opts) {
                  // got an "options" object
                  exports._extend(ctx, opts);
                }
                // set default options
                if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
                if (isUndefined(ctx.depth)) ctx.depth = 2;
                if (isUndefined(ctx.colors)) ctx.colors = false;
                if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
                if (ctx.colors) ctx.stylize = stylizeWithColor;
                return formatValue(ctx, obj, ctx.depth);
              }
              exports.inspect = inspect;

              // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
              inspect.colors = {
                bold: [1, 22],
                italic: [3, 23],
                underline: [4, 24],
                inverse: [7, 27],
                white: [37, 39],
                grey: [90, 39],
                black: [30, 39],
                blue: [34, 39],
                cyan: [36, 39],
                green: [32, 39],
                magenta: [35, 39],
                red: [31, 39],
                yellow: [33, 39],
              };

              // Don't use 'blue' not visible on cmd.exe
              inspect.styles = {
                special: "cyan",
                number: "yellow",
                boolean: "yellow",
                undefined: "grey",
                null: "bold",
                string: "green",
                date: "magenta",
                // "name": intentionally not styling
                regexp: "red",
              };

              function stylizeWithColor(str, styleType) {
                var style = inspect.styles[styleType];

                if (style) {
                  return "\u001b[" + inspect.colors[style][0] + "m" + str + "\u001b[" + inspect.colors[style][1] + "m";
                } else {
                  return str;
                }
              }

              function stylizeNoColor(str, styleType) {
                return str;
              }

              function arrayToHash(array) {
                var hash = {};

                array.forEach(function (val, idx) {
                  hash[val] = true;
                });

                return hash;
              }

              function formatValue(ctx, value, recurseTimes) {
                // Provide a hook for user-specified inspect functions.
                // Check that value is an object with an inspect function on it
                if (
                  ctx.customInspect &&
                  value &&
                  isFunction(value.inspect) &&
                  // Filter out the util module, it's inspect function is special
                  value.inspect !== exports.inspect &&
                  // Also filter out any prototype objects using the circular check.
                  !(value.constructor && value.constructor.prototype === value)
                ) {
                  var ret = value.inspect(recurseTimes, ctx);
                  if (!isString(ret)) {
                    ret = formatValue(ctx, ret, recurseTimes);
                  }
                  return ret;
                }

                // Primitive types cannot have properties
                var primitive = formatPrimitive(ctx, value);
                if (primitive) {
                  return primitive;
                }

                // Look up the keys of the object.
                var keys = Object.keys(value);
                var visibleKeys = arrayToHash(keys);

                if (ctx.showHidden) {
                  keys = Object.getOwnPropertyNames(value);
                }

                // IE doesn't make error fields non-enumerable
                // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
                if (isError(value) && (keys.indexOf("message") >= 0 || keys.indexOf("description") >= 0)) {
                  return formatError(value);
                }

                // Some type of object without properties can be shortcutted.
                if (keys.length === 0) {
                  if (isFunction(value)) {
                    var name = value.name ? ": " + value.name : "";
                    return ctx.stylize("[Function" + name + "]", "special");
                  }
                  if (isRegExp(value)) {
                    return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
                  }
                  if (isDate(value)) {
                    return ctx.stylize(Date.prototype.toString.call(value), "date");
                  }
                  if (isError(value)) {
                    return formatError(value);
                  }
                }

                var base = "",
                  array = false,
                  braces = ["{", "}"];

                // Make Array say that they are Array
                if (isArray(value)) {
                  array = true;
                  braces = ["[", "]"];
                }

                // Make functions say that they are functions
                if (isFunction(value)) {
                  var n = value.name ? ": " + value.name : "";
                  base = " [Function" + n + "]";
                }

                // Make RegExps say that they are RegExps
                if (isRegExp(value)) {
                  base = " " + RegExp.prototype.toString.call(value);
                }

                // Make dates with properties first say the date
                if (isDate(value)) {
                  base = " " + Date.prototype.toUTCString.call(value);
                }

                // Make error with message first say the error
                if (isError(value)) {
                  base = " " + formatError(value);
                }

                if (keys.length === 0 && (!array || value.length == 0)) {
                  return braces[0] + base + braces[1];
                }

                if (recurseTimes < 0) {
                  if (isRegExp(value)) {
                    return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
                  } else {
                    return ctx.stylize("[Object]", "special");
                  }
                }

                ctx.seen.push(value);

                var output;
                if (array) {
                  output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
                } else {
                  output = keys.map(function (key) {
                    return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
                  });
                }

                ctx.seen.pop();

                return reduceToSingleString(output, base, braces);
              }

              function formatPrimitive(ctx, value) {
                if (isUndefined(value)) return ctx.stylize("undefined", "undefined");
                if (isString(value)) {
                  var simple =
                    "'" + JSON.stringify(value).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
                  return ctx.stylize(simple, "string");
                }
                if (isNumber(value)) return ctx.stylize("" + value, "number");
                if (isBoolean(value)) return ctx.stylize("" + value, "boolean");
                // For some reason typeof null is "object", so special case here.
                if (isNull(value)) return ctx.stylize("null", "null");
              }

              function formatError(value) {
                return "[" + Error.prototype.toString.call(value) + "]";
              }

              function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
                var output = [];
                for (var i = 0, l = value.length; i < l; ++i) {
                  if (hasOwnProperty(value, String(i))) {
                    output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
                  } else {
                    output.push("");
                  }
                }
                keys.forEach(function (key) {
                  if (!key.match(/^\d+$/)) {
                    output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
                  }
                });
                return output;
              }

              function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
                var name, str, desc;
                desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
                if (desc.get) {
                  if (desc.set) {
                    str = ctx.stylize("[Getter/Setter]", "special");
                  } else {
                    str = ctx.stylize("[Getter]", "special");
                  }
                } else {
                  if (desc.set) {
                    str = ctx.stylize("[Setter]", "special");
                  }
                }
                if (!hasOwnProperty(visibleKeys, key)) {
                  name = "[" + key + "]";
                }
                if (!str) {
                  if (ctx.seen.indexOf(desc.value) < 0) {
                    if (isNull(recurseTimes)) {
                      str = formatValue(ctx, desc.value, null);
                    } else {
                      str = formatValue(ctx, desc.value, recurseTimes - 1);
                    }
                    if (str.indexOf("\n") > -1) {
                      if (array) {
                        str = str
                          .split("\n")
                          .map(function (line) {
                            return "  " + line;
                          })
                          .join("\n")
                          .substr(2);
                      } else {
                        str =
                          "\n" +
                          str
                            .split("\n")
                            .map(function (line) {
                              return "   " + line;
                            })
                            .join("\n");
                      }
                    }
                  } else {
                    str = ctx.stylize("[Circular]", "special");
                  }
                }
                if (isUndefined(name)) {
                  if (array && key.match(/^\d+$/)) {
                    return str;
                  }
                  name = JSON.stringify("" + key);
                  if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
                    name = name.substr(1, name.length - 2);
                    name = ctx.stylize(name, "name");
                  } else {
                    name = name
                      .replace(/'/g, "\\'")
                      .replace(/\\"/g, '"')
                      .replace(/(^"|"$)/g, "'");
                    name = ctx.stylize(name, "string");
                  }
                }

                return name + ": " + str;
              }

              function reduceToSingleString(output, base, braces) {
                var numLinesEst = 0;
                var length = output.reduce(function (prev, cur) {
                  numLinesEst++;
                  if (cur.indexOf("\n") >= 0) numLinesEst++;
                  return prev + cur.replace(/\u001b\[\d\d?m/g, "").length + 1;
                }, 0);

                if (length > 60) {
                  return braces[0] + (base === "" ? "" : base + "\n ") + " " + output.join(",\n  ") + " " + braces[1];
                }

                return braces[0] + base + " " + output.join(", ") + " " + braces[1];
              }

              // NOTE: These type checking functions intentionally don't use `instanceof`
              // because it is fragile and can be easily faked with `Object.create()`.
              exports.types = require("./support/types");

              function isArray(ar) {
                return Array.isArray(ar);
              }
              exports.isArray = isArray;

              function isBoolean(arg) {
                return typeof arg === "boolean";
              }
              exports.isBoolean = isBoolean;

              function isNull(arg) {
                return arg === null;
              }
              exports.isNull = isNull;

              function isNullOrUndefined(arg) {
                return arg == null;
              }
              exports.isNullOrUndefined = isNullOrUndefined;

              function isNumber(arg) {
                return typeof arg === "number";
              }
              exports.isNumber = isNumber;

              function isString(arg) {
                return typeof arg === "string";
              }
              exports.isString = isString;

              function isSymbol(arg) {
                return typeof arg === "symbol";
              }
              exports.isSymbol = isSymbol;

              function isUndefined(arg) {
                return arg === void 0;
              }
              exports.isUndefined = isUndefined;

              function isRegExp(re) {
                return isObject(re) && objectToString(re) === "[object RegExp]";
              }
              exports.isRegExp = isRegExp;
              exports.types.isRegExp = isRegExp;

              function isObject(arg) {
                return typeof arg === "object" && arg !== null;
              }
              exports.isObject = isObject;

              function isDate(d) {
                return isObject(d) && objectToString(d) === "[object Date]";
              }
              exports.isDate = isDate;
              exports.types.isDate = isDate;

              function isError(e) {
                return isObject(e) && (objectToString(e) === "[object Error]" || e instanceof Error);
              }
              exports.isError = isError;
              exports.types.isNativeError = isError;

              function isFunction(arg) {
                return typeof arg === "function";
              }
              exports.isFunction = isFunction;

              function isPrimitive(arg) {
                return (
                  arg === null ||
                  typeof arg === "boolean" ||
                  typeof arg === "number" ||
                  typeof arg === "string" ||
                  typeof arg === "symbol" || // ES6 symbol
                  typeof arg === "undefined"
                );
              }
              exports.isPrimitive = isPrimitive;

              exports.isBuffer = require("./support/isBuffer");

              function objectToString(o) {
                return Object.prototype.toString.call(o);
              }

              function pad(n) {
                return n < 10 ? "0" + n.toString(10) : n.toString(10);
              }

              var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

              // 26 Feb 16:19:34
              function timestamp() {
                var d = new Date();
                var time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(":");
                return [d.getDate(), months[d.getMonth()], time].join(" ");
              }

              // log is just a thin wrapper to console.log that prepends a timestamp
              exports.log = function () {
                console.log("%s - %s", timestamp(), exports.format.apply(exports, arguments));
              };

              /**
               * Inherit the prototype methods from one constructor into another.
               *
               * The Function.prototype.inherits from lang.js rewritten as a standalone
               * function (not on Function.prototype). NOTE: If this file is to be loaded
               * during bootstrapping this function needs to be rewritten using some native
               * functions as prototype setup using normal JavaScript does not work as
               * expected during bootstrapping (see mirror.js in r114903).
               *
               * @param {function} ctor Constructor function which needs to inherit the
               *     prototype.
               * @param {function} superCtor Constructor function to inherit prototype from.
               */
              exports.inherits = require("inherits");

              exports._extend = function (origin, add) {
                // Don't do anything if add isn't an object
                if (!add || !isObject(add)) return origin;

                var keys = Object.keys(add);
                var i = keys.length;
                while (i--) {
                  origin[keys[i]] = add[keys[i]];
                }
                return origin;
              };

              function hasOwnProperty(obj, prop) {
                return Object.prototype.hasOwnProperty.call(obj, prop);
              }

              var kCustomPromisifiedSymbol =
                typeof Symbol !== "undefined" ? Symbol("util.promisify.custom") : undefined;

              exports.promisify = function promisify(original) {
                if (typeof original !== "function")
                  throw new TypeError('The "original" argument must be of type Function');

                if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
                  var fn = original[kCustomPromisifiedSymbol];
                  if (typeof fn !== "function") {
                    throw new TypeError('The "util.promisify.custom" argument must be of type Function');
                  }
                  Object.defineProperty(fn, kCustomPromisifiedSymbol, {
                    value: fn,
                    enumerable: false,
                    writable: false,
                    configurable: true,
                  });
                  return fn;
                }

                function fn() {
                  var promiseResolve, promiseReject;
                  var promise = new Promise(function (resolve, reject) {
                    promiseResolve = resolve;
                    promiseReject = reject;
                  });

                  var args = [];
                  for (var i = 0; i < arguments.length; i++) {
                    args.push(arguments[i]);
                  }
                  args.push(function (err, value) {
                    if (err) {
                      promiseReject(err);
                    } else {
                      promiseResolve(value);
                    }
                  });

                  try {
                    original.apply(this, args);
                  } catch (err) {
                    promiseReject(err);
                  }

                  return promise;
                }

                Object.setPrototypeOf(fn, Object.getPrototypeOf(original));

                if (kCustomPromisifiedSymbol)
                  Object.defineProperty(fn, kCustomPromisifiedSymbol, {
                    value: fn,
                    enumerable: false,
                    writable: false,
                    configurable: true,
                  });
                return Object.defineProperties(fn, getOwnPropertyDescriptors(original));
              };

              exports.promisify.custom = kCustomPromisifiedSymbol;

              function callbackifyOnRejected(reason, cb) {
                // `!reason` guard inspired by bluebird (Ref: https://goo.gl/t5IS6M).
                // Because `null` is a special error value in callbacks which means "no error
                // occurred", we error-wrap so the callback consumer can distinguish between
                // "the promise rejected with null" or "the promise fulfilled with undefined".
                if (!reason) {
                  var newReason = new Error("Promise was rejected with a falsy value");
                  newReason.reason = reason;
                  reason = newReason;
                }
                return cb(reason);
              }

              function callbackify(original) {
                if (typeof original !== "function") {
                  throw new TypeError('The "original" argument must be of type Function');
                }

                // We DO NOT return the promise as it gives the user a false sense that
                // the promise is actually somehow related to the callback's execution
                // and that the callback throwing will reject the promise.
                function callbackified() {
                  var args = [];
                  for (var i = 0; i < arguments.length; i++) {
                    args.push(arguments[i]);
                  }

                  var maybeCb = args.pop();
                  if (typeof maybeCb !== "function") {
                    throw new TypeError("The last argument must be of type Function");
                  }
                  var self = this;
                  var cb = function () {
                    return maybeCb.apply(self, arguments);
                  };
                  // In true node style we process the callback on `nextTick` with all the
                  // implications (stack, `uncaughtException`, `async_hooks`)
                  original.apply(this, args).then(
                    function (ret) {
                      process.nextTick(cb.bind(null, null, ret));
                    },
                    function (rej) {
                      process.nextTick(callbackifyOnRejected.bind(null, rej, cb));
                    },
                  );
                }

                Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
                Object.defineProperties(callbackified, getOwnPropertyDescriptors(original));
                return callbackified;
              }
              exports.callbackify = callbackify;
            }).call(this);
          }).call(this, require("_process"));
        },
        { "./support/isBuffer": 21, "./support/types": 22, _process: 40, inherits: 34 },
      ],
      24: [
        function (require, module, exports) {
          "use strict";

          var GetIntrinsic = require("get-intrinsic");

          var callBind = require(".");

          var $indexOf = callBind(GetIntrinsic("String.prototype.indexOf"));

          module.exports = function callBoundIntrinsic(name, allowMissing) {
            var intrinsic = GetIntrinsic(name, !!allowMissing);
            if (typeof intrinsic === "function" && $indexOf(name, ".prototype.") > -1) {
              return callBind(intrinsic);
            }
            return intrinsic;
          };
        },
        { "./": 25, "get-intrinsic": 29 },
      ],
      25: [
        function (require, module, exports) {
          "use strict";

          var bind = require("function-bind");
          var GetIntrinsic = require("get-intrinsic");

          var $apply = GetIntrinsic("%Function.prototype.apply%");
          var $call = GetIntrinsic("%Function.prototype.call%");
          var $reflectApply = GetIntrinsic("%Reflect.apply%", true) || bind.call($call, $apply);

          var $gOPD = GetIntrinsic("%Object.getOwnPropertyDescriptor%", true);
          var $defineProperty = GetIntrinsic("%Object.defineProperty%", true);
          var $max = GetIntrinsic("%Math.max%");

          if ($defineProperty) {
            try {
              $defineProperty({}, "a", { value: 1 });
            } catch (e) {
              // IE 8 has a broken defineProperty
              $defineProperty = null;
            }
          }

          module.exports = function callBind(originalFunction) {
            var func = $reflectApply(bind, $call, arguments);
            if ($gOPD && $defineProperty) {
              var desc = $gOPD(func, "length");
              if (desc.configurable) {
                // original length, plus the receiver, minus any additional arguments (after the receiver)
                $defineProperty(func, "length", {
                  value: 1 + $max(0, originalFunction.length - (arguments.length - 1)),
                });
              }
            }
            return func;
          };

          var applyBind = function applyBind() {
            return $reflectApply(bind, $apply, arguments);
          };

          if ($defineProperty) {
            $defineProperty(module.exports, "apply", { value: applyBind });
          } else {
            module.exports.apply = applyBind;
          }
        },
        { "function-bind": 28, "get-intrinsic": 29 },
      ],
      26: [
        function (require, module, exports) {
          "use strict";

          var isCallable = require("is-callable");

          var toStr = Object.prototype.toString;
          var hasOwnProperty = Object.prototype.hasOwnProperty;

          var forEachArray = function forEachArray(array, iterator, receiver) {
            for (var i = 0, len = array.length; i < len; i++) {
              if (hasOwnProperty.call(array, i)) {
                if (receiver == null) {
                  iterator(array[i], i, array);
                } else {
                  iterator.call(receiver, array[i], i, array);
                }
              }
            }
          };

          var forEachString = function forEachString(string, iterator, receiver) {
            for (var i = 0, len = string.length; i < len; i++) {
              // no such thing as a sparse string.
              if (receiver == null) {
                iterator(string.charAt(i), i, string);
              } else {
                iterator.call(receiver, string.charAt(i), i, string);
              }
            }
          };

          var forEachObject = function forEachObject(object, iterator, receiver) {
            for (var k in object) {
              if (hasOwnProperty.call(object, k)) {
                if (receiver == null) {
                  iterator(object[k], k, object);
                } else {
                  iterator.call(receiver, object[k], k, object);
                }
              }
            }
          };

          var forEach = function forEach(list, iterator, thisArg) {
            if (!isCallable(iterator)) {
              throw new TypeError("iterator must be a function");
            }

            var receiver;
            if (arguments.length >= 3) {
              receiver = thisArg;
            }

            if (toStr.call(list) === "[object Array]") {
              forEachArray(list, iterator, receiver);
            } else if (typeof list === "string") {
              forEachString(list, iterator, receiver);
            } else {
              forEachObject(list, iterator, receiver);
            }
          };

          module.exports = forEach;
        },
        { "is-callable": 36 },
      ],
      27: [
        function (require, module, exports) {
          "use strict";

          /* eslint no-invalid-this: 1 */

          var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
          var slice = Array.prototype.slice;
          var toStr = Object.prototype.toString;
          var funcType = "[object Function]";

          module.exports = function bind(that) {
            var target = this;
            if (typeof target !== "function" || toStr.call(target) !== funcType) {
              throw new TypeError(ERROR_MESSAGE + target);
            }
            var args = slice.call(arguments, 1);

            var bound;
            var binder = function () {
              if (this instanceof bound) {
                var result = target.apply(this, args.concat(slice.call(arguments)));
                if (Object(result) === result) {
                  return result;
                }
                return this;
              } else {
                return target.apply(that, args.concat(slice.call(arguments)));
              }
            };

            var boundLength = Math.max(0, target.length - args.length);
            var boundArgs = [];
            for (var i = 0; i < boundLength; i++) {
              boundArgs.push("$" + i);
            }

            bound = Function(
              "binder",
              "return function (" + boundArgs.join(",") + "){ return binder.apply(this,arguments); }",
            )(binder);

            if (target.prototype) {
              var Empty = function Empty() {};
              Empty.prototype = target.prototype;
              bound.prototype = new Empty();
              Empty.prototype = null;
            }

            return bound;
          };
        },
        {},
      ],
      28: [
        function (require, module, exports) {
          "use strict";

          var implementation = require("./implementation");

          module.exports = Function.prototype.bind || implementation;
        },
        { "./implementation": 27 },
      ],
      29: [
        function (require, module, exports) {
          "use strict";

          var undefined;

          var $SyntaxError = SyntaxError;
          var $Function = Function;
          var $TypeError = TypeError;

          // eslint-disable-next-line consistent-return
          var getEvalledConstructor = function (expressionSyntax) {
            try {
              return $Function('"use strict"; return (' + expressionSyntax + ").constructor;")();
            } catch (e) {}
          };

          var $gOPD = Object.getOwnPropertyDescriptor;
          if ($gOPD) {
            try {
              $gOPD({}, "");
            } catch (e) {
              $gOPD = null; // this is IE 8, which has a broken gOPD
            }
          }

          var throwTypeError = function () {
            throw new $TypeError();
          };
          var ThrowTypeError = $gOPD
            ? (function () {
                try {
                  // eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
                  arguments.callee; // IE 8 does not throw here
                  return throwTypeError;
                } catch (calleeThrows) {
                  try {
                    // IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
                    return $gOPD(arguments, "callee").get;
                  } catch (gOPDthrows) {
                    return throwTypeError;
                  }
                }
              })()
            : throwTypeError;

          var hasSymbols = require("has-symbols")();

          var getProto =
            Object.getPrototypeOf ||
            function (x) {
              return x.__proto__;
            }; // eslint-disable-line no-proto

          var needsEval = {};

          var TypedArray = typeof Uint8Array === "undefined" ? undefined : getProto(Uint8Array);

          var INTRINSICS = {
            "%AggregateError%": typeof AggregateError === "undefined" ? undefined : AggregateError,
            "%Array%": Array,
            "%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined : ArrayBuffer,
            "%ArrayIteratorPrototype%": hasSymbols ? getProto([][Symbol.iterator]()) : undefined,
            "%AsyncFromSyncIteratorPrototype%": undefined,
            "%AsyncFunction%": needsEval,
            "%AsyncGenerator%": needsEval,
            "%AsyncGeneratorFunction%": needsEval,
            "%AsyncIteratorPrototype%": needsEval,
            "%Atomics%": typeof Atomics === "undefined" ? undefined : Atomics,
            "%BigInt%": typeof BigInt === "undefined" ? undefined : BigInt,
            "%Boolean%": Boolean,
            "%DataView%": typeof DataView === "undefined" ? undefined : DataView,
            "%Date%": Date,
            "%decodeURI%": decodeURI,
            "%decodeURIComponent%": decodeURIComponent,
            "%encodeURI%": encodeURI,
            "%encodeURIComponent%": encodeURIComponent,
            "%Error%": Error,
            "%eval%": eval, // eslint-disable-line no-eval
            "%EvalError%": EvalError,
            "%Float32Array%": typeof Float32Array === "undefined" ? undefined : Float32Array,
            "%Float64Array%": typeof Float64Array === "undefined" ? undefined : Float64Array,
            "%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined : FinalizationRegistry,
            "%Function%": $Function,
            "%GeneratorFunction%": needsEval,
            "%Int8Array%": typeof Int8Array === "undefined" ? undefined : Int8Array,
            "%Int16Array%": typeof Int16Array === "undefined" ? undefined : Int16Array,
            "%Int32Array%": typeof Int32Array === "undefined" ? undefined : Int32Array,
            "%isFinite%": isFinite,
            "%isNaN%": isNaN,
            "%IteratorPrototype%": hasSymbols ? getProto(getProto([][Symbol.iterator]())) : undefined,
            "%JSON%": typeof JSON === "object" ? JSON : undefined,
            "%Map%": typeof Map === "undefined" ? undefined : Map,
            "%MapIteratorPrototype%":
              typeof Map === "undefined" || !hasSymbols ? undefined : getProto(new Map()[Symbol.iterator]()),
            "%Math%": Math,
            "%Number%": Number,
            "%Object%": Object,
            "%parseFloat%": parseFloat,
            "%parseInt%": parseInt,
            "%Promise%": typeof Promise === "undefined" ? undefined : Promise,
            "%Proxy%": typeof Proxy === "undefined" ? undefined : Proxy,
            "%RangeError%": RangeError,
            "%ReferenceError%": ReferenceError,
            "%Reflect%": typeof Reflect === "undefined" ? undefined : Reflect,
            "%RegExp%": RegExp,
            "%Set%": typeof Set === "undefined" ? undefined : Set,
            "%SetIteratorPrototype%":
              typeof Set === "undefined" || !hasSymbols ? undefined : getProto(new Set()[Symbol.iterator]()),
            "%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined : SharedArrayBuffer,
            "%String%": String,
            "%StringIteratorPrototype%": hasSymbols ? getProto(""[Symbol.iterator]()) : undefined,
            "%Symbol%": hasSymbols ? Symbol : undefined,
            "%SyntaxError%": $SyntaxError,
            "%ThrowTypeError%": ThrowTypeError,
            "%TypedArray%": TypedArray,
            "%TypeError%": $TypeError,
            "%Uint8Array%": typeof Uint8Array === "undefined" ? undefined : Uint8Array,
            "%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined : Uint8ClampedArray,
            "%Uint16Array%": typeof Uint16Array === "undefined" ? undefined : Uint16Array,
            "%Uint32Array%": typeof Uint32Array === "undefined" ? undefined : Uint32Array,
            "%URIError%": URIError,
            "%WeakMap%": typeof WeakMap === "undefined" ? undefined : WeakMap,
            "%WeakRef%": typeof WeakRef === "undefined" ? undefined : WeakRef,
            "%WeakSet%": typeof WeakSet === "undefined" ? undefined : WeakSet,
          };

          var doEval = function doEval(name) {
            var value;
            if (name === "%AsyncFunction%") {
              value = getEvalledConstructor("async function () {}");
            } else if (name === "%GeneratorFunction%") {
              value = getEvalledConstructor("function* () {}");
            } else if (name === "%AsyncGeneratorFunction%") {
              value = getEvalledConstructor("async function* () {}");
            } else if (name === "%AsyncGenerator%") {
              var fn = doEval("%AsyncGeneratorFunction%");
              if (fn) {
                value = fn.prototype;
              }
            } else if (name === "%AsyncIteratorPrototype%") {
              var gen = doEval("%AsyncGenerator%");
              if (gen) {
                value = getProto(gen.prototype);
              }
            }

            INTRINSICS[name] = value;

            return value;
          };

          var LEGACY_ALIASES = {
            "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
            "%ArrayPrototype%": ["Array", "prototype"],
            "%ArrayProto_entries%": ["Array", "prototype", "entries"],
            "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
            "%ArrayProto_keys%": ["Array", "prototype", "keys"],
            "%ArrayProto_values%": ["Array", "prototype", "values"],
            "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
            "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
            "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
            "%BooleanPrototype%": ["Boolean", "prototype"],
            "%DataViewPrototype%": ["DataView", "prototype"],
            "%DatePrototype%": ["Date", "prototype"],
            "%ErrorPrototype%": ["Error", "prototype"],
            "%EvalErrorPrototype%": ["EvalError", "prototype"],
            "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
            "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
            "%FunctionPrototype%": ["Function", "prototype"],
            "%Generator%": ["GeneratorFunction", "prototype"],
            "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
            "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
            "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
            "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
            "%JSONParse%": ["JSON", "parse"],
            "%JSONStringify%": ["JSON", "stringify"],
            "%MapPrototype%": ["Map", "prototype"],
            "%NumberPrototype%": ["Number", "prototype"],
            "%ObjectPrototype%": ["Object", "prototype"],
            "%ObjProto_toString%": ["Object", "prototype", "toString"],
            "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
            "%PromisePrototype%": ["Promise", "prototype"],
            "%PromiseProto_then%": ["Promise", "prototype", "then"],
            "%Promise_all%": ["Promise", "all"],
            "%Promise_reject%": ["Promise", "reject"],
            "%Promise_resolve%": ["Promise", "resolve"],
            "%RangeErrorPrototype%": ["RangeError", "prototype"],
            "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
            "%RegExpPrototype%": ["RegExp", "prototype"],
            "%SetPrototype%": ["Set", "prototype"],
            "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
            "%StringPrototype%": ["String", "prototype"],
            "%SymbolPrototype%": ["Symbol", "prototype"],
            "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
            "%TypedArrayPrototype%": ["TypedArray", "prototype"],
            "%TypeErrorPrototype%": ["TypeError", "prototype"],
            "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
            "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
            "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
            "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
            "%URIErrorPrototype%": ["URIError", "prototype"],
            "%WeakMapPrototype%": ["WeakMap", "prototype"],
            "%WeakSetPrototype%": ["WeakSet", "prototype"],
          };

          var bind = require("function-bind");
          var hasOwn = require("has");
          var $concat = bind.call(Function.call, Array.prototype.concat);
          var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
          var $replace = bind.call(Function.call, String.prototype.replace);
          var $strSlice = bind.call(Function.call, String.prototype.slice);

          /* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
          var rePropName =
            /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
          var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
          var stringToPath = function stringToPath(string) {
            var first = $strSlice(string, 0, 1);
            var last = $strSlice(string, -1);
            if (first === "%" && last !== "%") {
              throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
            } else if (last === "%" && first !== "%") {
              throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
            }
            var result = [];
            $replace(string, rePropName, function (match, number, quote, subString) {
              result[result.length] = quote ? $replace(subString, reEscapeChar, "$1") : number || match;
            });
            return result;
          };
          /* end adaptation */

          var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
            var intrinsicName = name;
            var alias;
            if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
              alias = LEGACY_ALIASES[intrinsicName];
              intrinsicName = "%" + alias[0] + "%";
            }

            if (hasOwn(INTRINSICS, intrinsicName)) {
              var value = INTRINSICS[intrinsicName];
              if (value === needsEval) {
                value = doEval(intrinsicName);
              }
              if (typeof value === "undefined" && !allowMissing) {
                throw new $TypeError("intrinsic " + name + " exists, but is not available. Please file an issue!");
              }

              return {
                alias: alias,
                name: intrinsicName,
                value: value,
              };
            }

            throw new $SyntaxError("intrinsic " + name + " does not exist!");
          };

          module.exports = function GetIntrinsic(name, allowMissing) {
            if (typeof name !== "string" || name.length === 0) {
              throw new $TypeError("intrinsic name must be a non-empty string");
            }
            if (arguments.length > 1 && typeof allowMissing !== "boolean") {
              throw new $TypeError('"allowMissing" argument must be a boolean');
            }

            var parts = stringToPath(name);
            var intrinsicBaseName = parts.length > 0 ? parts[0] : "";

            var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
            var intrinsicRealName = intrinsic.name;
            var value = intrinsic.value;
            var skipFurtherCaching = false;

            var alias = intrinsic.alias;
            if (alias) {
              intrinsicBaseName = alias[0];
              $spliceApply(parts, $concat([0, 1], alias));
            }

            for (var i = 1, isOwn = true; i < parts.length; i += 1) {
              var part = parts[i];
              var first = $strSlice(part, 0, 1);
              var last = $strSlice(part, -1);
              if (
                (first === '"' || first === "'" || first === "`" || last === '"' || last === "'" || last === "`") &&
                first !== last
              ) {
                throw new $SyntaxError("property names with quotes must have matching quotes");
              }
              if (part === "constructor" || !isOwn) {
                skipFurtherCaching = true;
              }

              intrinsicBaseName += "." + part;
              intrinsicRealName = "%" + intrinsicBaseName + "%";

              if (hasOwn(INTRINSICS, intrinsicRealName)) {
                value = INTRINSICS[intrinsicRealName];
              } else if (value != null) {
                if (!(part in value)) {
                  if (!allowMissing) {
                    throw new $TypeError("base intrinsic for " + name + " exists, but the property is not available.");
                  }
                  return void undefined;
                }
                if ($gOPD && i + 1 >= parts.length) {
                  var desc = $gOPD(value, part);
                  isOwn = !!desc;

                  // By convention, when a data property is converted to an accessor
                  // property to emulate a data property that does not suffer from
                  // the override mistake, that accessor's getter is marked with
                  // an `originalValue` property. Here, when we detect this, we
                  // uphold the illusion by pretending to see that original data
                  // property, i.e., returning the value rather than the getter
                  // itself.
                  if (isOwn && "get" in desc && !("originalValue" in desc.get)) {
                    value = desc.get;
                  } else {
                    value = value[part];
                  }
                } else {
                  isOwn = hasOwn(value, part);
                  value = value[part];
                }

                if (isOwn && !skipFurtherCaching) {
                  INTRINSICS[intrinsicRealName] = value;
                }
              }
            }
            return value;
          };
        },
        { "function-bind": 28, has: 33, "has-symbols": 30 },
      ],
      30: [
        function (require, module, exports) {
          "use strict";

          var origSymbol = typeof Symbol !== "undefined" && Symbol;
          var hasSymbolSham = require("./shams");

          module.exports = function hasNativeSymbols() {
            if (typeof origSymbol !== "function") {
              return false;
            }
            if (typeof Symbol !== "function") {
              return false;
            }
            if (typeof origSymbol("foo") !== "symbol") {
              return false;
            }
            if (typeof Symbol("bar") !== "symbol") {
              return false;
            }

            return hasSymbolSham();
          };
        },
        { "./shams": 31 },
      ],
      31: [
        function (require, module, exports) {
          "use strict";

          /* eslint complexity: [2, 18], max-statements: [2, 33] */
          module.exports = function hasSymbols() {
            if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
              return false;
            }
            if (typeof Symbol.iterator === "symbol") {
              return true;
            }

            var obj = {};
            var sym = Symbol("test");
            var symObj = Object(sym);
            if (typeof sym === "string") {
              return false;
            }

            if (Object.prototype.toString.call(sym) !== "[object Symbol]") {
              return false;
            }
            if (Object.prototype.toString.call(symObj) !== "[object Symbol]") {
              return false;
            }

            // temp disabled per https://github.com/ljharb/object.assign/issues/17
            // if (sym instanceof Symbol) { return false; }
            // temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
            // if (!(symObj instanceof Symbol)) { return false; }

            // if (typeof Symbol.prototype.toString !== 'function') { return false; }
            // if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }

            var symVal = 42;
            obj[sym] = symVal;
            for (sym in obj) {
              return false;
            } // eslint-disable-line no-restricted-syntax, no-unreachable-loop
            if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) {
              return false;
            }

            if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0) {
              return false;
            }

            var syms = Object.getOwnPropertySymbols(obj);
            if (syms.length !== 1 || syms[0] !== sym) {
              return false;
            }

            if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
              return false;
            }

            if (typeof Object.getOwnPropertyDescriptor === "function") {
              var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
              if (descriptor.value !== symVal || descriptor.enumerable !== true) {
                return false;
              }
            }

            return true;
          };
        },
        {},
      ],
      32: [
        function (require, module, exports) {
          "use strict";

          var hasSymbols = require("has-symbols/shams");

          module.exports = function hasToStringTagShams() {
            return hasSymbols() && !!Symbol.toStringTag;
          };
        },
        { "has-symbols/shams": 31 },
      ],
      33: [
        function (require, module, exports) {
          "use strict";

          var bind = require("function-bind");

          module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);
        },
        { "function-bind": 28 },
      ],
      34: [
        function (require, module, exports) {
          if (typeof Object.create === "function") {
            // implementation from standard node.js 'util' module
            module.exports = function inherits(ctor, superCtor) {
              if (superCtor) {
                ctor.super_ = superCtor;
                ctor.prototype = Object.create(superCtor.prototype, {
                  constructor: {
                    value: ctor,
                    enumerable: false,
                    writable: true,
                    configurable: true,
                  },
                });
              }
            };
          } else {
            // old school shim for old browsers
            module.exports = function inherits(ctor, superCtor) {
              if (superCtor) {
                ctor.super_ = superCtor;
                var TempCtor = function () {};
                TempCtor.prototype = superCtor.prototype;
                ctor.prototype = new TempCtor();
                ctor.prototype.constructor = ctor;
              }
            };
          }
        },
        {},
      ],
      35: [
        function (require, module, exports) {
          "use strict";

          var hasToStringTag = require("has-tostringtag/shams")();
          var callBound = require("call-bind/callBound");

          var $toString = callBound("Object.prototype.toString");

          var isStandardArguments = function isArguments(value) {
            if (hasToStringTag && value && typeof value === "object" && Symbol.toStringTag in value) {
              return false;
            }
            return $toString(value) === "[object Arguments]";
          };

          var isLegacyArguments = function isArguments(value) {
            if (isStandardArguments(value)) {
              return true;
            }
            return (
              value !== null &&
              typeof value === "object" &&
              typeof value.length === "number" &&
              value.length >= 0 &&
              $toString(value) !== "[object Array]" &&
              $toString(value.callee) === "[object Function]"
            );
          };

          var supportsStandardArguments = (function () {
            return isStandardArguments(arguments);
          })();

          isStandardArguments.isLegacyArguments = isLegacyArguments; // for tests

          module.exports = supportsStandardArguments ? isStandardArguments : isLegacyArguments;
        },
        { "call-bind/callBound": 24, "has-tostringtag/shams": 32 },
      ],
      36: [
        function (require, module, exports) {
          "use strict";

          var fnToStr = Function.prototype.toString;
          var reflectApply = typeof Reflect === "object" && Reflect !== null && Reflect.apply;
          var badArrayLike;
          var isCallableMarker;
          if (typeof reflectApply === "function" && typeof Object.defineProperty === "function") {
            try {
              badArrayLike = Object.defineProperty({}, "length", {
                get: function () {
                  throw isCallableMarker;
                },
              });
              isCallableMarker = {};
              // eslint-disable-next-line no-throw-literal
              reflectApply(
                function () {
                  throw 42;
                },
                null,
                badArrayLike,
              );
            } catch (_) {
              if (_ !== isCallableMarker) {
                reflectApply = null;
              }
            }
          } else {
            reflectApply = null;
          }

          var constructorRegex = /^\s*class\b/;
          var isES6ClassFn = function isES6ClassFunction(value) {
            try {
              var fnStr = fnToStr.call(value);
              return constructorRegex.test(fnStr);
            } catch (e) {
              return false; // not a function
            }
          };

          var tryFunctionObject = function tryFunctionToStr(value) {
            try {
              if (isES6ClassFn(value)) {
                return false;
              }
              fnToStr.call(value);
              return true;
            } catch (e) {
              return false;
            }
          };
          var toStr = Object.prototype.toString;
          var fnClass = "[object Function]";
          var genClass = "[object GeneratorFunction]";
          var hasToStringTag = typeof Symbol === "function" && !!Symbol.toStringTag; // better: use `has-tostringtag`
          /* globals document: false */
          var documentDotAll =
            typeof document === "object" && typeof document.all === "undefined" && document.all !== undefined
              ? document.all
              : {};

          module.exports = reflectApply
            ? function isCallable(value) {
                if (value === documentDotAll) {
                  return true;
                }
                if (!value) {
                  return false;
                }
                if (typeof value !== "function" && typeof value !== "object") {
                  return false;
                }
                if (typeof value === "function" && !value.prototype) {
                  return true;
                }
                try {
                  reflectApply(value, null, badArrayLike);
                } catch (e) {
                  if (e !== isCallableMarker) {
                    return false;
                  }
                }
                return !isES6ClassFn(value);
              }
            : function isCallable(value) {
                if (value === documentDotAll) {
                  return true;
                }
                if (!value) {
                  return false;
                }
                if (typeof value !== "function" && typeof value !== "object") {
                  return false;
                }
                if (typeof value === "function" && !value.prototype) {
                  return true;
                }
                if (hasToStringTag) {
                  return tryFunctionObject(value);
                }
                if (isES6ClassFn(value)) {
                  return false;
                }
                var strClass = toStr.call(value);
                return strClass === fnClass || strClass === genClass;
              };
        },
        {},
      ],
      37: [
        function (require, module, exports) {
          "use strict";

          var toStr = Object.prototype.toString;
          var fnToStr = Function.prototype.toString;
          var isFnRegex = /^\s*(?:function)?\*/;
          var hasToStringTag = require("has-tostringtag/shams")();
          var getProto = Object.getPrototypeOf;
          var getGeneratorFunc = function () {
            // eslint-disable-line consistent-return
            if (!hasToStringTag) {
              return false;
            }
            try {
              return Function("return function*() {}")();
            } catch (e) {}
          };
          var GeneratorFunction;

          module.exports = function isGeneratorFunction(fn) {
            if (typeof fn !== "function") {
              return false;
            }
            if (isFnRegex.test(fnToStr.call(fn))) {
              return true;
            }
            if (!hasToStringTag) {
              var str = toStr.call(fn);
              return str === "[object GeneratorFunction]";
            }
            if (!getProto) {
              return false;
            }
            if (typeof GeneratorFunction === "undefined") {
              var generatorFunc = getGeneratorFunc();
              GeneratorFunction = generatorFunc ? getProto(generatorFunc) : false;
            }
            return getProto(fn) === GeneratorFunction;
          };
        },
        { "has-tostringtag/shams": 32 },
      ],
      38: [
        function (require, module, exports) {
          (function (global) {
            (function () {
              "use strict";

              var forEach = require("for-each");
              var availableTypedArrays = require("available-typed-arrays");
              var callBound = require("call-bind/callBound");

              var $toString = callBound("Object.prototype.toString");
              var hasToStringTag = require("has-tostringtag/shams")();

              var g = typeof globalThis === "undefined" ? global : globalThis;
              var typedArrays = availableTypedArrays();

              var $indexOf =
                callBound("Array.prototype.indexOf", true) ||
                function indexOf(array, value) {
                  for (var i = 0; i < array.length; i += 1) {
                    if (array[i] === value) {
                      return i;
                    }
                  }
                  return -1;
                };
              var $slice = callBound("String.prototype.slice");
              var toStrTags = {};
              var gOPD = require("es-abstract/helpers/getOwnPropertyDescriptor");
              var getPrototypeOf = Object.getPrototypeOf; // require('getprototypeof');
              if (hasToStringTag && gOPD && getPrototypeOf) {
                forEach(typedArrays, function (typedArray) {
                  var arr = new g[typedArray]();
                  if (Symbol.toStringTag in arr) {
                    var proto = getPrototypeOf(arr);
                    var descriptor = gOPD(proto, Symbol.toStringTag);
                    if (!descriptor) {
                      var superProto = getPrototypeOf(proto);
                      descriptor = gOPD(superProto, Symbol.toStringTag);
                    }
                    toStrTags[typedArray] = descriptor.get;
                  }
                });
              }

              var tryTypedArrays = function tryAllTypedArrays(value) {
                var anyTrue = false;
                forEach(toStrTags, function (getter, typedArray) {
                  if (!anyTrue) {
                    try {
                      anyTrue = getter.call(value) === typedArray;
                    } catch (e) {
                      /**/
                    }
                  }
                });
                return anyTrue;
              };

              module.exports = function isTypedArray(value) {
                if (!value || typeof value !== "object") {
                  return false;
                }
                if (!hasToStringTag || !(Symbol.toStringTag in value)) {
                  var tag = $slice($toString(value), 8, -1);
                  return $indexOf(typedArrays, tag) > -1;
                }
                if (!gOPD) {
                  return false;
                }
                return tryTypedArrays(value);
              };
            }).call(this);
          }).call(
            this,
            typeof global !== "undefined"
              ? global
              : typeof self !== "undefined"
              ? self
              : typeof window !== "undefined"
              ? window
              : {},
          );
        },
        {
          "available-typed-arrays": 20,
          "call-bind/callBound": 24,
          "es-abstract/helpers/getOwnPropertyDescriptor": 39,
          "for-each": 26,
          "has-tostringtag/shams": 32,
        },
      ],
      39: [
        function (require, module, exports) {
          "use strict";

          var GetIntrinsic = require("get-intrinsic");

          var $gOPD = GetIntrinsic("%Object.getOwnPropertyDescriptor%", true);
          if ($gOPD) {
            try {
              $gOPD([], "length");
            } catch (e) {
              // IE 8 has a broken gOPD
              $gOPD = null;
            }
          }

          module.exports = $gOPD;
        },
        { "get-intrinsic": 29 },
      ],
      40: [
        function (require, module, exports) {
          // shim for using process in browser
          var process = (module.exports = {});

          // cached from whatever global is present so that test runners that stub it
          // don't break things.  But we need to wrap it in a try catch in case it is
          // wrapped in strict mode code which doesn't define any globals.  It's inside a
          // function because try/catches deoptimize in certain engines.

          var cachedSetTimeout;
          var cachedClearTimeout;

          function defaultSetTimout() {
            throw new Error("setTimeout has not been defined");
          }
          function defaultClearTimeout() {
            throw new Error("clearTimeout has not been defined");
          }
          (function () {
            try {
              if (typeof setTimeout === "function") {
                cachedSetTimeout = setTimeout;
              } else {
                cachedSetTimeout = defaultSetTimout;
              }
            } catch (e) {
              cachedSetTimeout = defaultSetTimout;
            }
            try {
              if (typeof clearTimeout === "function") {
                cachedClearTimeout = clearTimeout;
              } else {
                cachedClearTimeout = defaultClearTimeout;
              }
            } catch (e) {
              cachedClearTimeout = defaultClearTimeout;
            }
          })();
          function runTimeout(fun) {
            if (cachedSetTimeout === setTimeout) {
              //normal enviroments in sane situations
              return setTimeout(fun, 0);
            }
            // if setTimeout wasn't available but was latter defined
            if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
              cachedSetTimeout = setTimeout;
              return setTimeout(fun, 0);
            }
            try {
              // when when somebody has screwed with setTimeout but no I.E. maddness
              return cachedSetTimeout(fun, 0);
            } catch (e) {
              try {
                // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
                return cachedSetTimeout.call(null, fun, 0);
              } catch (e) {
                // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
                return cachedSetTimeout.call(this, fun, 0);
              }
            }
          }
          function runClearTimeout(marker) {
            if (cachedClearTimeout === clearTimeout) {
              //normal enviroments in sane situations
              return clearTimeout(marker);
            }
            // if clearTimeout wasn't available but was latter defined
            if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
              cachedClearTimeout = clearTimeout;
              return clearTimeout(marker);
            }
            try {
              // when when somebody has screwed with setTimeout but no I.E. maddness
              return cachedClearTimeout(marker);
            } catch (e) {
              try {
                // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
                return cachedClearTimeout.call(null, marker);
              } catch (e) {
                // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
                // Some versions of I.E. have different rules for clearTimeout vs setTimeout
                return cachedClearTimeout.call(this, marker);
              }
            }
          }
          var queue = [];
          var draining = false;
          var currentQueue;
          var queueIndex = -1;

          function cleanUpNextTick() {
            if (!draining || !currentQueue) {
              return;
            }
            draining = false;
            if (currentQueue.length) {
              queue = currentQueue.concat(queue);
            } else {
              queueIndex = -1;
            }
            if (queue.length) {
              drainQueue();
            }
          }

          function drainQueue() {
            if (draining) {
              return;
            }
            var timeout = runTimeout(cleanUpNextTick);
            draining = true;

            var len = queue.length;
            while (len) {
              currentQueue = queue;
              queue = [];
              while (++queueIndex < len) {
                if (currentQueue) {
                  currentQueue[queueIndex].run();
                }
              }
              queueIndex = -1;
              len = queue.length;
            }
            currentQueue = null;
            draining = false;
            runClearTimeout(timeout);
          }

          process.nextTick = function (fun) {
            var args = new Array(arguments.length - 1);
            if (arguments.length > 1) {
              for (var i = 1; i < arguments.length; i++) {
                args[i - 1] = arguments[i];
              }
            }
            queue.push(new Item(fun, args));
            if (queue.length === 1 && !draining) {
              runTimeout(drainQueue);
            }
          };

          // v8 likes predictible objects
          function Item(fun, array) {
            this.fun = fun;
            this.array = array;
          }
          Item.prototype.run = function () {
            this.fun.apply(null, this.array);
          };
          process.title = "browser";
          process.browser = true;
          process.env = {};
          process.argv = [];
          process.version = ""; // empty string to avoid regexp issues
          process.versions = {};

          function noop() {}

          process.on = noop;
          process.addListener = noop;
          process.once = noop;
          process.off = noop;
          process.removeListener = noop;
          process.removeAllListeners = noop;
          process.emit = noop;
          process.prependListener = noop;
          process.prependOnceListener = noop;

          process.listeners = function (name) {
            return [];
          };

          process.binding = function (name) {
            throw new Error("process.binding is not supported");
          };

          process.cwd = function () {
            return "/";
          };
          process.chdir = function (dir) {
            throw new Error("process.chdir is not supported");
          };
          process.umask = function () {
            return 0;
          };
        },
        {},
      ],
      41: [
        function (require, module, exports) {
          (function (global) {
            (function () {
              (function (global, factory) {
                typeof exports === "object" && typeof module !== "undefined"
                  ? (module.exports = factory())
                  : typeof define === "function" && define.amd
                  ? define(factory)
                  : (global.typeDetect = factory());
              })(this, function () {
                "use strict";

                /* !
                 * type-detect
                 * Copyright(c) 2013 jake luer <jake@alogicalparadox.com>
                 * MIT Licensed
                 */
                var promiseExists = typeof Promise === "function";

                /* eslint-disable no-undef */
                var globalObject = typeof self === "object" ? self : global; // eslint-disable-line id-blacklist

                var symbolExists = typeof Symbol !== "undefined";
                var mapExists = typeof Map !== "undefined";
                var setExists = typeof Set !== "undefined";
                var weakMapExists = typeof WeakMap !== "undefined";
                var weakSetExists = typeof WeakSet !== "undefined";
                var dataViewExists = typeof DataView !== "undefined";
                var symbolIteratorExists = symbolExists && typeof Symbol.iterator !== "undefined";
                var symbolToStringTagExists = symbolExists && typeof Symbol.toStringTag !== "undefined";
                var setEntriesExists = setExists && typeof Set.prototype.entries === "function";
                var mapEntriesExists = mapExists && typeof Map.prototype.entries === "function";
                var setIteratorPrototype = setEntriesExists && Object.getPrototypeOf(new Set().entries());
                var mapIteratorPrototype = mapEntriesExists && Object.getPrototypeOf(new Map().entries());
                var arrayIteratorExists =
                  symbolIteratorExists && typeof Array.prototype[Symbol.iterator] === "function";
                var arrayIteratorPrototype = arrayIteratorExists && Object.getPrototypeOf([][Symbol.iterator]());
                var stringIteratorExists =
                  symbolIteratorExists && typeof String.prototype[Symbol.iterator] === "function";
                var stringIteratorPrototype = stringIteratorExists && Object.getPrototypeOf(""[Symbol.iterator]());
                var toStringLeftSliceLength = 8;
                var toStringRightSliceLength = -1;
                /**
                 * ### typeOf (obj)
                 *
                 * Uses `Object.prototype.toString` to determine the type of an object,
                 * normalising behaviour across engine versions & well optimised.
                 *
                 * @param {Mixed} object
                 * @return {String} object type
                 * @api public
                 */
                function typeDetect(obj) {
                  /* ! Speed optimisation
                   * Pre:
                   *   string literal     x 3,039,035 ops/sec ±1.62% (78 runs sampled)
                   *   boolean literal    x 1,424,138 ops/sec ±4.54% (75 runs sampled)
                   *   number literal     x 1,653,153 ops/sec ±1.91% (82 runs sampled)
                   *   undefined          x 9,978,660 ops/sec ±1.92% (75 runs sampled)
                   *   function           x 2,556,769 ops/sec ±1.73% (77 runs sampled)
                   * Post:
                   *   string literal     x 38,564,796 ops/sec ±1.15% (79 runs sampled)
                   *   boolean literal    x 31,148,940 ops/sec ±1.10% (79 runs sampled)
                   *   number literal     x 32,679,330 ops/sec ±1.90% (78 runs sampled)
                   *   undefined          x 32,363,368 ops/sec ±1.07% (82 runs sampled)
                   *   function           x 31,296,870 ops/sec ±0.96% (83 runs sampled)
                   */
                  var typeofObj = typeof obj;
                  if (typeofObj !== "object") {
                    return typeofObj;
                  }

                  /* ! Speed optimisation
                   * Pre:
                   *   null               x 28,645,765 ops/sec ±1.17% (82 runs sampled)
                   * Post:
                   *   null               x 36,428,962 ops/sec ±1.37% (84 runs sampled)
                   */
                  if (obj === null) {
                    return "null";
                  }

                  /* ! Spec Conformance
                   * Test: `Object.prototype.toString.call(window)``
                   *  - Node === "[object global]"
                   *  - Chrome === "[object global]"
                   *  - Firefox === "[object Window]"
                   *  - PhantomJS === "[object Window]"
                   *  - Safari === "[object Window]"
                   *  - IE 11 === "[object Window]"
                   *  - IE Edge === "[object Window]"
                   * Test: `Object.prototype.toString.call(this)``
                   *  - Chrome Worker === "[object global]"
                   *  - Firefox Worker === "[object DedicatedWorkerGlobalScope]"
                   *  - Safari Worker === "[object DedicatedWorkerGlobalScope]"
                   *  - IE 11 Worker === "[object WorkerGlobalScope]"
                   *  - IE Edge Worker === "[object WorkerGlobalScope]"
                   */
                  if (obj === globalObject) {
                    return "global";
                  }

                  /* ! Speed optimisation
                   * Pre:
                   *   array literal      x 2,888,352 ops/sec ±0.67% (82 runs sampled)
                   * Post:
                   *   array literal      x 22,479,650 ops/sec ±0.96% (81 runs sampled)
                   */
                  if (Array.isArray(obj) && (symbolToStringTagExists === false || !(Symbol.toStringTag in obj))) {
                    return "Array";
                  }

                  // Not caching existence of `window` and related properties due to potential
                  // for `window` to be unset before tests in quasi-browser environments.
                  if (typeof window === "object" && window !== null) {
                    /* ! Spec Conformance
                     * (https://html.spec.whatwg.org/multipage/browsers.html#location)
                     * WhatWG HTML$7.7.3 - The `Location` interface
                     * Test: `Object.prototype.toString.call(window.location)``
                     *  - IE <=11 === "[object Object]"
                     *  - IE Edge <=13 === "[object Object]"
                     */
                    if (typeof window.location === "object" && obj === window.location) {
                      return "Location";
                    }

                    /* ! Spec Conformance
                     * (https://html.spec.whatwg.org/#document)
                     * WhatWG HTML$3.1.1 - The `Document` object
                     * Note: Most browsers currently adher to the W3C DOM Level 2 spec
                     *       (https://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-26809268)
                     *       which suggests that browsers should use HTMLTableCellElement for
                     *       both TD and TH elements. WhatWG separates these.
                     *       WhatWG HTML states:
                     *         > For historical reasons, Window objects must also have a
                     *         > writable, configurable, non-enumerable property named
                     *         > HTMLDocument whose value is the Document interface object.
                     * Test: `Object.prototype.toString.call(document)``
                     *  - Chrome === "[object HTMLDocument]"
                     *  - Firefox === "[object HTMLDocument]"
                     *  - Safari === "[object HTMLDocument]"
                     *  - IE <=10 === "[object Document]"
                     *  - IE 11 === "[object HTMLDocument]"
                     *  - IE Edge <=13 === "[object HTMLDocument]"
                     */
                    if (typeof window.document === "object" && obj === window.document) {
                      return "Document";
                    }

                    if (typeof window.navigator === "object") {
                      /* ! Spec Conformance
                       * (https://html.spec.whatwg.org/multipage/webappapis.html#mimetypearray)
                       * WhatWG HTML$8.6.1.5 - Plugins - Interface MimeTypeArray
                       * Test: `Object.prototype.toString.call(navigator.mimeTypes)``
                       *  - IE <=10 === "[object MSMimeTypesCollection]"
                       */
                      if (typeof window.navigator.mimeTypes === "object" && obj === window.navigator.mimeTypes) {
                        return "MimeTypeArray";
                      }

                      /* ! Spec Conformance
                       * (https://html.spec.whatwg.org/multipage/webappapis.html#pluginarray)
                       * WhatWG HTML$8.6.1.5 - Plugins - Interface PluginArray
                       * Test: `Object.prototype.toString.call(navigator.plugins)``
                       *  - IE <=10 === "[object MSPluginsCollection]"
                       */
                      if (typeof window.navigator.plugins === "object" && obj === window.navigator.plugins) {
                        return "PluginArray";
                      }
                    }

                    if (
                      (typeof window.HTMLElement === "function" || typeof window.HTMLElement === "object") &&
                      obj instanceof window.HTMLElement
                    ) {
                      /* ! Spec Conformance
                       * (https://html.spec.whatwg.org/multipage/webappapis.html#pluginarray)
                       * WhatWG HTML$4.4.4 - The `blockquote` element - Interface `HTMLQuoteElement`
                       * Test: `Object.prototype.toString.call(document.createElement('blockquote'))``
                       *  - IE <=10 === "[object HTMLBlockElement]"
                       */
                      if (obj.tagName === "BLOCKQUOTE") {
                        return "HTMLQuoteElement";
                      }

                      /* ! Spec Conformance
                       * (https://html.spec.whatwg.org/#htmltabledatacellelement)
                       * WhatWG HTML$4.9.9 - The `td` element - Interface `HTMLTableDataCellElement`
                       * Note: Most browsers currently adher to the W3C DOM Level 2 spec
                       *       (https://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-82915075)
                       *       which suggests that browsers should use HTMLTableCellElement for
                       *       both TD and TH elements. WhatWG separates these.
                       * Test: Object.prototype.toString.call(document.createElement('td'))
                       *  - Chrome === "[object HTMLTableCellElement]"
                       *  - Firefox === "[object HTMLTableCellElement]"
                       *  - Safari === "[object HTMLTableCellElement]"
                       */
                      if (obj.tagName === "TD") {
                        return "HTMLTableDataCellElement";
                      }

                      /* ! Spec Conformance
                       * (https://html.spec.whatwg.org/#htmltableheadercellelement)
                       * WhatWG HTML$4.9.9 - The `td` element - Interface `HTMLTableHeaderCellElement`
                       * Note: Most browsers currently adher to the W3C DOM Level 2 spec
                       *       (https://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-82915075)
                       *       which suggests that browsers should use HTMLTableCellElement for
                       *       both TD and TH elements. WhatWG separates these.
                       * Test: Object.prototype.toString.call(document.createElement('th'))
                       *  - Chrome === "[object HTMLTableCellElement]"
                       *  - Firefox === "[object HTMLTableCellElement]"
                       *  - Safari === "[object HTMLTableCellElement]"
                       */
                      if (obj.tagName === "TH") {
                        return "HTMLTableHeaderCellElement";
                      }
                    }
                  }

                  /* ! Speed optimisation
                   * Pre:
                   *   Float64Array       x 625,644 ops/sec ±1.58% (80 runs sampled)
                   *   Float32Array       x 1,279,852 ops/sec ±2.91% (77 runs sampled)
                   *   Uint32Array        x 1,178,185 ops/sec ±1.95% (83 runs sampled)
                   *   Uint16Array        x 1,008,380 ops/sec ±2.25% (80 runs sampled)
                   *   Uint8Array         x 1,128,040 ops/sec ±2.11% (81 runs sampled)
                   *   Int32Array         x 1,170,119 ops/sec ±2.88% (80 runs sampled)
                   *   Int16Array         x 1,176,348 ops/sec ±5.79% (86 runs sampled)
                   *   Int8Array          x 1,058,707 ops/sec ±4.94% (77 runs sampled)
                   *   Uint8ClampedArray  x 1,110,633 ops/sec ±4.20% (80 runs sampled)
                   * Post:
                   *   Float64Array       x 7,105,671 ops/sec ±13.47% (64 runs sampled)
                   *   Float32Array       x 5,887,912 ops/sec ±1.46% (82 runs sampled)
                   *   Uint32Array        x 6,491,661 ops/sec ±1.76% (79 runs sampled)
                   *   Uint16Array        x 6,559,795 ops/sec ±1.67% (82 runs sampled)
                   *   Uint8Array         x 6,463,966 ops/sec ±1.43% (85 runs sampled)
                   *   Int32Array         x 5,641,841 ops/sec ±3.49% (81 runs sampled)
                   *   Int16Array         x 6,583,511 ops/sec ±1.98% (80 runs sampled)
                   *   Int8Array          x 6,606,078 ops/sec ±1.74% (81 runs sampled)
                   *   Uint8ClampedArray  x 6,602,224 ops/sec ±1.77% (83 runs sampled)
                   */
                  var stringTag = symbolToStringTagExists && obj[Symbol.toStringTag];
                  if (typeof stringTag === "string") {
                    return stringTag;
                  }

                  var objPrototype = Object.getPrototypeOf(obj);
                  /* ! Speed optimisation
                   * Pre:
                   *   regex literal      x 1,772,385 ops/sec ±1.85% (77 runs sampled)
                   *   regex constructor  x 2,143,634 ops/sec ±2.46% (78 runs sampled)
                   * Post:
                   *   regex literal      x 3,928,009 ops/sec ±0.65% (78 runs sampled)
                   *   regex constructor  x 3,931,108 ops/sec ±0.58% (84 runs sampled)
                   */
                  if (objPrototype === RegExp.prototype) {
                    return "RegExp";
                  }

                  /* ! Speed optimisation
                   * Pre:
                   *   date               x 2,130,074 ops/sec ±4.42% (68 runs sampled)
                   * Post:
                   *   date               x 3,953,779 ops/sec ±1.35% (77 runs sampled)
                   */
                  if (objPrototype === Date.prototype) {
                    return "Date";
                  }

                  /* ! Spec Conformance
                   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-promise.prototype-@@tostringtag)
                   * ES6$25.4.5.4 - Promise.prototype[@@toStringTag] should be "Promise":
                   * Test: `Object.prototype.toString.call(Promise.resolve())``
                   *  - Chrome <=47 === "[object Object]"
                   *  - Edge <=20 === "[object Object]"
                   *  - Firefox 29-Latest === "[object Promise]"
                   *  - Safari 7.1-Latest === "[object Promise]"
                   */
                  if (promiseExists && objPrototype === Promise.prototype) {
                    return "Promise";
                  }

                  /* ! Speed optimisation
                   * Pre:
                   *   set                x 2,222,186 ops/sec ±1.31% (82 runs sampled)
                   * Post:
                   *   set                x 4,545,879 ops/sec ±1.13% (83 runs sampled)
                   */
                  if (setExists && objPrototype === Set.prototype) {
                    return "Set";
                  }

                  /* ! Speed optimisation
                   * Pre:
                   *   map                x 2,396,842 ops/sec ±1.59% (81 runs sampled)
                   * Post:
                   *   map                x 4,183,945 ops/sec ±6.59% (82 runs sampled)
                   */
                  if (mapExists && objPrototype === Map.prototype) {
                    return "Map";
                  }

                  /* ! Speed optimisation
                   * Pre:
                   *   weakset            x 1,323,220 ops/sec ±2.17% (76 runs sampled)
                   * Post:
                   *   weakset            x 4,237,510 ops/sec ±2.01% (77 runs sampled)
                   */
                  if (weakSetExists && objPrototype === WeakSet.prototype) {
                    return "WeakSet";
                  }

                  /* ! Speed optimisation
                   * Pre:
                   *   weakmap            x 1,500,260 ops/sec ±2.02% (78 runs sampled)
                   * Post:
                   *   weakmap            x 3,881,384 ops/sec ±1.45% (82 runs sampled)
                   */
                  if (weakMapExists && objPrototype === WeakMap.prototype) {
                    return "WeakMap";
                  }

                  /* ! Spec Conformance
                   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-dataview.prototype-@@tostringtag)
                   * ES6$24.2.4.21 - DataView.prototype[@@toStringTag] should be "DataView":
                   * Test: `Object.prototype.toString.call(new DataView(new ArrayBuffer(1)))``
                   *  - Edge <=13 === "[object Object]"
                   */
                  if (dataViewExists && objPrototype === DataView.prototype) {
                    return "DataView";
                  }

                  /* ! Spec Conformance
                   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%mapiteratorprototype%-@@tostringtag)
                   * ES6$23.1.5.2.2 - %MapIteratorPrototype%[@@toStringTag] should be "Map Iterator":
                   * Test: `Object.prototype.toString.call(new Map().entries())``
                   *  - Edge <=13 === "[object Object]"
                   */
                  if (mapExists && objPrototype === mapIteratorPrototype) {
                    return "Map Iterator";
                  }

                  /* ! Spec Conformance
                   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%setiteratorprototype%-@@tostringtag)
                   * ES6$23.2.5.2.2 - %SetIteratorPrototype%[@@toStringTag] should be "Set Iterator":
                   * Test: `Object.prototype.toString.call(new Set().entries())``
                   *  - Edge <=13 === "[object Object]"
                   */
                  if (setExists && objPrototype === setIteratorPrototype) {
                    return "Set Iterator";
                  }

                  /* ! Spec Conformance
                   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%arrayiteratorprototype%-@@tostringtag)
                   * ES6$22.1.5.2.2 - %ArrayIteratorPrototype%[@@toStringTag] should be "Array Iterator":
                   * Test: `Object.prototype.toString.call([][Symbol.iterator]())``
                   *  - Edge <=13 === "[object Object]"
                   */
                  if (arrayIteratorExists && objPrototype === arrayIteratorPrototype) {
                    return "Array Iterator";
                  }

                  /* ! Spec Conformance
                   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%stringiteratorprototype%-@@tostringtag)
                   * ES6$21.1.5.2.2 - %StringIteratorPrototype%[@@toStringTag] should be "String Iterator":
                   * Test: `Object.prototype.toString.call(''[Symbol.iterator]())``
                   *  - Edge <=13 === "[object Object]"
                   */
                  if (stringIteratorExists && objPrototype === stringIteratorPrototype) {
                    return "String Iterator";
                  }

                  /* ! Speed optimisation
                   * Pre:
                   *   object from null   x 2,424,320 ops/sec ±1.67% (76 runs sampled)
                   * Post:
                   *   object from null   x 5,838,000 ops/sec ±0.99% (84 runs sampled)
                   */
                  if (objPrototype === null) {
                    return "Object";
                  }

                  return Object.prototype.toString.call(obj).slice(toStringLeftSliceLength, toStringRightSliceLength);
                }

                return typeDetect;
              });
            }).call(this);
          }).call(
            this,
            typeof global !== "undefined"
              ? global
              : typeof self !== "undefined"
              ? self
              : typeof window !== "undefined"
              ? window
              : {},
          );
        },
        {},
      ],
      42: [
        function (require, module, exports) {
          (function (global) {
            (function () {
              "use strict";

              var forEach = require("for-each");
              var availableTypedArrays = require("available-typed-arrays");
              var callBound = require("call-bind/callBound");

              var $toString = callBound("Object.prototype.toString");
              var hasToStringTag = require("has-tostringtag/shams")();

              var g = typeof globalThis === "undefined" ? global : globalThis;
              var typedArrays = availableTypedArrays();

              var $slice = callBound("String.prototype.slice");
              var toStrTags = {};
              var gOPD = require("es-abstract/helpers/getOwnPropertyDescriptor");
              var getPrototypeOf = Object.getPrototypeOf; // require('getprototypeof');
              if (hasToStringTag && gOPD && getPrototypeOf) {
                forEach(typedArrays, function (typedArray) {
                  if (typeof g[typedArray] === "function") {
                    var arr = new g[typedArray]();
                    if (Symbol.toStringTag in arr) {
                      var proto = getPrototypeOf(arr);
                      var descriptor = gOPD(proto, Symbol.toStringTag);
                      if (!descriptor) {
                        var superProto = getPrototypeOf(proto);
                        descriptor = gOPD(superProto, Symbol.toStringTag);
                      }
                      toStrTags[typedArray] = descriptor.get;
                    }
                  }
                });
              }

              var tryTypedArrays = function tryAllTypedArrays(value) {
                var foundName = false;
                forEach(toStrTags, function (getter, typedArray) {
                  if (!foundName) {
                    try {
                      var name = getter.call(value);
                      if (name === typedArray) {
                        foundName = name;
                      }
                    } catch (e) {}
                  }
                });
                return foundName;
              };

              var isTypedArray = require("is-typed-array");

              module.exports = function whichTypedArray(value) {
                if (!isTypedArray(value)) {
                  return false;
                }
                if (!hasToStringTag || !(Symbol.toStringTag in value)) {
                  return $slice($toString(value), 8, -1);
                }
                return tryTypedArrays(value);
              };
            }).call(this);
          }).call(
            this,
            typeof global !== "undefined"
              ? global
              : typeof self !== "undefined"
              ? self
              : typeof window !== "undefined"
              ? window
              : {},
          );
        },
        {
          "available-typed-arrays": 20,
          "call-bind/callBound": 24,
          "es-abstract/helpers/getOwnPropertyDescriptor": 43,
          "for-each": 26,
          "has-tostringtag/shams": 32,
          "is-typed-array": 38,
        },
      ],
      43: [
        function (require, module, exports) {
          arguments[4][39][0].apply(exports, arguments);
        },
        { dup: 39, "get-intrinsic": 29 },
      ],
      44: [
        function (require, module, exports) {
          /**
           * A Sinon fake timer helper that needs to be bundled locally on @sinon/fake-timers bump, and then the output commited.
           * To generate the bundled version, just run `yarn bundle:fake-timers`
           */

          const fakeTimers = require("@sinonjs/fake-timers");

          module.exports = fakeTimers;
        },
        { "@sinonjs/fake-timers": 19 },
      ],
    },
    {},
    [44],
  )(44);
});
