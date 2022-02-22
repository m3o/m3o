import React from 'react'
import { Story, Meta } from '@storybook/react'
import { ServicesGrid, ServicesGridProps } from '../ServicesGrid'
import servicesFixture from '@/lib/fixtures/apis/services-fixtures.json'

export default {
  title: 'Components/ServicesGrid',
  component: ServicesGrid,
} as Meta

const Template: Story<ServicesGridProps> = args => <ServicesGrid {...args} />

export const Default = Template.bind({})

Default.args = {
  services: servicesFixture,
}
