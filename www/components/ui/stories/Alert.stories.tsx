import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Alert, Props } from '../Alert'

export default {
  title: 'Components/Alert',
  component: Alert,
} as Meta

const Template: Story<Props> = args => (
  <Alert {...args}>This is some really really really long alert text</Alert>
)

export const Success = Template.bind({})

export const Error = Template.bind({})
Error.args = {
  type: 'error',
}

export const Warning = Template.bind({})
Warning.args = {
  type: 'warning',
}
