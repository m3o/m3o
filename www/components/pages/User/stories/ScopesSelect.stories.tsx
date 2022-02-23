import React from 'react'
import { Story, Meta } from '@storybook/react'
import { ScopesSelect, Props } from '../ScopesSelect'

export default {
  title: 'Page Components/Account/ScopesSelect',
  component: ScopesSelect,
} as Meta

const Template: Story<Props> = args => <ScopesSelect {...args} />

export const Default = Template.bind({})
Default.args = {
  options: ['address', 'crypto'],
  selectedOptions: [],
}

export const WithSelectedScopes = Template.bind({})
WithSelectedScopes.args = {
  options: ['address', 'crypto'],
  selectedOptions: ['address', 'crypto'],
}
