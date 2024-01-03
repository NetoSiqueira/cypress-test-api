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
        cy.getContaPorNome('Conta para alterar').then(contaId => {
            cy.request({
                url:`/contas/${contaId}`,
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

    it('Should create a transaction', () => {
        cy.getContaPorNome('Conta para movimentacoes').then(contaId =>{
            cy.request({
                url:'/transacoes',
                method: 'POST',
                headers: { Authorization: `JWT ${token}` },
                body:{
                    conta_id: contaId,
                    data_pagamento: Cypress.moment().add({days:1}).format('DD/MM/YYYY'),
                    data_transacao: Cypress.moment().format('DD/MM/YYYY'),
                    descricao: "dec",
                    envolvido: "int",
                    status: true,
                    tipo: "REC",
                    valor :"123"
                }
            }).as('response')
        })
        cy.get('@response').its('status').should('to.be.equal', 201)
        cy.get('@response').its('body.id').should('exist')
    });

   // it.only('Should get Balance', () => {
      
   // });

   // it('Should remove a transaction', () => {
       
   // });
})