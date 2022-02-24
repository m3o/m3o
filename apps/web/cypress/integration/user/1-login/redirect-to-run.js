/// <reference types="cypress" />

const email = Cypress.env('EMAIL')
const password = Cypress.env('PASSWORD')

if (!email || !password) {
  throw new Error(
    'You must provide CYPRESS_EMAIL and CYPRESS_USER_PASSWORD environment variables',
  )
}

const API_CONSOLE_URL = '/app/console'

describe('When the user is not logged in and they click "run"', () => {
  beforeEach(() => {
    cy.visit(API_CONSOLE_URL)
  })

  it('redirect to the console page when the user logs in', () => {
    cy.get('[data-testid=console-run]').click()
    cy.get('[name=email]').type(email)
    cy.get('[name=password]').type(password)
    cy.get('[data-testid=login-submit]').click()
    cy.url().should('eq', `${Cypress.config().baseUrl}${API_CONSOLE_URL}`)
  })
})
