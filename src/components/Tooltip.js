import { Component, createElement } from 'react';
import { createPortal } from 'react-dom';

/**
 * Returns the *x* and *y* coordinates of the mouse relative to the svg root container element.
 * The coordinates are returned as an array of two-elements \[*x*, *y*].
 * Inspired by https://raw.githubusercontent.com/d3/d3-selection/master/src/point.js
 * @param {any} svg the root svg container element
 * @param {any} event the mouse event
 * @returns {number} position of mouse
 */
const svgPoint = (svg, event) => {
  if (svg.createSVGPoint) {
    let point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    point = point.matrixTransform(svg.getScreenCTM().inverse());
    return [point.x, point.y];
  }
  const rect = svg.getBoundingClientRect();
  return [event.clientX - rect.left - svg.clientLeft, event.clientY - rect.top - svg.clientTop];
};

class Tooltip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'TooltipHidden'
    };
    this.updateTooltipListener = (evt) => {
      const mouseTrigger = this.props.for.current;
      if (mouseTrigger) {
        if (mouseTrigger.ownerSVGElement) {
          const mousePosition = svgPoint(mouseTrigger.ownerSVGElement, evt);
          this.setState({
            type: 'TooltipVisible',
            svgSvgElement: mouseTrigger.ownerSVGElement,
            x: mousePosition[0],
            y: mousePosition[1]
          });
        }
      }
    };
    this.hideTooltipListener = () => this.setState({ type: 'TooltipHidden' });
  }

  componentDidMount() {
    const mouseTrigger = this.props.for.current;
    if (mouseTrigger) {
      mouseTrigger.addEventListener('mouseover', this.updateTooltipListener);
      mouseTrigger.addEventListener('mousemove', this.updateTooltipListener);
      mouseTrigger.addEventListener('mouseleave', this.hideTooltipListener);
    }
  }

  render() {
    if (this.state.type === 'TooltipHidden') {
      return createElement('g', null);
    }
    // const x = this.state.x;
    // const y = this.state.y;
    const x = this.state.x < (this.props.parentWidth - this.props.rectWidth)
      ? this.state.x
      : (this.props.activePoint.svgX - this.props.rectWidth - this.props.padding);
    const y = this.state.y < (this.props.parentHeight - this.props.rectHeight)
      ? this.state.y
      : (this.props.parentHeight - this.props.rectHeight);
    const tooltip = (createElement('g',
      {
        className: 'Tooltip',
        transform: `translate(${x}, ${y})`,
        pointerEvents: 'none', // tooltip should never grab mouse > prevent flickering
      }, this.props.children));
    return createPortal(tooltip, this.state.svgSvgElement);
  }

  componentWillUnmount() {
    const mouseTrigger = this.props.for.current;
    if (mouseTrigger) {
      mouseTrigger.removeEventListener('mouseover', this.updateTooltipListener);
      mouseTrigger.removeEventListener('mousemove', this.updateTooltipListener);
      mouseTrigger.removeEventListener('mouseleave', this.hideTooltipListener);
    }
  }
}

export default Tooltip;
