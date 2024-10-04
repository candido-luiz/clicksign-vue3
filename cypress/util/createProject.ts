export default (project: {name: string; customer: string; startDate: string; finalDate: string}) => {
  cy.get('#projectName').type(project.name);
  cy.get('#projectCustomer').type(project.customer);
  cy.get('#projectStartDate').type(project.startDate);
  cy.get('#projectFinalDate').type(project.finalDate);
  cy.get('#createProject').click();

}