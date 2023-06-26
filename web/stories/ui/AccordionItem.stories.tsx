import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { AccordionItem } from '../../components/ui/AccordionItem'

export default {
  title: 'UI/AccordionItem',
  component: AccordionItem,
} as ComponentMeta<typeof AccordionItem>

const Template: ComponentStory<typeof AccordionItem> = args => (
  <div className="p-10">
    <AccordionItem {...args} />
  </div>
)

export const Default = Template.bind({})
Default.args = {
  title: 'This is the accordion title',
  children:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit dolorem aut, quia aperiam necessitatibus, consequuntur itaque consequatur nihil sint eos magnam quibusdam excepturi adipisci velit ex saepe pariatur perspiciatis labore?',
}
