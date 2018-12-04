import React, { useState } from 'react'
import styled from 'styled-components'
import { storiesOf } from '@storybook/react'
import { csv } from 'd3'

import TimeSeries from '.'

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
  // load the data initially
  const [data, setData] = useState(() => fetchData())

  // function for fetching the data and setting it as the state
  function fetchData() {
    csv('./data/facebook_stock_12-03-18.csv', (d) => {
      // parse the dates
      const date = new Date(d.date)
      // parse all the values 
      const values = Object.keys(d)
        .filter(key => key !== 'date')
        .reduce((obj, key) => ({...obj, [key]: Number.parseFloat(d[key])}), {})
      // return the new object
      return { date , ...values}
    }).then(function(data) {
      // get the dates
      const dates = data.map(d => d.date)

      // get the series values
      const series = keys.map(key => ({
        name: 'Adjusted Close',
        values: data.map(d => d[key])
      }))

      setData({ dates, series })
    })
  }

  return (<>
    <Button onClick={fetchData}>Add Data</Button>
    <Button onClick={() => setData(null)}>Remove Data</Button>
    {React.cloneElement(children, { data })}
  </>)
}

const margin = {top: 20, right: 30, bottom: 30, left: 40}


storiesOf('Time Series', module)
  .addDecorator(story => <Container><div>{story()}</div></Container>)
  .add('Single Line', () => (
    <DataProvider keys={['adjClose']}>
      <TimeSeries margin={margin}/>
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

