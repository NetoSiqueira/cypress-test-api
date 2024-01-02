/// <reference types="cypress"/>



describe('Should test at a funcional level', () =>{

    
    before(() =>{
       
        
    })

    beforeEach(() =>{
      
        
    })


    it('Create an account', () => {
      cy.request({
        method: 'POST',
        url: 'https://barrigarest.wcaquino.me/signin',
        body: {
            email: "neto@neto.com",
            redirecionar: false, 
            senha: "1234"
        }
      }).its('body.token').should('not.be.empty')
      .then(token => {
            cy.request({
                url: 'https://barrigarest.wcaquino.me/contas',
                method: 'POST',
                headers: { Authorization: `JWT ${token}` },
                body: {
                    nome: "conta VIA REST"
                    }
            }).as('response')
        })

        cy.get('@response').then(res =>{
            expect(res.status).to.be.equal(201)
            expect(res.body).to.have.property('id')
            expect(res.body).to.have.property('nome', 'conta VIA REST')
        })

      })

      

    //it('Should update an account', () => {
      
        
   // });

   // it('Should not create an account with same name', () => {
       
  //  });

   // it('Should create a transaction', () => {
       
   // });

   // it.only('Should get Balance', () => {
      
   // });

   // it('Should remove a transaction', () => {
       
   // });
})