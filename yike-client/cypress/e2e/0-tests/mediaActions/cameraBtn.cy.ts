/// <reference types="cypress" />

describe('should create room', () => {
  // Normal create room process
  it('should type the correct words into the fields', () => {
    cy.visit('/')
    cy.get('[data-cy="login-username"]').type('ffxixslh')
    cy.get('[data-cy="login-password"]').type('123456')
    cy.get('[data-cy="login-code"]').type('12')
    cy.get('[data-cy="login-submit"]').click()

    cy.url().should('include', '/main')

    cy.get('[data-cy="room-create"]').click()
    cy.get('[data-cy="room-modal"]').should('be.visible')
    cy.get('[data-cy="room-switch"]').click()

    // click submit button
    cy.get('.ant-modal-footer > .ant-btn-primary:last').click()

    cy.url().should('include', '/room')

    cy.wait(1000)

    cy.get('[data-cy="btn-camera"]').click()
  })
})
