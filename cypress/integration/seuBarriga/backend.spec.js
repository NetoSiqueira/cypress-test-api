/// <reference types="cypress"/>



describe('Should test at a funcional level', () =>{

    let token

    before(() =>{
        cy.getToken('neto@neto.com', '1234')
        .then(tkn => {
            token = tkn
        })
    })

    beforeEach(() =>{
      cy.resetTestApi()
        
    })


    it('Create an account', () => {
    
        cy.request({
            url: '/contas',
            method: 'POST',
            headers: { Authorization: `JWT ${token}` },
            body: {
                nome: "conta VIA REST"
                }
            }).as('response')
       

        cy.get('@response').then(res =>{
            expect(res.status).to.be.equal(201)
            expect(res.body).to.have.property('id')
            expect(res.body).to.have.property('nome', 'conta VIA REST')
        })

      })

      

    it('Should update an account', () => {

        cy.request({
            method: 'GET',
            url:'/contas',
            headers: { Authorization: `JWT ${token}` },
            qs:{
                nome : 'Conta para alterar'
            }
        }).then(res => {
            cy.request({
                url:`/contas/${res.body[0].id}`,
                method: 'PUT',
                headers: { Authorization: `JWT ${token}` },
                body:{
                    nome: 'Conta alterada pela Api'
                }
            }).as('response')
        })
        cy.get('@response').its('status').should('to.be.equal', 200)
        
    });

    it('Should not create an account with same name', () => {
        cy.request({
            url: '/contas',
            method: 'POST',
            headers: { Authorization: `JWT ${token}` },
            body: {
                nome: "Conta mesmo nome"
                },
                failOnStatusCode: false
            }).as('response')
       

        cy.get('@response').then(res =>{
            expect(res.status).to.be.equal(400)
            expect(res.body.error).to.be.equal('Já existe uma conta com esse nome!')
        })
    });

   // it('Should create a transaction', () => {
       
   // });

   // it.only('Should get Balance', () => {
      
   // });

   // it('Should remove a transaction', () => {
       
   // });
})