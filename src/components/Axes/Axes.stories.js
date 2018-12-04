import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { storiesOf } from '@storybook/react';
import { csv, scaleTime, scaleLinear, extent } from 'd3'

import Axes from '.'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  > div {
    width: 70%
    height: 80vh
  }
`

const Button = styled.button`

  &{
    background-color: white; 
    border: 2px solid #008CBA;
    color: black; 
    padding: 0.8rem 1.4rem;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 1rem 0.8rem;
    -webkit-transition-duration: 0.4s; /* Safari */
    transition-duration: 0.4s;
    cursor: pointer;
  }

  &:hover {
      background-color: #008CBA;
      color: white;
  }

  &:focus {
    outline:0;
  }
`

// children is the TimeSeries component passed down,
// keys is the keys to get the data
const DataProvider = ({ children, keys }) => {
  // set a ref for the svg
  const svgRef = useRef()
  const gRef = useRef()
  // set the props to the state
  const [props, setProps] = useState()

  useEffect(() => {
    fetchData()
  }, [svgRef.current])

  const margin = {top: 20, right: 30, bottom: 30, left: 40}

  // function for fetching the data and setting it as the state
  // get the props for the axis
  // a bit dirty, but it's fine for the storybook
  function fetchData() {
    csv('./data/facebook_stock_12-03-18.csv', (d) => {
      const { date } = d      
      return [new Date(date)].concat(keys.map(key => Number.parseFloat(d[key])))
    }).then(data => {
      if (svgRef.current) {
        const {width: svgWidth, height: svgHeight} = svgRef.current.getBoundingClientRect()
        const width = Math.floor(svgWidth) - margin.left - margin.right
        const height = Math.floor(svgHeight) - margin.top - margin.bottom

        const xScale = scaleTime()
          .domain(extent(data, d => d[0]))
          .range([0, width])

        const yScale = scaleLinear()
          .domain(extent(data, d => d[1]))
          .range([height, 0])

        setProps({ width, height, xScale, yScale})
      }
    })
  }

  // render the axis
  return (<>
    <Button onClick={fetchData}>Add Data</Button>
    <Button onClick={() => setData(null)}>Remove Data</Button>
    <svg ref={svgRef} width='100%' height='100%'>
      <g ref={gRef} transform={`translate(${margin.left},${margin.top})`}>
        { props ? React.cloneElement(children, props) : null }
      </g>
    </svg>
  </>)
}


storiesOf('Axes', module)
  .addDecorator(story => <Container><div>{story()}</div></Container>)
  .add('Axes with Time', () => (
    <DataProvider keys={['adjClose']}>
      <Axes />
    </DataProvider>
  ))
  // .add('Multi Line', () => (
  //   <div>Test</div>
  // ))
  // .add('Transitions', () => (
  //   <div>Test</div>
  // ))
  // .add('Adjusting Props', () => (
  //   <div>Test</div>
  // ))

