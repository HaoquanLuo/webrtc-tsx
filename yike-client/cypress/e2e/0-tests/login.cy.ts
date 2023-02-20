/// <reference types="cypress" />

describe('should login to server', () => {
  beforeEach(() => {
    cy.visit('/')
  })
  it('should type the correct words into the fields', () => {
    cy.get('[data-cy="login-username"]').type('ffxixslh')
    cy.get('[data-cy="login-password"]').type('123456')
    cy.pause()

    cy.get('[data-cy="login-code"]').should('have.value')
  })
})
