describe('Auto-save Todos', () => {
  it('should auto-save todos when created', () => {
    const listName = `Auto Save Test ${Date.now()}`
    let listId
    
    // Create a list first
    cy.request('POST', '/api/lists', { name: listName })
      .should((response) => {
        expect(response.status).to.eq(201)
        listId = response.body.data.id
      })
      .then(() => {
        // Create a todo (simulating auto-save)
        return cy.request('POST', `/api/lists/${listId}/todos`, { text: 'Auto Saved Todo' })
      })
      .should((response) => {
        expect(response.status).to.eq(201)
        expect(response.body.data.text).to.eq('Auto Saved Todo')
      })
      .then(() => {
        // Verify it persisted
        return cy.request('GET', `/api/lists/${listId}`)
      })
      .should((response) => {
        expect(response.body.data.todos).to.have.length(1)
        expect(response.body.data.todos[0].text).to.eq('Auto Saved Todo')
      })
  })
})