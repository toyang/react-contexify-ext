import React, { Component, isValidElement } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Item from './Item';
import cssClasses from './../cssClasses';
import childrenOfType from '../util/childrenOfType';

class ContextMenu extends Component {

  static propTypes = {
    children: childrenOfType(Item).isRequired,
    theme: PropTypes.string,
    animation: PropTypes.string
  }

  static defaultProps = {
    theme: null,
    animation: null,
  };

  static THEME = {
    light: 'light',
    dark: 'dark'
  };

  static ANIMATION = {
    fade: 'fade',
    flip: 'flip',
    pop: 'pop',
    zoom: 'zoom'
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      pos: {
        x: 0,
        y: 0,
      },
    };
    this.menu = null;
  }

  componentDidMount() {
    //eventManager.on(`display::${this.props.id}`, (e, refsFromProvider) => this.show(e, refsFromProvider));
    //eventManager.on('hideAll', this.hide);
    this.show(this.props.event);
  }

  componentWillUnmount() {
    //eventManager.off(`display::${this.props.id}`);
    //eventManager.off('hideAll');
    this.unBindWindowEvent();
  }

  bindWindowEvent = () => {
    window.addEventListener('resize', this.props.onDestroyContextMenu);
    window.addEventListener('contextmenu', this.props.onDestroyContextMenu);
    window.addEventListener('mousedown', this.props.onDestroyContextMenu);
    window.addEventListener('click', this.props.onDestroyContextMenu);
    window.addEventListener('scroll', this.props.onDestroyContextMenu);
  };

  unBindWindowEvent = (e) => {
    // Firefox trigger a click event when you mouse up on contextmenu event
    if (typeof e !== 'undefined' && e.button === 2 && e.type !== 'contextmenu') {
      return;
    }
    window.removeEventListener('resize', this.props.onDestroyContextMenu);
    window.removeEventListener('contextmenu', this.props.onDestroyContextMenu);
    window.removeEventListener('mousedown', this.props.onDestroyContextMenu);
    window.removeEventListener('mousedown', this.unBindWindowEvent);
    window.removeEventListener('click', this.props.onDestroyContextMenu);
    window.removeEventListener('scroll', this.props.onDestroyContextMenu);
  };

  onMouseEnter = () => {
    window.removeEventListener('mousedown', this.props.onDestroyContextMenu);
    return window.removeEventListener('mousedown', this.unBindWindowEvent);
  };

  onMouseLeave = () => {
    window.addEventListener('mousedown', this.props.onDestroyContextMenu);
    return window.addEventListener('mousedown', this.unBindWindowEvent);
  }

  setRef = ref => {
    this.menu = ref;
  };

  setMenuPosition() {
    const browserSize = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    const menuSize = {
      width: this.menu.offsetWidth,
      height: this.menu.offsetHeight
    };

    let { x, y } = this.state.pos;

    if ((x + menuSize.width) > browserSize.width) {
      x -= ((x + menuSize.width) - browserSize.width);
    }

    if ((y + menuSize.height) > browserSize.height) {
      y -= ((y + menuSize.height) - browserSize.height);
    }

    this.bindWindowEvent();
    this.setState({pos: {x: x, y: y}});
  }

  getMousePosition(e) {
    const pos = {
      x: e.clientX,
      y: e.clientY
    };

    if (e.type === 'touchend' && (pos.x === null || pos.y === null)) {
      const touches = e.changedTouches;

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

  getMenuStyle() {
    return {
      left: this.state.pos.x,
      top: this.state.pos.y + 1,
      opacity: 1
    };
  }

  getMenuClasses() {
    const { theme, animation } = this.props;

    return cx(
      cssClasses.MENU,
      {
        [cssClasses.THEME + theme]: theme !== null,
        [cssClasses.ANIMATION_WILL_ENTER + animation]: animation !== null
      }
    );
  }

  show = (e) => {
    e.stopPropagation();
    //eventManager.emit('hideAll');
    //this.refsFromProvider = refsFromProvider;

    let pos = this.getMousePosition(e);
    this.setState({
      visible: true,
      pos: pos,
    }, this.setMenuPosition);
  };

  render() {

    return this.state.visible
      ?
        <div
          className={this.getMenuClasses()}
          style={this.getMenuStyle()}
          ref={this.setRef}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          <div>
            {this.props.children}
          </div>
        </div>
      : null;
  }
}

export default ContextMenu;
