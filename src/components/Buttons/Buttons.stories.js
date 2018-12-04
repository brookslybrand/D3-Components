import React from 'react'
import { storiesOf } from '@storybook/react'

import Buttons from '.'

storiesOf('Buttons', module)
  .add('Standard Button', () => (
    <Buttons/>
  ))