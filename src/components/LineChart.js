import React, { Component } from 'react';
import './LineChart.css';
import PropTypes from 'prop-types';

class LineChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hoverLoc: null,
      activePoint: null
    };
  }

  // GET X & Y || MAX & MIN
  getX() {
    const { data } = this.props;
    return {
      min: 0,
      max: data.length - 1
    };
  }

  getY() {
    const { data } = this.props;
    return {
      min: data.reduce((min, p) => (p.y < min ? p.y : min), data[0].y),
      max: data.reduce((max, p) => (p.y > max ? p.y : max), data[0].y)
    };
  }

  // GET SVG COORDINATES
  getSvgX(x) {
    const { svgWidth, yLabelSize } = this.props;
    return yLabelSize + (x / this.getX().max * (svgWidth - yLabelSize));
  }

  getSvgY(y) {
    const { svgHeight, xLabelSize } = this.props;
    const gY = this.getY();
    return ((svgHeight - xLabelSize) * gY.max - (svgHeight - xLabelSize) * y) / (gY.max - gY.min);
  }

  // BUILD SVG PATH
  makePath() {
    const { data, color } = this.props;
    let pathD = `M ${this.getSvgX(0)} ${this.getSvgY(data[0].y)} `;

    pathD += data.map((point, i) => `L ${this.getSvgX(i)} ${this.getSvgY(point.y)} `);

    return (
      <path className="linechart_path" d={pathD} style={{ stroke: color }} />
    );
  }

  // BUILD SHADED AREA
  makeArea() {
    const { data, areaStyle } = this.props;
    let pathD = `M ${this.getSvgX(0)} ${this.getSvgY(data[0].y)} `;

    pathD += data.map((point, i) => `L ${this.getSvgX(i)} ${this.getSvgY(point.y)} `);

    const x = this.getX();
    const y = this.getY();
    pathD += `L ${this.getSvgX(x.max)} ${this.getSvgY(y.min)} `
    + `L ${this.getSvgX(x.min)} ${this.getSvgY(y.min)} `;

    return <path className="linechart_area" style={areaStyle} d={pathD} />;
  }

  // BUILD GRID AXIS
  makeAxis() {
    const { yLabelSize } = this.props;
    const x = this.getX();
    const y = this.getY();

    return (
      <g className="linechart_axis">
        <line
          x1={this.getSvgX(x.min) - yLabelSize}
          y1={this.getSvgY(y.min)}
          x2={this.getSvgX(x.max)}
          y2={this.getSvgY(y.min)}
          strokeDasharray="5"
        />
        <line
          x1={this.getSvgX(x.min) - yLabelSize}
          y1={this.getSvgY(y.max)}
          x2={this.getSvgX(x.max)}
          y2={this.getSvgY(y.max)}
          strokeDasharray="5"
        />
      </g>
    );
  }

  makeLabels() {
    const { svgHeight, svgWidth, xLabelSize, yLabelSize, data } = this.props;
    const padding = 5;
    return (
      <g className="linechart_label">
        {/* Y AXIS LABELS */}
        <text transform={`translate(${yLabelSize / 2}, 20)`} textAnchor="middle">
          {this.getY().max.toLocaleString('us-EN', { style: 'currency', currency: 'USD' })}
        </text>
        <text transform={`translate(${yLabelSize / 2}, ${svgHeight - xLabelSize - padding})`} textAnchor="middle">
          {this.getY().min.toLocaleString('us-EN', { style: 'currency', currency: 'USD' })}
        </text>
        {/* X AXIS LABELS */}
        <text transform={`translate(${yLabelSize}, ${svgHeight})`} textAnchor="start">
          {data[0].d}
        </text>
        <text transform={`translate(${svgWidth}, ${svgHeight})`} textAnchor="end">
          {data[data.length - 1].d}
        </text>
      </g>
    );
  }

  // FIND CLOSEST POINT TO MOUSE
  getCoords(e) {
    const { svgWidth, data, yLabelSize } = this.props;
    // const { svgWidth, data, yLabelSize, onChartHover } = this.props;
    const { hoverLoc } = this.state;
    const svgLocation = document.getElementsByClassName('linechart')[0].getBoundingClientRect();
    const adjustment = (svgLocation.width - svgWidth) / 2; // takes padding into consideration
    const relativeLoc = e.clientX - svgLocation.left - adjustment;

    const svgData = [];
    data.map((point, i) => {
      svgData.push({
        svgX: this.getSvgX(i),
        svgY: this.getSvgY(point.y),
        d: point.d,
        p: point.p
      });
    });

    let closestPoint = {};
    for (let i = 0, c = 500; i < svgData.length; i++) {
      if (Math.abs(svgData[i].svgX - hoverLoc) <= c) {
        c = Math.abs(svgData[i].svgX - hoverLoc);
        closestPoint = svgData[i];
      }
    }

    if (relativeLoc - yLabelSize < 0) {
      this.stopHover();
    } else {
      this.setState({
        hoverLoc: relativeLoc,
        activePoint: closestPoint
      });
      // onChartHover(relativeLoc, closestPoint);
    }
  }

  // STOP HOVER
  stopHover() {
    // const { onChartHover } = this.props;
    this.setState({ hoverLoc: null, activePoint: null });
    // onChartHover(null, null);
  }

  // MAKE ACTIVE POINT
  makeActivePoint() {
    const { activePoint } = this.state;
    const { color, pointRadius } = this.props;
    return (
      <circle
        className="linechart_point"
        style={{ stroke: color }}
        r={pointRadius}
        cx={activePoint.svgX}
        cy={activePoint.svgY}
      />
    );
  }

  // MAKE HOVER LINE
  createLine() {
    const { hoverLoc } = this.state;
    const { svgHeight, xLabelSize } = this.props;
    return (
      <line
        className="hoverLine"
        x1={hoverLoc}
        y1={-8}
        x2={hoverLoc}
        y2={svgHeight - xLabelSize}
      />
    );
  }

  render() {
    const { hoverLoc, activePoint } = this.state;
    const { svgHeight, svgWidth } = this.props;

    const svgLocation = hoverLoc ? document.getElementsByClassName('linechart')[0].getBoundingClientRect() : 0;

    const placementStyles = {};
    const width = 100;
    placementStyles.width = `${width}px`;
    placementStyles.left = hoverLoc + svgLocation.left - (width / 2);

    return (
      <div className="container">
        <div className="row">
          <div className="popup">
            {hoverLoc ? (
              <div className="hover" style={placementStyles}>
                <div className="date">{activePoint.d}</div>
                <div className="price">{activePoint.p}</div>
              </div>
            ) : null}
          </div>
        </div>
        <div className="row">
          <svg
            width={svgWidth}
            height={svgHeight}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="linechart"
            onMouseLeave={() => this.stopHover()}
            onMouseMove={e => this.getCoords(e)}
          >
            <g>
              {this.makeAxis()}
              {this.makePath()}
              {this.makeArea()}
              {this.makeLabels()}
              {hoverLoc ? this.createLine() : null}
              {hoverLoc ? this.makeActivePoint() : null}
            </g>
          </svg>
        </div>
      </div>
    );
  }
}
// DEFAULT PROPS
LineChart.defaultProps = {
  data: [],
  color: '#2196F3',
  pointRadius: 5,
  svgHeight: 300,
  svgWidth: 900,
  xLabelSize: 20,
  yLabelSize: 80,
  areaStyle: null
};
// Prop Types
LineChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  color: PropTypes.string,
  pointRadius: PropTypes.number,
  svgHeight: PropTypes.number,
  svgWidth: PropTypes.number,
  xLabelSize: PropTypes.number,
  yLabelSize: PropTypes.number,
  areaStyle: PropTypes.object
};

export default LineChart;
