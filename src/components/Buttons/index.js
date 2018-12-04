import React from 'react'

import styled from 'styled-components'

const StandardButton = styled.button`
  width: 6rem;
  height: 3rem;
  border: 0.1rem solid #9C7E8D;
  margin: 1rem;
  color: #E69FA3;
  font-size: 1.3rem;
  font-weight: 400;
  -webkit-transition-duration: 0.4s; /* Safari */
  transition-duration: 0.4s;

  &:hover{
    border: 0.2rem solid #9C7E8D;
  }
`

const StandardButtonHovered = styled.button`
  width: 6rem;
  height: 3rem;
  border: 0.2rem solid #9C7E8D;
  margin: 1rem;
  color: #E69FA3;
  font-size: 1.3rem;
  font-weight: 400;
`

const StandardButtonClicked = styled.button`
  width: 6rem;
  height: 3rem;
  background-color: #E69FA3;
  border: 0.2rem solid #9C7E8D;
  margin: 1rem;
  color: #DCD5D8;
  font-size: 1.3rem;
  font-weight: 400;
`

const Buttons = () => {

  return (
    <div>
      <StandardButton>Test</StandardButton>
      <StandardButtonHovered>Test</StandardButtonHovered>
      <StandardButtonClicked>Test</StandardButtonClicked>
    </div>
  )
}

export default Buttons