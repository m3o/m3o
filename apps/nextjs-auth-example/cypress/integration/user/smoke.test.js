/// <reference types="cypress" />

import Chance from 'chance'

const chance = new Chance()
const EMAIL = Cypress.env('USER_EMAIL')
const PASSWORD = Cypress.env('USER_PASSWORD')

if (!EMAIL || !PASSWORD) {
  throw new Error(
    'You must provide CYPRESS_USER_EMAIL and CYPRESS_USER_PASSWORD environment variables'
  )
}

function login(email = EMAIL, password = PASSWORD) {
  cy.get('[data-testid=login]').click()
  cy.get('[name=email]').type(email)
  cy.get('[name=password]').type(password)
  cy.get('[data-testid=submit-button').click()
  cy.url().should('eq', `${Cypress.config().baseUrl}/`)
  cy.get('[data-testid=logged-in-email]').contains(email)
  cy.get('[data-testid=login]').should('not.exist')
  cy.get('[data-testid=logout]').should('exist')
}

describe('smoke tests', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/user/send-password-reset-email', {
      statusCode: 200,
      body: {}
    }).as('sendPasswordResetEmail')

    cy.intercept('POST', '/api/user/reset-password', {
      statusCode: 200,
      body: {}
    }).as('resetPassword')
  })

  it('should login and provider the username on the landing page', () => {
    cy.visit('/')
    login()
    cy.get('[data-testid=logged-in-email]').contains(EMAIL)
    cy.get('[data-testid=login]').should('not.exist')
    cy.get('[data-testid=logout]').should('exist')
  })

  it('should register a new user', () => {
    cy.visit('/sign-up')
    const email = chance.email()
    const password = chance.string({ length: 8 })
    cy.get('[name="profile.firstName"]').type(chance.first())
    cy.get('[name="profile.lastName"]').type(chance.last())
    cy.get('[name=email]').type(email)
    cy.get('[name=password]').type(password)
    cy.get('[data-testid=sign-up-button]').click()
    cy.url().should('eq', `${Cypress.config().baseUrl}/`)
    login(email, password)
  })

  it('should show the correct errors on the login screen', () => {
    cy.visit('/')
    cy.get('[data-testid=login]').click()
    cy.get('[name=email]').type(EMAIL)
    cy.get('[name=password]').type(PASSWORD + '1')
    cy.get('[data-testid=submit-button').click()
    cy.get('.error-alert').contains('Incorrect password')
  })

  it('should not allow unauthorized users to view the "private-server" page', () => {
    cy.visit('/private-server')
    cy.url().should('eq', `${Cypress.config().baseUrl}/`)
  })

  it('should not allow unauthorized users to view the "private-client" page', () => {
    cy.visit('/private-client')
    cy.url().should('eq', `${Cypress.config().baseUrl}/`)
  })

  it('should allow authorized users to view the "private-server" page', () => {
    login()
    cy.visit('/private-server')
    cy.url().should('eq', `${Cypress.config().baseUrl}/private-server`)
  })

  it('should allow authorized users to view the "private-client" page', () => {
    cy.visit('/')
    login()
    cy.visit('/private-client')
    cy.url().should('eq', `${Cypress.config().baseUrl}/private-client`)
  })
})
