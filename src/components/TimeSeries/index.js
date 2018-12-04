import React, { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { extent } from 'd3-array'
import { scaleLinear, scaleTime } from 'd3-scale'
import { select } from 'd3-selection'
import { line } from 'd3-shape'

import Axes from '../Axes'

const createTimeSeries = function(svgNode, gNode, data, margin, setAxisProps) {
  const {width: svgWidth, height: svgHeight} = svgNode.getBoundingClientRect()

  const width = Math.floor(svgWidth) - margin.left - margin.right
  const height = Math.floor(svgHeight) - margin.top - margin.bottom

  // if there's data, create the plot
  if (data) {
    const xScale = scaleTime()
      .domain(extent(data, d => d[0]))
      .range([0, width])

    const yScale = scaleLinear()
      .domain(extent(data, d => d[1]))
      .range([height, 0])

    const createLine = line()
      .defined(d => !isNaN(d[1]))
      .x(d => xScale(d[0]))
      .y(d => yScale(d[1]))

    // set the axis props
    setAxisProps({ width, height, xScale, yScale })

    // select the path rendered by react
    select(gNode)
      .append('path')
      .attr('class', 'path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('d', createLine)

  // otherwise render empty axes
  } else {
    removeLines(gNode)
    setAxisProps({width, height, xScale: null, yScale: null})
  }

}

// TODO: Make update rely on D3's pattern
const updateTimeSeries = function(svgNode, gNode, data, margin, setAxisProps) {
  removeLines(gNode)
  createTimeSeries(svgNode, gNode, data, margin, setAxisProps)
}

const removeLines = (gNode) => select(gNode).selectAll('.path').remove()

const TimeSeries = ({ data, margin }) => {
  const svgRef = useRef()
  const gRef = useRef()
  
  // props for rendering the axes
  const [axisProps, setAxisProps] = useState({width: null, height: null, xScale: null, yScale: null})
  // merge together new props with old props
  const handleSetAxisProps = newAxisProps => setAxisProps(prevAxisProps => ({...prevAxisProps, ...newAxisProps}))

  const handleUpdateTimeSeries = () => updateTimeSeries(svgRef.current, gRef.current, data, margin, handleSetAxisProps)
  
  useEffect(() => {
    const svgNode = svgRef.current
    const gNode = gRef.current

    createTimeSeries(svgNode, gNode, data, margin, handleSetAxisProps)
    window.addEventListener('resize', handleUpdateTimeSeries)

    // remove the event listener when dismounting
    return () => {
      window.removeEventListener('resize', handleUpdateTimeSeries)
    }
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
  data: PropTypes.arrayOf(PropTypes.array),
  margin: PropTypes.shape({
    top: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number
  }),
  axes: PropTypes.bool
}

export default TimeSeries
