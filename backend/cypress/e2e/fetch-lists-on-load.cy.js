describe('Fetch Lists on Load', () => {
  it('should fetch todo lists when the page loads', () => {
    cy.request('GET', '/api/lists')
      .should((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.success).to.be.true
        expect(response.body.data).to.be.an('array')
        expect(response.body.data.length).to.be.greaterThan(0)
        expect(response.body.data[0]).to.have.property('id')
        expect(response.body.data[0]).to.have.property('name')
        expect(response.body.data[0]).to.have.property('todos')
      })
  })
})