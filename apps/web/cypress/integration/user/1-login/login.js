/// <reference types="cypress" />

const EMAIL = Cypress.env('EMAIL')
const PASSWORD = Cypress.env('PASSWORD')

if (!EMAIL || !PASSWORD) {
  throw new Error(
    'You must provide CYPRESS_USER_EMAIL and CYPRESS_USER_PASSWORD environment variables',
  )
}

function login(email = EMAIL, password = PASSWORD) {
  cy.get('[name="email"]').type(email)
  cy.get('[name="password"]').type(password)
  cy.contains('Submit').click()
}

describe('Logging in a previously signed up user', () => {
  it('should login the user when passing the correct details', () => {
    cy.visit('/login')
    login()
    cy.url().should('eq', Cypress.config().baseUrl)
  })

  it('should show the error box when an unsuccessful login is made', () => {
    cy.visit('/login')
    login(EMAIL, 'random password')
    cy.contains('Secret not correct')
  })

  it('should hide the successfully registered banner when there is a login error', () => {
    cy.visit('/login?successful_register=true')
    cy.getByTestId('login-error-alert').should('not.exist')
    cy.getByTestId('register-successful-register-alert').should('exist')
    login('fake@email.net', 'password')
    cy.getByTestId('register-successful-register-alert').should('not.exist')
    cy.getByTestId('login-error-alert')
      .contains('Account not found with this ID')
      .should('exist')
  })
})
