'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _Item = require('./Item');

var _Item2 = _interopRequireDefault(_Item);

var _cssClasses = require('./../cssClasses');

var _cssClasses2 = _interopRequireDefault(_cssClasses);

var _childrenOfType = require('../util/childrenOfType');

var _childrenOfType2 = _interopRequireDefault(_childrenOfType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ContextMenu = function (_Component) {
  _inherits(ContextMenu, _Component);

  function ContextMenu(props) {
    _classCallCheck(this, ContextMenu);

    var _this = _possibleConstructorReturn(this, (ContextMenu.__proto__ || Object.getPrototypeOf(ContextMenu)).call(this, props));

    _this.bindWindowEvent = function () {
      window.addEventListener('resize', _this.props.onDestroyContextMenu);
      window.addEventListener('contextmenu', _this.props.onDestroyContextMenu);
      window.addEventListener('mousedown', _this.props.onDestroyContextMenu);
      window.addEventListener('click', _this.props.onDestroyContextMenu);
      window.addEventListener('scroll', _this.props.onDestroyContextMenu);
    };

    _this.unBindWindowEvent = function (e) {
      // Firefox trigger a click event when you mouse up on contextmenu event
      if (typeof e !== 'undefined' && e.button === 2 && e.type !== 'contextmenu') {
        return;
      }
      window.removeEventListener('resize', _this.props.onDestroyContextMenu);
      window.removeEventListener('contextmenu', _this.props.onDestroyContextMenu);
      window.removeEventListener('mousedown', _this.props.onDestroyContextMenu);
      window.removeEventListener('mousedown', _this.unBindWindowEvent);
      window.removeEventListener('click', _this.props.onDestroyContextMenu);
      window.removeEventListener('scroll', _this.props.onDestroyContextMenu);
    };

    _this.onMouseEnter = function () {
      window.removeEventListener('mousedown', _this.props.onDestroyContextMenu);
      return window.removeEventListener('mousedown', _this.unBindWindowEvent);
    };

    _this.onMouseLeave = function () {
      window.addEventListener('mousedown', _this.props.onDestroyContextMenu);
      return window.addEventListener('mousedown', _this.unBindWindowEvent);
    };

    _this.setRef = function (ref) {
      _this.menu = ref;
    };

    _this.show = function (e) {
      e.stopPropagation();
      //eventManager.emit('hideAll');
      //this.refsFromProvider = refsFromProvider;

      var pos = _this.getMousePosition(e);
      _this.setState({
        visible: true,
        pos: pos
      }, _this.setMenuPosition);
    };

    _this.state = {
      visible: false,
      pos: {
        x: 0,
        y: 0
      }
    };
    _this.menu = null;
    return _this;
  }

  _createClass(ContextMenu, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      //eventManager.on(`display::${this.props.id}`, (e, refsFromProvider) => this.show(e, refsFromProvider));
      //eventManager.on('hideAll', this.hide);
      this.show(this.props.event);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      //eventManager.off(`display::${this.props.id}`);
      //eventManager.off('hideAll');
      this.unBindWindowEvent();
    }
  }, {
    key: 'setMenuPosition',
    value: function setMenuPosition() {
      var browserSize = {
        width: window.innerWidth,
        height: window.innerHeight
      };

      var menuSize = {
        width: this.menu.offsetWidth,
        height: this.menu.offsetHeight
      };

      var _state$pos = this.state.pos,
          x = _state$pos.x,
          y = _state$pos.y;

      var offset = 5;
      if (x + menuSize.width > browserSize.width) {
        x -= x + menuSize.width - browserSize.width;
        x -= offset;
      }

      if (y + menuSize.height > browserSize.height) {
        y -= y + menuSize.height - browserSize.height;
        y -= offset;
      }

      this.bindWindowEvent();
      this.setState({ pos: { x: x, y: y } });
    }
  }, {
    key: 'getMousePosition',
    value: function getMousePosition(e) {
      var pos = {
        x: e.clientX,
        y: e.clientY
      };

      if (e.type === 'touchend' && (pos.x === null || pos.y === null)) {
        var touches = e.changedTouches;

        if (touches !== null && touches.length > 0) {
          pos.x = touches[0].clientX;
          pos.y = touches[0].clientY;
        }
      }
      // just covering my ass I guess
      if (pos.x === null || pos.x < 0) {
        pos.x = 0;
      }

      if (pos.y === null || pos.y < 0) {
        pos.y = 0;
      }

      return pos;
    }

    /*getMenuItem() {
      return React.Children.map(
        React.Children.toArray(this.props.children).filter(isValidElement),
        React.cloneElement,
      );
    }*/

  }, {
    key: 'getMenuStyle',
    value: function getMenuStyle() {
      return {
        left: this.state.pos.x,
        top: this.state.pos.y + 1,
        opacity: 1
      };
    }
  }, {
    key: 'getMenuClasses',
    value: function getMenuClasses() {
      var _cx;

      var _props = this.props,
          theme = _props.theme,
          animation = _props.animation;


      return (0, _classnames2.default)(_cssClasses2.default.MENU, (_cx = {}, _defineProperty(_cx, _cssClasses2.default.THEME + theme, theme !== null), _defineProperty(_cx, _cssClasses2.default.ANIMATION_WILL_ENTER + animation, animation !== null), _cx));
    }
  }, {
    key: 'render',
    value: function render() {

      return this.state.visible ? _react2.default.createElement(
        'div',
        {
          className: this.getMenuClasses(),
          style: this.getMenuStyle(),
          ref: this.setRef,
          onMouseEnter: this.onMouseEnter,
          onMouseLeave: this.onMouseLeave
        },
        _react2.default.createElement(
          'div',
          null,
          this.props.children
        )
      ) : null;
    }
  }]);

  return ContextMenu;
}(_react.Component);

ContextMenu.propTypes = {
  children: (0, _childrenOfType2.default)(_Item2.default).isRequired,
  theme: _propTypes2.default.string,
  animation: _propTypes2.default.string
};
ContextMenu.defaultProps = {
  theme: null,
  animation: null
};
ContextMenu.THEME = {
  light: 'light',
  dark: 'dark'
};
ContextMenu.ANIMATION = {
  fade: 'fade',
  flip: 'flip',
  pop: 'pop',
  zoom: 'zoom'
};
exports.default = ContextMenu;