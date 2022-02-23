import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Banner } from '../Banner'

export default {
  title: 'Page Components/Home/Banner',
  component: Banner,
} as Meta

const Template: Story = args => <Banner {...args} />

export const Default = Template.bind({})
