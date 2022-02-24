import React from 'react'
import { rest } from 'msw'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Story, Meta } from '@storybook/react'
import userFixture from '@/lib/fixtures/user/user-fixture.json'
import { UserProvider } from '@/providers'
import { Header } from '../Header/Header'

const queryClient = new QueryClient()

export default {
  title: 'Components/Header',
  component: Header,
} as Meta

const WithoutUser: Story = args => (
  <QueryClientProvider client={queryClient}>
    <Header {...args} />
  </QueryClientProvider>
)

const WithUser: Story = args => (
  <QueryClientProvider client={queryClient}>
    <UserProvider user={userFixture}>
      <Header {...args} />
    </UserProvider>
  </QueryClientProvider>
)

export const Default = WithoutUser.bind({})
export const LoggedIn = WithUser.bind({})

LoggedIn.parameters = {
  msw: [
    rest.post('https://api.m3o.com/balance/Current', (req, res, ctx) => {
      return res(
        ctx.json({
          current_balance: '339625000',
        }),
      )
    }),
  ],
}
