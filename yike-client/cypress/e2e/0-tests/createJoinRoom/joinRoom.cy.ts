/// <reference types="cypress" />

const RoomId = ''

describe('should create room', () => {
  // Normal create room process
  it('should type the correct words into the fields', () => {
    // login
    cy.visit('/')
    cy.get('[data-cy="login-username"]').type('ffxixslh')
    cy.get('[data-cy="login-password"]').type('123456')
    cy.get('[data-cy="login-code"]').type('12')
    cy.get('[data-cy="login-submit"]').click()

    cy.url().should('include', '/main')

    // click join room button
    cy.get('[data-cy="room-join"]').click()
    cy.get('[data-cy="room-modal"]').should('be.visible')

    // click switch button
    cy.get('[data-cy="room-switch"]').click().click()

    // type room id into inputBox
    cy.get('[data-cy="room-id"]').type(RoomId)

    // click submit button
    cy.get('.ant-modal-footer > .ant-btn-primary:last').click()

    cy.url().should('include', '/room')

    // click back button
    // cy.get('[data-cy="header-back"]', { timeout: 10000 }).click()
    // cy.get('.ant-modal-confirm-btns > .ant-btn-primary:last').click()
  })
})
