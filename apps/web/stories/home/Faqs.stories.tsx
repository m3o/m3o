import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Faqs } from '../../components/pages/Home'

export default {
  title: 'Home/Faqs',
  component: Faqs,
} as ComponentMeta<typeof Faqs>

const Template: ComponentStory<typeof Faqs> = () => (
  <div className="p-10">
    <Faqs />
  </div>
)

export const Default = Template.bind({})
Default.args = {}
