import React from 'react'
import { Story, Meta } from '@storybook/react'
import { AboutUs } from '../AboutUs'

export default {
  title: 'Page Components/Home/AboutUs',
  component: AboutUs,
} as Meta

const Template: Story = args => <AboutUs {...args} />

export const Default = Template.bind({})
