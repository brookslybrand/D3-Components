import React, { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'

import Axes from '../Axes'

// TODO: move to another folder
function removeAllChildren(node) {
  // as long as a node has a child, remove it
  // credit: https://stackoverflow.com/questions/683366/remove-all-the-children-dom-elements-in-div
  while (node.hasChildNodes()) {
    node.removeChild(node.lastChild);
  }
}

const createTimeSeries = function(svgNode, gNode, data, margin, setAxisProps) {
  const {width: svgWidth, height: svgHeight} = svgNode.getBoundingClientRect()

  const width = Math.floor(svgWidth) - margin.left - margin.right
  const height = Math.floor(svgHeight) - margin.top - margin.bottom

  const xScale = d3.scaleTime()
    .domain(d3.extent(data, d => d[0]))
    .range([0, width])

  const yScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d[1]))
    .range([height, 0])

  const line = d3.line()
      .defined(d => !isNaN(d[1]))
      .x(d => xScale(d[0]))
      .y(d => yScale(d[1]))

  const svg = d3.select(gNode)

  // set the axis props
  setAxisProps({ width, height, xScale, yScale })

  svg.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 1.5)
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('d', line);
}

const updateTimeSeries = function(svgNode, gNode, data, margin) {
  removeAllChildren(gNode)
  createTimeSeries(svgNode, gNode, data, margin, setAxisProps)
}

const TimeSeries = ({ data, margin}) => {
  const svgRef = useRef()
  const gRef = useRef()
  
  // props for rendering the axes
  const [axisProps, setAxisProps] = useState({width: null, height: null, xScale: null, yScale: null})

  const handleUpdateTimeSeries = () => updateTimeSeries(svgRef.current, gRef.current, data, margin)
  
  useEffect(() => {
    const svgNode = svgRef.current
    const gNode = gRef.current
    // if there is data, make the time series
    if (data) {
      createTimeSeries(svgNode, gNode, data, margin, setAxisProps)
      // window.addEventListener('resize', handleUpdateTimeSeries)
    // if there is no data, remove anything that might have been added to the svg
    } else {
      // removeAllChildren(gNode)
    }
    // remove the event listener when things change
    // return () => {
    //   window.removeEventListener('resize', handleUpdateTimeSeries)
    // }
  }, [data, margin])
      
  return (
    <svg ref={svgRef} width='100%' height='100%'>
      <g ref={gRef} transform={`translate(${margin.left},${margin.top})`}>
        <Axes {...axisProps} />
      </g>
    </svg>
  )

}

TimeSeries.defaultProps = {
  margin: {top: 0, right: 0, bottom: 0, left: 0},
  axes: true
}

TimeSeries.propTypes = {
  margin: PropTypes.shape({
    top: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number
  }),
  axes: PropTypes.bool
}

export default TimeSeries
