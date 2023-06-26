/// <reference types="cypress" />

const FILTERS_OVERLAY_ID = 'explore-mobile-filters'
const FILTERS_BUTTON_ID = 'explore-select-filters'
const CLEAR_ALL_BUTTON = 'explore-clear-all-button'

function clickFiltersButton() {
  cy.getByTestId(FILTERS_BUTTON_ID).contains('Select filters')
  cy.getByTestId(FILTERS_OVERLAY_ID).should('not.be.visible')
  cy.getByTestId(FILTERS_BUTTON_ID).click()
  cy.getByTestId(FILTERS_OVERLAY_ID).should('be.visible')
}

function clickCategory(category) {
  cy.getByTestId(FILTERS_OVERLAY_ID)
    .find(`[data-test="explore-filter-${category}"]`)
    .click()
}

context('When filtering results on mobile', () => {
  beforeEach(() => {
    cy.viewport('iphone-xr')
    cy.visit('/explore')
  })

  it('should update the filters and url to match the chosen category', () => {
    clickFiltersButton()
    clickCategory('climate')
    cy.getByTestId(FILTERS_OVERLAY_ID).should('not.be.visible')
    cy.getByTestId(FILTERS_BUTTON_ID).contains('(1) category')

    cy.location().should(loc => {
      expect(loc.search).to.eq('?search=&categories=climate')
    })
  })

  it('should show the results and update the filters when selecting multiple categories', () => {
    clickFiltersButton()
    clickCategory('climate')
    cy.getByTestId(FILTERS_BUTTON_ID).click()
    clickCategory('authentication')
    cy.getByTestId(FILTERS_BUTTON_ID).contains('(2) categories')
    cy.location().should(loc => {
      expect(loc.search).to.eq('?search=&categories=climate%2Cauthentication')
    })
  })
})
