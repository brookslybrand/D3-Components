import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'

// TODO: move to another folder
function removeAllChildren(node) {
  // as long as a node has a child, remove it
  // credit: https://stackoverflow.com/questions/683366/remove-all-the-children-dom-elements-in-div
  while (node.hasChildNodes()) {
    node.removeChild(node.lastChild)
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

// add empty axes for when a width and height are passed, but no scales
const createEmptyAxes = function(xAxisNode, yAxisNode, width, height) {
  const fakeScale = dims => d3.scaleLinear().range(dims)
  
  // add the xAxis
  d3.select(xAxisNode)
    .call(d3.axisBottom(fakeScale([0, width])).ticks(0))

  // add the yAxis
  d3.select(yAxisNode)
    .call(d3.axisLeft(fakeScale([height, 0])).ticks(0))
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
    // if there is no width or height remove anything that might have been added to the axes
    if (!width || !height) {
      removeAllChildren(xAxisNode)
      removeAllChildren(yAxisNode)
    
    // if there is a width and height, but no scales, create an empty axis
    } else if (!xScale || !yScale) {
      createEmptyAxes(xAxisNode, yAxisNode, width, height)
      // window.addEventListener('resize', handleUpdateAxes)
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
    <g ref={xAxisRef} key="xAxis" transform={`translate(0, ${height ? height : 0})`} />,
    <g ref={yAxisRef} key="yAxis" />
  ]
}

Axes.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  xScale: PropTypes.func,
  yScale: PropTypes.func
}

export default Axes
