import createProject from "../util/createProject";

const projetos = [
  { name: 'Projeto 1', customer: 'Cliente 1', startDate: '2024-09-20', finalDate: '2024-10-20' },
  { name: 'Projeto 2', customer: 'Cliente 2', startDate: '2024-10-01', finalDate: '2024-11-01' },
  { name: 'Projeto 3', customer: 'Cliente 3', startDate: '2024-11-10', finalDate: '2024-12-10' },
];

describe('Criação de projetos', () => {
  
  it('Cria um projeto', () => {
    cy.visit('/');
    cy.get('[data-cy="novo-projeto_no-projects"]').click();
    cy.url().should('include', '/form-project');

    createProject(projetos[0]);

    cy.url().should('include', '/');

    const startDay = new Date('2024-09-20').getDate();
    const finalDay = new Date('2024-10-20').getDate();

    cy.get('.card-grid')
      .find('.card')
      .should('have.length', 1)
      .find('.card-body')
      .should('contain', 'Projeto 1')
      .should('contain', 'Cliente: Cliente')
      .should('contain', `${startDay} de Setembro de 2024`)
      .should('contain', `${finalDay} de Outubro de 2024`);
  });

  it('Cria multiplos projetos', () => {
    cy.visit('/');
    cy.get('[data-cy="novo-projeto_no-projects"]').click();

    projetos.forEach((projeto, index) => {
      createProject(projeto);
      cy.wait(1000);

      //Nesse momento, o botão de novo projeto deve estar disponível
      if(index < projetos.length - 1)
      cy.get('#createProjectDesktop').click();
    });

    cy.get('.card-grid')
      .find('.card')
      .should('have.length', 3)
  });

  it('Verifica se a validação dos campos funciona', () => {
    cy.visit('/');
    cy.get('[data-cy="novo-projeto_no-projects"]').click();

    //Projeto com valores invalidos
    const project = { 
      name: 'Projeto',
      startDate: '2024-09-20', 
      finalDate: '2024-08-20' 
    };

    cy.get('#projectName').type(project.name);
    cy.get('#projectCustomer').focus();
    cy.get('#projectStartDate').type(project.startDate);
    cy.get('#projectFinalDate').type(project.finalDate);

    cy.get('#createProject')
      .should('have.attr', 'disabled');

  })
})