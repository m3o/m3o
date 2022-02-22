import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Service } from '../Service/Service'
import apiFixture from '@/lib/fixtures/apis/api-fixture.json'

export default {
  title: 'Components/Service',
  component: Service,
  decorators: [
    Story => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
} as Meta

const Template: Story<ExploreAPI> = args => <Service {...args} />

export const Default = Template.bind({})

Default.args = apiFixture
