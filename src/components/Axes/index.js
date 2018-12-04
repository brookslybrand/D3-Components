import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'

// TODO: move to another folder
function removeAllChildren(node) {
  // as long as a node has a child, remove it
  // credit: https://stackoverflow.com/questions/683366/remove-all-the-children-dom-elements-in-div
  while (node.hasChildNodes()) {
    node.removeChild(node.lastChild);
  }
}

const createAxes = function(xAxisNode, yAxisNode, width, xScale, yScale) {
  const xAxis = g => g
    .call(d3.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0))

  const yAxis = g => g
    .call(d3.axisLeft(yScale))
    // .call(g => g.select('.domain').remove())
    // .call(g => g.select('.tick:last-of-type text').clone()
    //     .attr('x', 3)
    //     .attr('text-anchor', 'start')
    //     .attr('font-weight', 'bold')
    //     .text('test'))

  // add the xAxis
  d3.select(xAxisNode)
    .call(xAxis)

  // add the yAxis
  d3.select(yAxisNode)
    .call(yAxis)
}

const updateAxes = function(xAxisNode, yAxisNode, width, xScale, yScale) {
  removeAllChildren(xAxisNode)
  removeAllChildren(yAxisNode)
  createAxes(xAxisNode, yAxisNode, width, xScale, yScale)
}

const Axes = ({ width, height, xScale, yScale }) => {
  const xAxisRef = useRef()
  const yAxisRef = useRef()

  const handleUpdateAxes = () => updateAxes(xAxisRef.current, yAxisRef.current, width, xScale, yScale)
  
  useEffect(() => {
    const xAxisNode = xAxisRef.current
    const yAxisNode = yAxisRef.current
    // if any of the properties don't exist, remove anything that might have been added to the axes
    if (!width || !height || !xScale || !yScale) {
      removeAllChildren(xAxisNode)
      removeAllChildren(yAxisNode)
    // else create the axes
    } else {
      createAxes(xAxisNode, yAxisNode, width, xScale, yScale)
      window.addEventListener('resize', handleUpdateAxes)
    }
    // remove the event listener when things change
    return () => {
      window.removeEventListener('resize', handleUpdateAxes)
    }
  })
      
  return [
    <g ref={xAxisRef} key="xAxis" transform={`translate(0, ${height})`} />,
    <g ref={yAxisRef} key="yAxis" />
  ]
}

// Axes.defaultProps = {
//   margin: {top: 0, right: 0, bottom: 0, left: 0}
// }

Axes.propTypes = {
  // svgNode: PropTypes.node.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  xScale: PropTypes.func,
  yScale: PropTypes.func
  // margin: PropTypes.shape({
  //   top: PropTypes.number,
  //   right: PropTypes.number,
  //   bottom: PropTypes.number,
  //   left: PropTypes.number
  // })
}

export default Axes
