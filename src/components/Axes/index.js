import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { axisBottom, axisLeft } from 'd3-axis'
import { scaleLinear } from 'd3-scale'
import { select } from 'd3-selection'
import { transition } from 'd3-transition'

// TODO: move to another folder
function removeAllChildren(node) {
  // as long as a node has a child, remove it
  // credit: https://stackoverflow.com/questions/683366/remove-all-the-children-dom-elements-in-div
  while (node.hasChildNodes()) {
    node.removeChild(node.lastChild)
  }
}

const createAxes = function(xAxisNode, yAxisNode, width, xScale, yScale, transitionDuration) {
  // generate a transition based on the transitionDuration prop
  const t = transition().duration(transitionDuration)

  const xAxis = g => g
    // .transition(t)
    .call(axisBottom(xScale).ticks(width / 80).tickSizeOuter(0)) // TODO: Change

  const yAxis = g => g
    // .transition(t)
    .call(axisLeft(yScale))
    // .call(g => g.select('.domain').remove())
    // .call(g => g.select('.tick:last-of-type text').clone()
    //     .attr('x', 3)
    //     .attr('text-anchor', 'start')
    //     .attr('font-weight', 'bold')
    //     .text('test'))

  // add the xAxis
  select(xAxisNode)
    .transition(t)
    .call(xAxis)
    .selectAll('.tick') // ensure ticks are visible
    .style('opacity', 1)

  // add the yAxis
  select(yAxisNode)
    .transition(t)
    .call(yAxis)
    .selectAll('.tick') // ensure ticks are visible
    .style('opacity', 1)
}

// add empty axes for when a width and height are passed, but no scales
const createTicklessAxes = function(xAxisNode, yAxisNode, width, height, transitionDuration) {
  // generate a transition based on the transitionDuration prop
  const t = transition().duration(transitionDuration)

  // add the xAxis
  select(xAxisNode)
    .transition(t)
    .selectAll('.tick') // fade out and remove ticks if there is no data
    .style('opacity', 0)
    .remove()

  // add the yAxis
  select(yAxisNode)
    .transition(t)
    .selectAll('.tick')
    .style('opacity', 0)
    .remove()
}

const Axes = ({ width, height, xScale, yScale, transitionDuration }) => {
  const xAxisRef = useRef()
  const yAxisRef = useRef()
  
  useEffect(() => {
    const xAxisNode = xAxisRef.current
    const yAxisNode = yAxisRef.current
    // if there is no width or height remove anything that might have been added to the axes
    if (!width || !height) {
      removeAllChildren(xAxisNode)
      removeAllChildren(yAxisNode)
    // if there is a width and height, but no scales, create an empty axis
    } else if (!xScale || !yScale) {
      createTicklessAxes(xAxisNode, yAxisNode, width, height, transitionDuration)
    // else create the axes
    } else {
      createAxes(xAxisNode, yAxisNode, width, xScale, yScale, transitionDuration)
    }
  })
      
  return [
    <g ref={xAxisRef} key="xAxis" transform={`translate(0, ${height ? height : 0})`} />,
    <g ref={yAxisRef} key="yAxis" />
  ]
}

Axes.defaultProps = {
  transitionDuration: 500
}

Axes.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  transitionDuration: PropTypes.number,

}

export default React.memo(Axes)
