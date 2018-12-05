import React, { useRef, useLayoutEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { extent } from 'd3-array'
import { schemeCategory10  } from 'd3-scale-chromatic' // TODO: Delete
import { scaleLinear, scaleTime } from 'd3-scale'
import { select } from 'd3-selection'
import { line } from 'd3-shape'
import { transition } from 'd3-transition'

import Axes from '../Axes'

const createTimeSeries = function(gNode, data, margin, setAxisProps, transitionDuration) {
  // get the width from the main svg and compute the width and height of the visualization
  const {width: svgWidth, height: svgHeight} = gNode
    .parentElement.parentElement // a little silly to go up 2 parents, but avoids creating another ref
    .getBoundingClientRect()

  const width = Math.floor(svgWidth) - margin.left - margin.right
  const height = Math.floor(svgHeight) - margin.top - margin.bottom

  // create the transition used throughout
  const t = transition().duration(transitionDuration)

  // if there's data, create the plot
  if (data) {
    const { name, dates, series } = rationalizeData(data)

    const yData = series[0].values // TODO: change

    const xScale = scaleTime()
      .domain(extent(dates))
      .range([0, width])

    const yScale = scaleLinear()
      .domain(extent(series.reduce((arr, d) => arr.concat(d.values), [])))
      .range([height, 0])

    const createLine = line()
      .defined(d => !isNaN(d))
      .x((d, i) => xScale(dates[i]))
      .y(d => yScale(d))

    // set the axis props
    setAxisProps({ width, height, xScale, yScale })

    // select the path rendered by react
    const lines = select(gNode)
      // .select('#paths')
      .selectAll('path')
        .data(series, d => d.name)

    // EXIT
    lines.exit()
      .transition(t)
      .style('opacity', 0) // fade out the line before removing it
      .remove()

    // UPDATE
    lines
      .transition(t)
      .attr('stroke', (d, i) => schemeCategory10[i]) // update the color
      .attr('d', d => createLine(d.values)) // update the line
      .style('opacity', 1) // ensure that the line is visible in case it was interrupted

    // ENTER
    lines
      .enter().append('path') // add all the paths
      .attr('stroke', (d, i) => schemeCategory10[i]) // add the stroke
      .style('opacity', 0) // transition in the visibility of the line
      .transition(t)
      .style('opacity', 1)
      .attr('d', d => createLine(d.values)) // create the actual line

  // otherwise render empty axes
  } else {
    removeLines(gNode)
    setAxisProps({xScale: null, yScale: null})
  }

}

// TODO: Make update rely on D3's pattern
const updateTimeSeries = function(gNode, data, margin, setAxisProps, transitionDuration) {
  removeLines(gNode)
  // when resizing, don't transition
  createTimeSeries(gNode, data, margin, setAxisProps, 0)
}

const removeLines = (gNode) => select(gNode).selectAll('path').remove()

const TimeSeries = ({ data, margin, transitionDuration }) => {
  const gRef = useRef()
  
  // props for rendering the axes
  const [axisProps, setAxisProps] = useState({width: null, height: null, xScale: null, yScale: null})
  // merge together new props with old props
  const handleSetAxisProps = newAxisProps => setAxisProps(prevAxisProps => ({...prevAxisProps, ...newAxisProps}))

  const handleUpdateTimeSeries = () => updateTimeSeries(gRef.current, data, margin, handleSetAxisProps, transitionDuration)
  
  useLayoutEffect(() => {
    const gNode = gRef.current

    createTimeSeries(gNode, data, margin, handleSetAxisProps, transitionDuration)
    window.addEventListener('resize', handleUpdateTimeSeries)

    // remove the event listener when dismounting
    return () => {
      window.removeEventListener('resize', handleUpdateTimeSeries)
    }
  }, [data, margin])
      
  return (
    <svg width='100%' height='100%'>
      <g transform={`translate(${margin.left},${margin.top})`}>
        <Axes {...axisProps} />
        <g ref={gRef}
          fill="none"
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          style={{mixBlendMode: 'multiply'}}
        />
      </g>
    </svg>
  )
}

// fill in the default values for any data properties not provided
const rationalizeData = data => {
  const name = data.name ? data.name : ''
  const series = data.series.map((d, i) => d.name ? d : {...d, name: String(i)})

  return {...data, name, series}
}

TimeSeries.defaultProps = {
  margin: {top: 0, right: 0, bottom: 0, left: 0},
  axes: true,
  transitionDuration: 500
}

TimeSeries.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string,
    series: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      values: PropTypes.arrayOf(PropTypes.number).isRequired
    })).isRequired,
    dates: PropTypes.arrayOf(PropTypes.instanceOf(Date)).isRequired
  }),
  margin: PropTypes.shape({
    top: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number
  }),
  axes: PropTypes.bool,
  transitionDuration: PropTypes.number
}

export default TimeSeries
