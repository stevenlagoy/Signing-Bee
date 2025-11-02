/* eslint-disable no-undef */
describe('template spec', () => {
  it("page loads", () => {
    cy.visit('http://localhost:5173')
  })
  it('header text', () => {
    cy.visit('http://localhost:5173')
    cy.get("h1").contains("Signing Bee")
  })
})