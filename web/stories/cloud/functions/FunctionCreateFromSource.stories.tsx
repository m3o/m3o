import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { FunctionCreateFromSource } from '../../../components/pages/Admin/Functions/FunctionCreateFromSource'

export default {
  title: 'Cloud/Functions/FunctionCreateFromSource',
  component: FunctionCreateFromSource,
} as ComponentMeta<typeof FunctionCreateFromSource>

const Template: ComponentStory<typeof FunctionCreateFromSource> = args => (
  <FunctionCreateFromSource {...args} />
)

export const Default = Template.bind({})
Default.args = {}
