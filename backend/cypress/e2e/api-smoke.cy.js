describe('Todo API Smoke Tests', () => {
  const baseUrl = '/api/todos'

  beforeEach(() => {
    // Clear any existing todos before each test
    cy.request('GET', baseUrl).then((response) => {
      response.body.data.forEach((todo) => {
        cy.request('DELETE', `${baseUrl}/${todo.id}`)
      })
    })
  })

  it('should complete full CRUD flow', () => {
    let todoId

    // 1. Get empty list
    cy.request('GET', baseUrl)
      .should((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.success).to.be.true
        expect(response.body.count).to.eq(0)
      })

    // 2. Create todo and chain the rest
    cy.request('POST', baseUrl, { text: 'Test todo' })
      .should((response) => {
        expect(response.status).to.eq(201)
        expect(response.body.success).to.be.true
        expect(response.body.data.text).to.eq('Test todo')
        expect(response.body.data.completed).to.be.false
      })
      .then((response) => {
        todoId = response.body.data.id

        // 3. Update todo
        return cy.request('PUT', `${baseUrl}/${todoId}`, { 
          text: 'Updated todo', 
          completed: true 
        })
      })
      .should((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.success).to.be.true
        expect(response.body.data.text).to.eq('Updated todo')
        expect(response.body.data.completed).to.be.true
      })
      .then(() => {
        // 4. Delete todo
        return cy.request('DELETE', `${baseUrl}/${todoId}`)
      })
      .should((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.success).to.be.true
      })
      .then(() => {
        // 5. Verify empty again
        return cy.request('GET', baseUrl)
      })
      .should((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.count).to.eq(0)
      })
  })

  it('should handle error cases', () => {
    // Empty text error
    cy.request({
      method: 'POST',
      url: baseUrl,
      body: { text: '' },
      failOnStatusCode: false
    })
      .should((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
      })

    // Non-existent todo error
    cy.request({
      method: 'DELETE',
      url: `${baseUrl}/fake-id`,
      failOnStatusCode: false
    })
      .should((response) => {
        expect(response.status).to.eq(404)
        expect(response.body.success).to.be.false
      })
  })
})