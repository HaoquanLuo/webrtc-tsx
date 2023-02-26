/// <reference types="cypress" />

describe('it should type and submit a message', () => {
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

    // click submit button
    cy.get('.ant-modal-footer > .ant-btn-primary:last').click()

    // check in room
    cy.url().should('include', '/room')

    cy.wait(1000)

    // type in textarea
    cy.get('[data-cy="chat-area"]').type('hello world')

    cy.wait(1000)

    // submit the public message
    cy.get('[data-cy="chat-submit"]').click()

    cy.wait(1000)

    // check message in the messageBox
    cy.get('[data-cy="chat-messageBox"]').contains('hello world')
  })
})
