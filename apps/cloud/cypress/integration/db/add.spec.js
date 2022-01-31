/// <reference types="cypress" />

function createTableEnding() {
  return Date.now().toString().split('').reverse().join('').slice(0, 6)
}

function deleteCreatedTable(tableName) {
  cy.getByTestId(tableName).find('a').click()
  cy.contains('Drop Table').click()
  cy.on('window:confirm', () => true)
  cy.url().should('eq', `${Cypress.config().baseUrl}/database`)
  cy.getByTestId(tableName).should('not.exist')
}

context('DB: Add', () => {
  before(() => {
    cy.viewport('macbook-15')
    cy.setCookie('micro_api_token', Cypress.env('api_key'))
    cy.visit('/database/add')
  })

  it('should create a new table when there are no tables to start', () => {
    const tableName = `test_${createTableEnding()}`
    cy.getByTestId('add-db-table-button').should('be.disabled')
    cy.getByName('tableName').type(tableName)
    cy.getByName('key').type('firstName')
    cy.getByName('value').type('John')
    cy.getByTestId('add-database-row-btn').click()
    cy.getByTestId('add-db-table-button').should('not.be.disabled').click()
    cy.url().should('eq', `${Cypress.config().baseUrl}/database`)

    deleteCreatedTable(tableName)
  })
})
