import React, { useEffect, useLayoutEffect, useRef } from 'react'
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

const createTimeSeries = function({svgNode, data, margin={}}) {
  const {width: svgWidth, height: svgHeight} = svgNode.getBoundingClientRect()

  const width = Math.floor(svgWidth) - margin.left - margin.right
  const height = Math.floor(svgHeight) - margin.top - margin.bottom

  const x = d3.scaleTime()
    .domain(d3.extent(data, d => d[0]))
    .range([0, width])

  const y = d3.scaleLinear()
    .domain(d3.extent(data, d => d[1]))
    .range([height, 0])

  const xAxis = g => g
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))

  const yAxis = g => g
    .call(d3.axisLeft(y))
    // .call(g => g.select('.domain').remove())
    // .call(g => g.select('.tick:last-of-type text').clone()
    //     .attr('x', 3)
    //     .attr('text-anchor', 'start')
    //     .attr('font-weight', 'bold')
    //     .text('test'))

  const line = d3.line()
      .defined(d => !isNaN(d[1]))
      .x(d => x(d[0]))
      .y(d => y(d[1]))

  const svg = d3.select(svgNode)
    .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

  svg.append('g')
    .call(xAxis)

  svg.append('g')
    .call(yAxis)

  svg.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 1.5)
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('d', line);
}

const updateTimeSeries = function(svgNode, data, margin) {
  removeAllChildren(svgNode)
  createTimeSeries({svgNode, data, margin})
}

const TimeSeries = ({ data, margin}) => {
  const svgRef = useRef()

  const handleUpdateTimeSeries = () => updateTimeSeries(svgRef.current, data, margin)
  
  useEffect(() => {
    const svgNode = svgRef.current
    // if there is data, make the time series
    if (data) {
      createTimeSeries({svgNode, data, margin})
      window.addEventListener('resize', handleUpdateTimeSeries)
    // if there is no data, remove anything that might have been added to the svg
    } else {
      removeAllChildren(svgNode)
    }
    // remove the event listener when things change
    return () => {
      window.removeEventListener('resize', handleUpdateTimeSeries)
    }
  })
      
  return <svg ref={svgRef} width='100%' height='100%' />
}

TimeSeries.defaultProps = {
  margin: {top: 20, right: 30, bottom: 30, left: 40}
}

export default TimeSeries
