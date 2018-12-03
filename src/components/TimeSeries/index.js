import React from 'react'

const TimeSeries = ({ data }) => {
  console.log(data)
  return (
    <div>
      {data ? Object.keys(data).length : data}
    </div>
  )
}

export default TimeSeries
