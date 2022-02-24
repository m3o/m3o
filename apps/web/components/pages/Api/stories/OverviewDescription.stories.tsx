import React from 'react'
import { Story, Meta } from '@storybook/react'
import { OverviewDescription } from '../OverviewDescription'

export default {
  title: 'Page Components/Api/OverviewDescription',
  component: OverviewDescription,
} as Meta

const Template: Story = args => <OverviewDescription {...args} />

export const Default = Template.bind({})
Default.args = {
  children: `Address lookup by postcode

  # Address Service
  
  Lookup UK addresses by postcode. Simply provide a valid postcode and get a full list of addresses.
  
  Powered by [ideal-postcodes.co.uk](https://ideal-postcodes.co.uk/).
  `,
}
