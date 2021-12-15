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
        deposit()
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

// Deposit function

function deposit() {
  inquirer
    .prompt([{ name: 'accountName', message: 'Qual o nome da sua conta?' }])
    .then((answer) => {
      const accountName = answer['accountName']

      // verificar se conta existe
      if (!checkAccount(accountName)) {
        return deposit()
      }

      inquirer
        .prompt([
          {
            name: 'amount',
            message: 'Quanto você deseja depositar?',
          },
        ])
        .then((answer) => {
          const amount = answer['amount']
          // add amount
          addAmount(accountName, amount)
          operation()
        })
        .catch((err) => {
          console.error(err)
        })
    })
    .catch((err) => {
      console.error(err)
    })
}

function checkAccount(accountName) {
  if (!fs.existsSync(`accounts/${accountName}.json`)) {
    console.log(chalk.bgRed.black('Esta conta não existe. Escolha outro nome!'))
    return false
  } else {
    return true
  }
}

function addAmount(accountName, amount) {
  const accountData = getAccount(accountName)

  if (!amount) {
    console.log(
      chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde')
    )
    return deposit()
  }

  accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)

  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    (err) => {
      console.error(err)
    }
  )

  console.log(
    chalk.green(`Foi depositado o valor de R$${amount} na sua conta.`)
  )
}

function getAccount(accountName) {
  const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
    encoding: 'utf8',
    flag: 'r',
  })

  return JSON.parse(accountJSON)
}
