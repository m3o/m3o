import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Licenses } from '../Licenses'

export default {
  title: 'Page Components/Api/Licenses',
  component: Licenses,
} as Meta

const Template: Story = args => <Licenses {...args} />

export const Default = Template.bind({})
