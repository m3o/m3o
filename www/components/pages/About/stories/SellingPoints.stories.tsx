import React from 'react'
import { Story, Meta } from '@storybook/react'
import { SellingPoints } from '../SellingPoints'

export default {
  title: 'Page Components/Home/Selling Points',
  component: SellingPoints,
  decorators: [Story => <Story />],
  parameters: {
    layout: 'centered',
  },
} as Meta

const Template: Story = args => <SellingPoints {...args} />

export const Default = Template.bind({})
