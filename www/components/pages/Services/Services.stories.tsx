import React from 'react'
import { Story, Meta } from '@storybook/react'
import servicesFixture from '@/lib/fixtures/apis/services-fixtures.json'
import { Services, ServicesProps } from '.'

export default {
  title: 'Page Components/Home/Services',
  component: Services,
} as Meta

const Template: Story<ServicesProps> = args => <Services {...args} />

export const Default = Template.bind({})

Default.args = {
  services: servicesFixture,
}
