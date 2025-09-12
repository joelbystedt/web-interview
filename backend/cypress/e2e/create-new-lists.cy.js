describe('Create New Lists', () => {
  it('should create a new todo list', () => {
    const listName = `Test List ${Date.now()}`
    
    cy.request('POST', '/api/lists', { name: listName })
      .should((response) => {
        expect(response.status).to.eq(201)
        expect(response.body.success).to.be.true
        expect(response.body.data).to.have.property('id')
        expect(response.body.data.name).to.eq(listName)
        expect(response.body.data.todos).to.be.an('array')
        expect(response.body.data.todos).to.have.length(0)
      })
  })
})