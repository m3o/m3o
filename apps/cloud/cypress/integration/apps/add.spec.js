/// <reference types="cypress" />

context('Apps: Add', () => {
  before(() => {
    cy.setCookie('micro_api_token', Cypress.env('api_key'))

    cy.intercept(
      {
        method: 'POST',
        url: 'https://api.m3o.com/v1/app/Run'
      },
      {}
    ).as('runApp')
  })

  beforeEach(() => {
    cy.visit('/apps/add')
  })

  it('create the app and return the application to the apps page.', () => {
    cy.get('[name=name]').type('helloworld')
    cy.get('[name=repo]').type('github.com/asim/helloworld')
    cy.get('[name=port]').type(8080)
    cy.get('[name=branch]').type('master')
    cy.get('[name=region]').select('europe-west1')
    cy.get('button[type=submit]').click()
    cy.getByTestId('toast').should('not.be.visible')
    cy.url().should('eq', `${Cypress.config().baseUrl}/apps`)
    cy.getByTestId('toast').should('be.visible')
  })
})
