import React, { useState } from 'react'
import styled from 'styled-components'
import { storiesOf } from '@storybook/react';
import { csv } from 'd3'

import TimeSeries from '.'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  > div {
    width: 50%
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

const DataProvider = ({ children }) => {
  const [data, setData] = useState()

  const fetchData = () => {
    csv('/data/facebook_stock_12-03-18.csv', (d) => {
      const {date, adjClose} = d
      return [new Date(date), adjClose]
    }).then(data => setData(data))
  }

  return (<>
    <Button onClick={fetchData}>Add Data</Button>
    <Button onClick={() => setData(null)}>Remove Data</Button>
    {React.cloneElement(children, { data })}
  </>)
}


storiesOf('Time Series', module)
  .addDecorator(story => <Container><div>{story()}</div></Container>)
  .add('Single Line', () => (
    <DataProvider>
      <TimeSeries />
    </DataProvider>
  ))

