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