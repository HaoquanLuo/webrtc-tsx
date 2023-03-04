/// <reference types="cypress" />

describe('should register a new account', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  // Normal register process
  it('should type the correct words into the fields', () => {
    cy.get('[data-cy="login-openModal"]').click()
    cy.get('[data-cy="register-username"]').type('test3')
    cy.get('[data-cy="register-password"]').type('123456')
    cy.get('[data-cy="register-email"]').type('test3@qq.com')
    cy.get('[data-cy="register-generateCode"]').click()

    cy.get('[data-cy="register-code"]').type('123456')
    cy.get('[data-cy="register-submit"]').click()
    cy.url().should('include', '/main')
  })
})
