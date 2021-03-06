(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const { LazyBrush } = require("lazy-brush");

window.LazyBrush = LazyBrush;

},{"lazy-brush":5}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _LazyPoint = require('./LazyPoint');

var _LazyPoint2 = _interopRequireDefault(_LazyPoint);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RADIUS_DEFAULT = 30;

var LazyBrush = function () {
  /**
   * constructor
   *
   * @param {object} settings
   * @param {number} settings.radius The radius for the lazy area
   * @param {boolean} settings.enabled
   */
  function LazyBrush() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$radius = _ref.radius,
        radius = _ref$radius === undefined ? RADIUS_DEFAULT : _ref$radius,
        _ref$enabled = _ref.enabled,
        enabled = _ref$enabled === undefined ? true : _ref$enabled,
        _ref$initialPoint = _ref.initialPoint,
        initialPoint = _ref$initialPoint === undefined ? { x: 0, y: 0 } : _ref$initialPoint;

    _classCallCheck(this, LazyBrush);

    this.radius = radius;
    this._isEnabled = enabled;

    this.pointer = new _LazyPoint2.default(initialPoint.x, initialPoint.y);
    this.brush = new _LazyPoint2.default(initialPoint.x, initialPoint.y);

    this.angle = 0;
    this.distance = 0;
    this._hasMoved = false;
  }

  /**
   * Enable lazy brush calculations.
   *
   */


  _createClass(LazyBrush, [{
    key: 'enable',
    value: function enable() {
      this._isEnabled = true;
    }

    /**
     * Disable lazy brush calculations.
     *
     */

  }, {
    key: 'disable',
    value: function disable() {
      this._isEnabled = false;
    }

    /**
     * @returns {boolean}
     */

  }, {
    key: 'isEnabled',
    value: function isEnabled() {
      return this._isEnabled;
    }

    /**
     * Update the radius
     *
     * @param {number} radius
     */

  }, {
    key: 'setRadius',
    value: function setRadius(radius) {
      this.radius = radius;
    }

    /**
     * Return the current radius
     *
     * @returns {number}
     */

  }, {
    key: 'getRadius',
    value: function getRadius() {
      return this.radius;
    }

    /**
     * Return the brush coordinates as a simple object
     *
     * @returns {object}
     */

  }, {
    key: 'getBrushCoordinates',
    value: function getBrushCoordinates() {
      return this.brush.toObject();
    }

    /**
     * Return the pointer coordinates as a simple object
     *
     * @returns {object}
     */

  }, {
    key: 'getPointerCoordinates',
    value: function getPointerCoordinates() {
      return this.pointer.toObject();
    }

    /**
     * Return the brush as a LazyPoint
     *
     * @returns {LazyPoint}
     */

  }, {
    key: 'getBrush',
    value: function getBrush() {
      return this.brush;
    }

    /**
     * Return the pointer as a LazyPoint
     *
     * @returns {LazyPoint}
     */

  }, {
    key: 'getPointer',
    value: function getPointer() {
      return this.pointer;
    }

    /**
     * Return the angle between pointer and brush
     *
     * @returns {number} Angle in radians
     */

  }, {
    key: 'getAngle',
    value: function getAngle() {
      return this.angle;
    }

    /**
     * Return the distance between pointer and brush
     *
     * @returns {number} Distance in pixels
     */

  }, {
    key: 'getDistance',
    value: function getDistance() {
      return this.distance;
    }

    /**
     * Return if the previous update has moved the brush.
     *
     * @returns {boolean} Whether the brush moved previously.
     */

  }, {
    key: 'brushHasMoved',
    value: function brushHasMoved() {
      return this._hasMoved;
    }

    /**
     * Updates the pointer point and calculates the new brush point.
     *
     * @param {Point} newPointerPoint
     * @param {Object} options
     * @param {Boolean} options.both Force update pointer and brush
     * @returns {Boolean} Whether any of the two points changed
     */

  }, {
    key: 'update',
    value: function update(newPointerPoint) {
      var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref2$both = _ref2.both,
          both = _ref2$both === undefined ? false : _ref2$both;

      this._hasMoved = false;
      if (this.pointer.equalsTo(newPointerPoint) && !both) {
        return false;
      }

      this.pointer.update(newPointerPoint);

      if (both) {
        this._hasMoved = true;
        this.brush.update(newPointerPoint);
        return true;
      }

      if (this._isEnabled) {
        this.distance = this.pointer.getDistanceTo(this.brush);
        this.angle = this.pointer.getAngleTo(this.brush);

        if (this.distance > this.radius) {
          this.brush.moveByAngle(this.angle, this.distance - this.radius);
          this._hasMoved = true;
        }
      } else {
        this.distance = 0;
        this.angle = 0;
        this.brush.update(newPointerPoint);
        this._hasMoved = true;
      }

      return true;
    }
  }]);

  return LazyBrush;
}();

exports.default = LazyBrush;
},{"./LazyPoint":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Point2 = require('./Point');

var _Point3 = _interopRequireDefault(_Point2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LazyPoint = function (_Point) {
  _inherits(LazyPoint, _Point);

  function LazyPoint() {
    _classCallCheck(this, LazyPoint);

    return _possibleConstructorReturn(this, (LazyPoint.__proto__ || Object.getPrototypeOf(LazyPoint)).apply(this, arguments));
  }

  _createClass(LazyPoint, [{
    key: 'update',

    /**
     * Update the x and y values
     *
     * @param {Point} point
     */
    value: function update(point) {
      this.x = point.x;
      this.y = point.y;
    }

    /**
     * Move the point to another position using an angle and distance
     *
     * @param {number} angle The angle in radians
     * @param {number} distance How much the point should be moved
     */

  }, {
    key: 'moveByAngle',
    value: function moveByAngle(angle, distance) {
      // Rotate the angle based on the browser coordinate system ([0,0] in the top left)
      var angleRotated = angle + Math.PI / 2;

      this.x = this.x + Math.sin(angleRotated) * distance, this.y = this.y - Math.cos(angleRotated) * distance;
    }

    /**
     * Check if this point is the same as another point
     *
     * @param {Point} point
     * @returns {boolean}
     */

  }, {
    key: 'equalsTo',
    value: function equalsTo(point) {
      return this.x === point.x && this.y === point.y;
    }

    /**
     * Get the difference for x and y axis to another point
     *
     * @param {Point} point
     * @returns {Point}
     */

  }, {
    key: 'getDifferenceTo',
    value: function getDifferenceTo(point) {
      return new _Point3.default(this.x - point.x, this.y - point.y);
    }

    /**
     * Calculate distance to another point
     *
     * @param {Point} point
     * @returns {Point}
     */

  }, {
    key: 'getDistanceTo',
    value: function getDistanceTo(point) {
      var diff = this.getDifferenceTo(point);

      return Math.sqrt(Math.pow(diff.x, 2) + Math.pow(diff.y, 2));
    }

    /**
     * Calculate the angle to another point
     *
     * @param {Point} point
     * @returns {Point}
     */

  }, {
    key: 'getAngleTo',
    value: function getAngleTo(point) {
      var diff = this.getDifferenceTo(point);

      return Math.atan2(diff.y, diff.x);
    }

    /**
     * Return a simple object with x and y properties
     *
     * @returns {object}
     */

  }, {
    key: 'toObject',
    value: function toObject() {
      return {
        x: this.x,
        y: this.y
      };
    }
  }]);

  return LazyPoint;
}(_Point3.default);

exports.default = LazyPoint;
},{"./Point":4}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Point =
/**
 *
 * @param {number} x
 * @param {number} y
 */
function Point(x, y) {
  _classCallCheck(this, Point);

  this.x = x;
  this.y = y;
};

exports.default = Point;
},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LazyPoint = exports.Point = exports.LazyBrush = undefined;

var _LazyBrush = require('./LazyBrush');

var _LazyBrush2 = _interopRequireDefault(_LazyBrush);

var _Point = require('./Point');

var _Point2 = _interopRequireDefault(_Point);

var _LazyPoint = require('./LazyPoint');

var _LazyPoint2 = _interopRequireDefault(_LazyPoint);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.LazyBrush = _LazyBrush2.default;
exports.Point = _Point2.default;
exports.LazyPoint = _LazyPoint2.default;
},{"./LazyBrush":2,"./LazyPoint":3,"./Point":4}]},{},[1]);
