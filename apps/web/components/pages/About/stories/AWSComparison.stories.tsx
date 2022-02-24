import React from 'react'
import { Story, Meta } from '@storybook/react'
import { AWSComparison } from '../AWSComparison'

export default {
  title: 'Components/AWSComparison',
  component: AWSComparison,
  decorators: [Story => <Story />],
  parameters: {
    layout: 'centered',
  },
} as Meta

const Template: Story = args => <AWSComparison {...args} />

export const Default = Template.bind({})
