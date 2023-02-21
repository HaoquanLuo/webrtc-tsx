/// <reference types="cypress" />

describe('should login to server', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  // Normal login process
  it('should type the correct words into the fields', () => {
    cy.get('[data-cy="login-username"]').type('ffxixslh')
    cy.get('[data-cy="login-password"]').type('123456')
    cy.get('[data-cy="login-code"]').type('12')
    cy.get('[data-cy="login-submit"]').click()

    cy.url().should('include', '/main')
  })
})
