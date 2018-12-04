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
const DataProvider = ({ children, datasets, keys }) => {
  // an object that lets the checkboxes know which ones are selected
  const [selectedDatasets, setSelectedDatasets] = useState(
    datasets.reduce((obj, dataset) => ({...obj, [dataset]: true}), {})
  )
  // load the data initially
  const [data, setData] = useState(() => fetchData(Object.keys(selectedDatasets).filter(key => selectedDatasets[key])))

  // function for fetching the data and setting it as the state
  // this is not optimized, just trying to get stuff working
  function fetchData(datasets) {
    if (datasets.length) {
      const datasetPromise = datasets.map(dataset => {
        return csv(`./data/${dataset}`, (d) => {
          // parse the dates
          const date = d.date // new Date(d.date)
          // parse all the values 
          const values = new Map(
            Object.keys(d)
              .filter(key => key !== 'date')
              .map(key => [key, Number.parseFloat(d[key])])
            )
          // return the new object
          return [date , values]
        }).then(data => new Map(data))
      })
  
      Promise.all(datasetPromise)
        .then(function(datasetMaps) {
          // get the dates
          const combinedData = datasetMaps.reduce((obj, data, i) => {
            // join all the unique dates
            const dates = Array.from(new Set([...obj.dates, ...Array.from(data.keys())]))
              // sort in ascending order
              .sort((a, b) => a - b)
  
            const values = dates.map(date => data.has(date) ? data.get(date) : null)
  
            // get the series values
            const series = keys.map(key => ({
              name: datasets[i].replace('.csv', ''),
              values: values.map(d => d.has(key) ? d.get(key) : null)
            }))
  
            return {...obj, dates, series: obj.series.concat(series)}
          }, {name: 'Stocks', dates: [], series: []})
  
          setData({...combinedData, dates: combinedData.dates.map(d => new Date(d))})
        })
    } else {
      setData(null)
    }

    
  }

  const handleSetSelectedDatasets = (dataset) => {
    setSelectedDatasets(prevSelectedDatasets => {
      const newSelectedDatasets = {...prevSelectedDatasets, [dataset]: !prevSelectedDatasets[dataset]}
      fetchData(
        Object.keys(newSelectedDatasets).filter(key => newSelectedDatasets[key])
      )
      return newSelectedDatasets
    })
  }

  return (<>
    {
      datasets.map(dataset => (
        <span key={dataset}>
            <input
              type="checkbox" name={dataset} value={dataset}
              checked={selectedDatasets[dataset]}
              onChange={() => handleSetSelectedDatasets(dataset)}
            />
            {dataset.replace('.csv', '')}
        </span>
      ))
    }
    {React.cloneElement(children, { data })}
  </>)
}

const margin = {top: 20, right: 30, bottom: 30, left: 40}


storiesOf('Time Series', module)
  .addDecorator(story => <Container><div>{story()}</div></Container>)
  .add('Single Line', () => (
    <DataProvider datasets={['FB.csv']} keys={['adjClose']}>
      <TimeSeries margin={margin}/>
    </DataProvider>
  ))
  .add('Multi Line', () => (
    <DataProvider datasets={['FB.csv', 'GOOG.csv', 'AMZN.csv']} keys={['adjClose']}>
      <TimeSeries margin={margin}/>
    </DataProvider>
  ))
  // .add('Transitions', () => (
  //   <div>Test</div>
  // ))
  // .add('Adjusting Props', () => (
  //   <div>Test</div>
  // ))

