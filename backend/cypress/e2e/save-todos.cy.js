describe('Todo CRUD Operations', () => {
  it('should create, update and delete todos', () => {
    const listName = `CRUD Test ${Date.now()}`
    let listId, todoId
    
    // Create a list
    cy.request('POST', '/api/lists', { name: listName })
      .should((response) => {
        expect(response.status).to.eq(201)
        listId = response.body.data.id
      })
      .then(() => {
        // Create a new todo (onBlur behavior)
        return cy.request('POST', `/api/lists/${listId}/todos`, { text: 'New Todo' })
      })
      .should((response) => {
        expect(response.status).to.eq(201)
        expect(response.body.data.text).to.eq('New Todo')
        todoId = response.body.data.id
      })
      .then(() => {
        // Update existing todo (onBlur behavior)
        return cy.request('PUT', `/api/lists/${listId}/todos/${todoId}`, { text: 'Updated Todo' })
      })
      .should((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.data.text).to.eq('Updated Todo')
      })
      .then(() => {
        // Delete the todo
        return cy.request('DELETE', `/api/lists/${listId}/todos/${todoId}`)
      })
      .should((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.success).to.be.true
      })
      .then(() => {
        // Verify list is empty
        return cy.request('GET', `/api/lists/${listId}`)
      })
      .should((response) => {
        expect(response.body.data.todos).to.have.length(0)
      })
  })
})