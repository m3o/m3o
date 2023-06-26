/// <reference types="cypress" />
import { SessionStorageKeys } from '../../../../lib/constants'

describe('As a new user who registers by email', () => {
  describe('and I click the pro subscription', () => {
    before(() => {
      cy.visit('/')
    })

    it('should register the user and send them through the subscription flow', () => {
      cy.getByTestId('subscription-pro-start-button').click()
      cy.url().should(
        'eq',
        `${Cypress.config().baseUrl}/login?subscription=pro`,
      )
      // TODO: Test subscription is in local storage.
      cy.getByName('email').type(Cypress.env('EMAIL'))
      cy.getByName('password').type(Cypress.env('PASSWORD'))
      cy.getByTestId('login-submit').click()
      cy.url().should(
        'eq',
        `${Cypress.config().baseUrl}/subscriptions/pro/card-details`,
      )
    })
  })
})
