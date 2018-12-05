import React from 'react'

import styled from 'styled-components'

const StandardButton = styled.button`
  width: 8rem;
  height: 4rem;
  border: 0.12rem solid #9C7E8D;
  background-color: white;
  color: #9C7E8D;
  font-family: 'Josefin Sans';
  font-size: 2rem;
  font-weight: 300;
  -webkit-transition-duration: 0.4s; /* Safari */
  transition-duration: 0.4s;
  position: relative;
  overflow: hidden;

  &:hover{
    background-color: #E69FA3; /* For browsers that do not support gradients. Also creates a nice flicker when removing the hover. */
    background-image: linear-gradient(to right, #E69FA3, #EBB2B5, white);
    color: #F0EBEB;
  }

  &:focus {
    outline:0;
  }

  &:after {
    content: "";
    background: #F0EBEB;
    display: block;
    position: absolute;
    padding-top: 300%;
    padding-left: 350%;
    margin-left: -20px !important;
    margin-top: -120%;
    opacity: 0;
    transition: all 1s;
  }

  &:active:after {
    opacity: 0.75;
    transition: 0s
  }
`

const Buttons = () => {

  return (
    <div>
      <StandardButton>Test</StandardButton>
    </div>
  )
}

export default Buttons