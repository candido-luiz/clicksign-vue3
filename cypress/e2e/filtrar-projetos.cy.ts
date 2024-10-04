import createProject from "../util/createProject";

const projetos = [
  { name: 'Projeto 1', customer: 'Cliente 1', startDate: '2024-09-20', finalDate: '2024-10-20' },
  { name: 'Projeto 2', customer: 'Cliente 2', startDate: '2024-10-01', finalDate: '2024-11-01' },
  { name: 'Projeto 3', customer: 'Cliente 3', startDate: '2024-11-10', finalDate: '2024-12-10' },
];

describe('template spec', () => {

  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-cy="novo-projeto_no-projects"]').click();

    projetos.forEach((projeto, index) => {
      createProject(projeto);
      cy.wait(500);

      //Nesse momento, o botão de novo projeto deve estar disponível
      if(index < projetos.length - 1)
      cy.get('#createProjectDesktop').click();
    });
  })

  it('Favoritar projetos e filtrar por "Apenas Favoritos"', () => {

    cy.get('.card-grid')
      .find('.card')
      .should('have.length', 3)

    cy.get('.card-grid')
      .find('.card')
      .eq(2)
      .find('[data-cy="toggle-favorite"]')
      .click();

    cy.get('#favoritesSwitchDesktop').click();
    cy.wait(1000);
    cy.get('.card-grid')
      .find('.card')
      .should('have.length', 1)
      .should('contain', 'Projeto 3')
      .should('contain', 'Cliente: Cliente 3')
  });

  it('Ordenar items', () => {

    cy.get('.card-grid')
      .find('.card')
      .first()
      .should('contain', 'Projeto 1')

    cy.get('#sortOptionsDesktop').click();
    cy.wait(200);

    cy.get('#sortOptionsDesktop')
      .find('.select-options')
      .find('.list-group-item')
      .eq(1)
      .click();

    cy.wait(300);

    cy.get('.card-grid')
      .find('.card')
      .first()
      .should('contain', 'Projeto 3')
  });

  it('Buscar items', () => {

    cy.get('.card-grid')
      .find('.card')
      .should('have.length', 3)

    cy.get('#open-search').click();
    cy.wait(200);

    cy.get('#searchInput')
      .should('have.focus')
      .type("Projeto 2{enter}");

    cy.wait(300);

    cy.get('.card-grid')
      .find('.card')
      .should('have.length', 1)
      .contains('mark', 'Projeto 2');
  });

  it('Buscar item inexistente', () => {
    cy.get('.card-grid')
      .find('.card')
      .should('have.length', 3)

    cy.get('#open-search').click();
    cy.wait(200);

    cy.get('#searchInput')
      .should('have.focus')
      .type("Inexistente{enter}");

    cy.wait(300);

    cy.get('.card-grid')
      .should('have.length', 0);

    cy.get('main')
      .should('contain', 'Nenhum projeto encontrado');
  });

  it('Buscar item inexistente e clicara em "Limpar filtros"', () => {
    cy.get('.card-grid')
      .find('.card')
      .should('have.length', 3)

    cy.get('#open-search').click();
    cy.wait(200);

    cy.get('#searchInput')
      .should('have.focus')
      .type("Inexistente{enter}");

    cy.wait(300);
    cy.get('.card-grid')
      .should('have.length', 0);

    cy.get('#limar-filtros').click()
    cy.wait(300);
    cy.get('.card-grid')
      .find('.card')
      .should('have.length', 3)
  });
})