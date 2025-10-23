/* eslint-disable no-undef */
describe('template spec', () => {
  it("page loads", () => {
    cy.visit('http://localhost:3000')
  })
  it('header text', () => {
    cy.visit('http://localhost:3000')
    cy.get("h1").contains("Signing Bee")
  })
})