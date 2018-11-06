
import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * @class Tilt
 * Based on https://github.com/gijsroge/tilt.js
 *
 */
class Tilt extends Component {
  constructor(props) {
    super(props);
    const { options, onMouseEnter, onMouseMove, onMouseLeave } = props;

    this.state = {
      stateStyle: {},
    };

    const defaultSettings = {
      reverse: false,
      max: 35,
      perspective: 1000,
      easing: 'cubic-bezier(.03,.98,.52,.99)',
      scale: '1.1',
      speed: '1000',
      transition: true,
      axis: null,
      reset: true,
    };

    this.settings = Object.assign({}, defaultSettings, options);
    this.reverse = this.settings.reverse ? -1 : 1;

    // Events
    this.onMouseEnter = this.onMouseEnter.bind(this, onMouseEnter);
    this.onMouseMove = this.onMouseMove.bind(this, onMouseMove);
    this.onMouseLeave = this.onMouseLeave.bind(this, onMouseLeave);
  }

  componentDidMount() {
    this.element = this.node;
  }

  componentWillUnmount() {
    clearTimeout(this.transitionTimeout);
    // eslint-disable-next-line
    cancelAnimationFrame(this.updateCall);
  }

  onMouseEnter(cb = () => {}, ev) {
    this.updateElementPosition();
    this.setState(prevState => Object.assign({}, prevState, {
      stateStyle: {
        ...prevState.stateStyle,
        willChange: 'transform',
      },
    }));

    this.setTransition();

    return cb(ev);
  }

  onMouseMove(cb = () => {}, ev) {
    ev.persist();

    if (this.updateCall !== null) {
      window.cancelAnimationFrame(this.updateCall);
    }

    this.event = ev;
    this.updateCall = requestAnimationFrame(this.update.bind(this, ev));

    return cb(ev);
  }

  onMouseLeave(cb = () => {}, ev) {
    this.setTransition();
    if (this.settings.reset) {
      this.reset();
    }
    return cb(ev);
  }

  setTransition() {
    clearTimeout(this.transitionTimeout);

    this.setState(prevState => Object.assign({}, prevState, {
      stateStyle: {
        ...prevState.stateStyle,
        transition: `${this.settings.speed}ms ${this.settings.easing}`,
      },
    }));

    this.transitionTimeout = setTimeout(() => {
      this.setState(prevState => Object.assign({}, prevState, {
        stateStyle: {
          ...prevState.stateStyle,
          transition: '',
        },
      }));
    }, this.settings.speed);
  }


  getValues(e) {
    const x = (e.nativeEvent.clientX - this.left) / this.width;
    const y = (e.nativeEvent.clientY - this.top) / this.height;
    const _x = Math.min(Math.max(x, 0), 1);
    const _y = Math.min(Math.max(y, 0), 1);

    const tiltX = (this.reverse * (this.settings.max / 2 - _x * this.settings.max)).toFixed(2);
    const tiltY = (this.reverse * (_y * this.settings.max - this.settings.max / 2)).toFixed(2);

    const percentageX = _x * 100;
    const percentageY = _y * 100;

    return {
      tiltX,
      tiltY,
      percentageX,
      percentageY,
    };
  }

  reset() {
    window.requestAnimationFrame(() => {
      this.setState(prevState => Object.assign({}, prevState, {
        stateStyle: {
          ...prevState.stateStyle,
          transform: `perspective(${this.settings.perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)` },
      }));
    });
  }

  updateElementPosition() {
    const rect = this.element.getBoundingClientRect();
    this.width = this.element.offsetWidth;
    this.height = this.element.offsetHeight;
    this.left = rect.left;
    this.top = rect.top;
  }

  update(e) {
    const values = this.getValues(e);

    this.setState(prevState => Object.assign({}, prevState, {
      stateStyle: {
        ...prevState.stateStyle,
        transform: `perspective(${this.settings.perspective}px) `
                    + `rotateX(${(this.settings.axis === 'x' ? 0 : values.tiltY)}deg) `
                    + `rotateY(${(this.settings.axis === 'y' ? 0 : values.tiltX)}deg) `
                    + `scale3d(${this.settings.scale}, ${this.settings.scale}, ${this.settings.scale})`,
      },
    }));
    this.updateCall = null;
  }

  render() {
    const { stateStyle } = this.state;
    const { style, className, children } = this.props;
    const jointStyle = Object.assign({}, style, stateStyle);
    return (
      <div
        ref={node => this.node = node} // eslint-disable-line
        style={jointStyle}
        className={className}
        onMouseEnter={this.onMouseEnter}
        onMouseMove={this.onMouseMove}
        onMouseLeave={this.onMouseLeave}
      >
        {children}
      </div>
    );
  }
}

Tilt.defaultProps = {
  options: undefined,
  onMouseEnter: undefined,
  onMouseMove: undefined,
  onMouseLeave: undefined,
  children: undefined,
  style: {},
  className: '',
};

Tilt.propTypes = {
  options: PropTypes.object,
  onMouseEnter: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseLeave: PropTypes.func,
  style: PropTypes.object,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Tilt;
