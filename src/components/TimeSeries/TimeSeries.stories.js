import React, { useState } from 'react'
import { storiesOf } from '@storybook/react';
import { csv } from 'd3'

import TimeSeries from '.'

const DataProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    csv('/data/facebook_stock_12-03-18.csv', (d) => {
      return {...d, date: new Date(d.date)}
    }).then(data => setData(data))
  })

  return <React.Fragment>
    {React.cloneElement(children, { data })}
  </React.Fragment>
}


storiesOf('Time Series', module)
  .addDecorator(story => <div style={{ textAlign: 'center' }}>{story()}</div>)
  .add('Time Series', () => <DataProvider>
    <TimeSeries />
  </DataProvider>)

