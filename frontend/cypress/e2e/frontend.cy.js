/* eslint-disable no-undef */
describe('end-to-end', function() {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
    cy.viewport(2560, 1440);
  });
  it("page loads", function() {
    cy.get('#root main').should('be.visible');
  });
  it('header', function() {
    cy.get('#root h1._siteName_7orp5_57').should('be.visible');
    cy.get('#root h1._siteName_7orp5_57').should('have.text', 'Signing Bee');
    cy.get('#root a.aslReferenceLink').should('be.visible');
    cy.get('#root a.aslReferenceLink').should('have.class', 'aslReferenceLink');
    cy.get('#root a.aslReferenceLink').should('have.text', 'ASL Reference');
    cy.get('#root a.playLink').should('be.visible');
    cy.get('#root a.playLink').should('have.class', 'playLink');
    cy.get('#root a.playLink').should('have.text', 'Play');
    cy.get('#root a.aboutLink').should('be.visible');
    cy.get('#root a.aboutLink').should('have.class', 'aboutLink');
    cy.get('#root a.aboutLink').should('have.text', 'About');
    cy.get('#root section._home_1fn5o_35 h1').should('be.visible');
  });
  it('home page', function() {
    cy.get('#root section._home_1fn5o_35 h1').should('have.text', 'Welcome to Signing Bee!');
    cy.get('#root section._home_1fn5o_35 div:nth-child(2)').should('be.visible');
    cy.get('#root section._home_1fn5o_35 div:nth-child(3)').should('be.visible');
    cy.get('#root div:nth-child(4)').should('be.visible');
    cy.get('#root div._images_1fn5o_78').should('be.visible');
  })
  it('ASL reference page', function() {
    cy.get('#root a.aslReferenceLink').click();
    cy.get('#root div._left_vkp5m_41').should('be.visible');
    cy.get('#root div._left_vkp5m_41').should('have.text', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    cy.get('#root img[alt="A"]').should('be.visible');
    cy.get('#root img[alt="B"]').should('be.visible');
    cy.get('#root img[alt="C"]').should('be.visible');
    cy.get('#root div._container_vkp5m_35 > div:nth-child(2)').should('be.visible');
    cy.get('#root button:nth-child(1)').click();
    cy.get('#root video').should('be.visible');
    cy.get('#root button:nth-child(2)').click();
    cy.get('#root video').should('not.exist');
  });
  it('Play page', function() {
    cy.get('#root a.playLink').click();
    cy.get('#root div._introBox_1dfkn_41 h1').should('be.visible');
    cy.get('#root div._introBox_1dfkn_41 h1').should('have.text', 'Play');
    cy.get('#root div:nth-child(1) > button._button_ldy4g_41 > span').should('be.visible');
    cy.get('#root div:nth-child(1) > button._button_ldy4g_41').click();
    cy.get('#root div._menu_ldy4g_68').should('be.visible');
    cy.get('#root button._timerStartStop_1st0p_35').should('be.visible');
    cy.get('#root button._timerStartStop_1st0p_35').click();
    cy.wait(5000);
    cy.get('#root div._timerSpacing_1st0p_50 h1').should('have.text', '00:05');
    cy.get('#root button._timerStartStop_1st0p_35').click();
    cy.get('#root div._timerSpacing_1st0p_50 h1').should('have.text', '00:05');
    cy.wait(2000)
    cy.get('#root div._timerSpacing_1st0p_50 h1').should('have.text', '00:05');
    cy.get('#root div._SSButtons_rqhxk_177 button:nth-child(1)').should('be.enabled');
    cy.get('#root div._SSButtons_rqhxk_177 button:nth-child(1)').click();
    cy.get('#root video').should('be.visible');
    cy.get('#root div._SSButtons_rqhxk_177 button:nth-child(2)').should('be.visible');
    cy.get('#root div._SSButtons_rqhxk_177 button:nth-child(2)').click();
    cy.get('#root video').should('not.exist');
  });
  it('About page', function() {
    cy.get('#root a.aboutLink').should('be.visible');
    cy.get('#root a.aboutLink').click();
    cy.get('#root div._about_z40yr_35 h1').should('be.visible');
    cy.get('#root div._about_z40yr_35 h1').should('have.text', 'About this Project');
    cy.get('#root div._about_z40yr_35 > div:nth-child(2) > h2').should('have.text', 'What is Signing Bee?');
    cy.get('#root div._about_z40yr_35 > div:nth-child(3) > h2:nth-child(1)').should('have.text', 'Who made Signing Bee?');
    cy.get('#root div._about_z40yr_35 > div:nth-child(4) > h2').should('have.text', 'How did you make Signing Bee?');
    cy.get('#root div:nth-child(5) h2').should('have.text', 'Where can I see more?');
    cy.get('#root a[href="https://github.com/stevenlagoy/Signing-Bee.git"]').should('be.visible');
    cy.get('#root a[href="https://github.com/stevenlagoy/Signing-Bee.git"]').should('have.attr', 'href', 'https://github.com/stevenlagoy/Signing-Bee.git');
  });
});
