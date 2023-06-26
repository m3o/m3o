/// <reference types="cypress" />
import Chance from 'chance'

const chance = new Chance()

describe('Register with email', () => {
  beforeEach(() => {
    cy.visit('/register')
  })

  it('should show the error when trying to register with a previously taken email', () => {
    cy.getByTestId('register-error').should('not.exist')
    cy.getByName('email').type(Cypress.env('EMAIL'))
    cy.getByTestId('register-button').click()
    cy.getByTestId('register-error')
      .should('exist')
      .contains('User with login exists already.')
  })

  describe('when successfully registering with a new email', () => {
    before(() => {
      cy.intercept(
        {
          method: 'POST',
          url: '/api/user/send-verification-email',
        },
        {},
      ).as('sendVerificationCode')

      cy.intercept(
        {
          url: '/api/user/verify-signup',
          method: 'POST',
        },
        {},
      ).as('verifyRegisterCode')
    })

    it('should show the verification code screen', () => {
      cy.getByTestId('verify-signup-form').should('not.exist')
      cy.getByName('email').type(chance.email())
      cy.getByTestId('register-button').click()
      cy.getByTestId('verify-signup-form').should('exist')
      cy.getByName('token').type(chance.integer({ min: 0 }))
      cy.getByName('secret').type(chance.string({ length: 8 }))
      cy.getByTestId('verify-register-button').click()
      cy.url().should(
        'eq',
        `${Cypress.config().baseUrl}/login?successful_register=true`,
      )
      cy.getByTestId('register-successful-register-alert').should('exist')
    })
  })
})
