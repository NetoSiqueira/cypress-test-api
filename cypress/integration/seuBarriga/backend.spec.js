/// <reference types="cypress"/>



describe('Should test at a funcional level', () =>{

    //let token

    before(() =>{
        cy.getToken('neto@neto.com', '1234')
       // .then(tkn => {
          //  token = tkn
       // })
    })

    beforeEach(() =>{
      cy.resetTestApi()
        
    })


    it('Create an account', () => {
        cy.request({
            url: '/contas',
            method: 'POST',
           // headers: { Authorization: `JWT ${token}` },
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
        cy.getContaPorNome('Conta para alterar', '/contas', 'nome').then(contaId => {
            cy.request({
                url:`/contas/${contaId.id}`,
                method: 'PUT',
               // headers: { Authorization: `JWT ${token}` },
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
           // headers: { Authorization: `JWT ${token}` },
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
        cy.getContaPorNome('Conta para movimentacoes', '/contas', 'nome').then(contaId =>{
            cy.request({
                url:'/transacoes',
                method: 'POST',
                //headers: { Authorization: `JWT ${token}` },
                body:{
                    conta_id: contaId.id,
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

    it('Should get Balance', () => {
        cy.request({
            url:'/saldo',
            method: 'GET'
        }).then(res => {
            let saldoConta = null
            res.body.forEach(c => {
                if(c.conta === 'Conta para saldo')
                    saldoConta = c.saldo
            })    
            expect(saldoConta).to.be.equal('534.00')
        })
        cy.getContaPorNome('Movimentacao 1, calculo saldo', '/transacoes', 'descricao').then(contaId =>{
            cy.request({
                url: `/transacoes/${contaId.id}`,
                method: 'PUT',
                body:{
                    conta_id: contaId.conta_id,
                    data_pagamento: Cypress.moment(contaId.data_pagamento).format('DD/MM/YYYY'),
                    data_transacao: Cypress.moment(contaId.data_transacao).format('DD/MM/YYYY'),
                    descricao: contaId.descricao,
                    envolvido: contaId.envolvido,
                    status: true,
                    valor: contaId.valor
                }
            }).its('status').should('to.be.equal', 200)
        })

        cy.request({
            url:'/saldo',
            method: 'GET'
        }).then(res => {
            let saldoConta = null
            res.body.forEach(c => {
                if(c.conta === 'Conta para saldo')
                    saldoConta = c.saldo
            })    
            expect(saldoConta).to.be.equal('4034.00')
        })
       
        
    });

    it('Should remove a transaction', () => {
        cy.getContaPorNome('Movimentacao para exclusao', '/transacoes', 'descricao').then(contaId =>{
            cy.request({
                url:`/transacoes/${contaId.id}`,
                method: 'DELETE'
            }).its('status').should('to.be.equal', 204)
        })
    });
})