describe('Delete Lists', () => {
  it('should delete a todo list', () => {
    const listName = `Test List to Delete ${Date.now()}`
    let listId

    // First create a list to delete
    cy.request('POST', '/api/lists', { name: listName })
      .should((response) => {
        expect(response.status).to.eq(201)
        expect(response.body.success).to.be.true
        listId = response.body.data.id
      })
      .then(() => {
        // Then delete it
        return cy.request('DELETE', `/api/lists/${listId}`)
      })
      .should((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.success).to.be.true
        expect(response.body.data.deleted).to.be.true
      })
      .then(() => {
        // Verify it's gone by trying to get it
        return cy.request({
          method: 'GET',
          url: `/api/lists/${listId}`,
          failOnStatusCode: false,
        })
      })
      .should((response) => {
        expect(response.status).to.eq(404)
        expect(response.body.success).to.be.false
      })
  })
})
