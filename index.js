const inquirer = require('inquirer')
const chalk = require('chalk')

const fs = require('fs')

operation()

function operation() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'O que você deseja fazer?',
        choices: [
          'Criar Conta',
          'Consultar Saldo',
          'Depositar',
          'Sacar',
          'Sair',
        ],
      },
    ])
    .then((answer) => {
      const action = answer['action']

      if (action === 'Criar Conta') {
        createAccount()
      } else if (action === 'Consultar Saldo') {
        return
      } else if (action === 'Depositar') {
        return
      } else if (action === 'Sacar') {
        return
      } else if (action === 'Sair') {
        console.log(chalk.bgBlue.black('Obrigar por usar o Accounts!'))
        process.exit()
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

// Create Account

function createAccount() {
  buildAccount()
}

function buildAccount() {
  inquirer
    .prompt([
      {
        name: 'accountName',
        message: 'Digite um nome para a sua conta: ',
      },
    ])
    .then((answer) => {
      const accountName = answer['accountName']
      console.info(accountName)

      if (!fs.existsSync('accounts')) {
        fs.mkdirSync('accounts')
      }

      if (fs.existsSync(`accounts/${accountName}.json`)) {
        console.error(
          chalk.bgRed.black('Esta conta já existe, escolha outro nome!')
        )
        buildAccount()
        return
      }

      fs.writeFileSync(
        `accounts/${accountName}.json`,
        '{"balance": 0}',
        (err) => {
          console.error(err)
        }
      )

      console.log(chalk.green('Parabéns, a sua conta foi criada!'))
      operation()
    })
    .catch((err) => {
      console.error(err)
    })
}
