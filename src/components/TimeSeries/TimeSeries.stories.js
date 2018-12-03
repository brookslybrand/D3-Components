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

const DataProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    csv('/data/facebook_stock_12-03-18.csv', (d) => {
      const {date, adjClose} = d
      return [new Date(date), adjClose]
    }).then(data => setData(data))
  })

  return React.cloneElement(children, { data })
}


storiesOf('Time Series', module)
  .addDecorator(story => <Container><div>{story()}</div></Container>)
  .add('Time Series', () => <DataProvider>
    <TimeSeries />
  </DataProvider>)

