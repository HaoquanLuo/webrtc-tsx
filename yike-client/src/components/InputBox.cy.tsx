import React from 'react'
import InputBox from './InputBox'

describe('<InputBox />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(
      <InputBox
        inputKey={'username'}
        inputValue={'username'}
        changeFn={() => console.log('test')}
      />,
    )
  })
  it('should type "foobar" and check its value', () => {
    cy.visit('/')
    cy.get('[data-cy="inputBox"]').type('foobar')
    cy.get('[data-cy="inputBox"]').should('have.value', 'foobar')
  })
})
