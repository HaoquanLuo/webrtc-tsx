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

    cy.get('[data-cy="room-join"]').click()
    cy.get('[data-cy="room-modal"]').should('be.visible')

    // type room id into inputBox
    cy.get('[data-cy="room-id"]').type('186da3a7-7c6d-437b-b77c-c7886aaceb1c')

    // click submit button
    cy.get('.ant-modal-footer > .ant-btn-primary:last').click()

    // check in room
    cy.url().should('include', '/room')

    cy.wait(1000)

    // select a user to start direct chat
    cy.get('[data-cy="chat-directChat"]').click()

    cy.wait(1000)

    // type in textarea
    cy.get('[data-cy="chat-area"]').type('hello I am ffxixslh')

    cy.wait(1000)

    // submit the public message
    cy.get('[data-cy="chat-submit"]').click()

    // check message in the messageBox
    cy.get('[data-cy="chat-messageBox"]').contains('hello I am ffxixslh')
  })
})
