/// <reference types= "cypress" />
import { format, prepareLocalStorage } from '../support/utils'

// cy.viewport
// arquivos de config
// configs por linha de comando

context('Dev Finances Agilizei', () => {
    // hooks
    // trechos que executam antes e depois do teste
    // before --> antes de todos os testes
    // beforeEach --> antes de cada teste
    // after --> depois de todos os testes
    // afterEach --> depois de cada teste

    beforeEach('Abrindo o site e validando se existem valores', () => {
        cy.visit('https://devfinance-agilizei.netlify.app/', {
            onBeforeLoad: (win) => {
                prepareLocalStorage(win)
            }
        })
    });

    it('Cadastrar entradas', () => {
        cy.get('#transaction .button').click()
        cy.get('#description').type('Presente')
        cy.get('[name=amount]').type(12)
        cy.get('#date').type('2021-08-01')
        cy.get('button').contains('Salvar').click()
        cy.get('#data-table tbody tr').should('have.length', 3);
    });

    //Cadastrar saídas
    it('Cadastrar saídas', () => {
        cy.get('#transaction .button').click()
        cy.get('#description').type('Embrulho')
        cy.get('[name=amount]').type(-12)
        cy.get('#date').type('2021-08-01')
        cy.get('button').contains('Salvar').click()
        cy.get('#data-table tbody tr').should('have.length',3);
    });

    //Remover entradas e saídas

    it('Remover entradas e saídas', () => {
        // estratégia 1: voltar para o elemento pai, e avançar para um td img td
        cy.get('td.description')
            .contains("Mesada")
            .parent()
            .find('img[onclick*=remove]')
            .click()

        // estratégia 2: buscar todos os irmãos, e buscar o que tem a img +attr
        cy.get('td.description')
            .contains("Suco Kapo")
            .siblings()
            .children('img[onclick*=remove]')
            .click()
    });

    it('Validar o saldo com diversas transações', () => {
        // capturar as linhas com as transaçoes e as colunas com valores
        // capturar os textos dessas colunas
        // formatar esses valores das linhas

        // capturar o texto do total
        // comparar o somatorio de entradas e despesas com o total
        let incomes = 0
        let expenses = 0

        cy.get('#data-table tbody tr')
            .each(($el, index, $list) => {
                cy.get($el).find('td.income, td.expense')
                    .invoke('text').then(text => {
                        if (text.includes('-')) {
                            expenses = expenses + format(text)
                        } else {
                            incomes = incomes + format(text)
                        }


                        cy.log('incomes ', incomes)
                        cy.log('expenses ', expenses)
                    })
            })

        cy.get('#totalDisplay').invoke('text').then(text => {
            let formattedTotalDisplay = format(text)
            let expectedTotal = incomes + expenses

            expect(formattedTotalDisplay).to.eq(expectedTotal)
        });
    });
});

        // - Enteder o fluxo manualmente
        // - Mapear os elementos que vamos interargir
        // - descrever as interaçoes com o cypress
        // - adicionar as asserções que a gente precisa 