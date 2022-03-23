import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { FunctionEditSource } from '../../../components/pages/Cloud/Functions/FunctionEditSource'

export default {
  title: 'Cloud/Functions/FunctionEditSource',
  component: FunctionEditSource,
} as ComponentMeta<typeof FunctionEditSource>

const Template: ComponentStory<typeof FunctionEditSource> = args => (
  <FunctionEditSource {...args} />
)

export const Default = Template.bind({})
Default.args = {
  func: {
    name: 'testfunction',
    runtime: 'nodejs16',
    url: 'http://google.com',
    status: 'Deployed',
    source: `
    /**
     * Responds to any HTTP request.
     *
     * @param {!express:Request} req HTTP request context.
     * @param {!express:Response} res HTTP response context.
     */
    exports.helloworld = (req, res) => {
      let message = req.query.message || req.body.message || '{"message": "Hello World!"}';
      res.status(200).send(message);
    };`,
  },
}
