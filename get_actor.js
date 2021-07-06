const {FIOSDK } = require('@fioprotocol/fiosdk')
fetch = require('node-fetch')

const Transactions_2 = require("@fioprotocol/FIOSDK/lib/transactions/Transactions")
let transaction = new Transactions_2.Transactions

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

async function getAccountFromKey(publicKey) {
  account = transaction.getActor(publicKey)
  return (account);
}

const baseUrl = 'https://testnet.fioprotocol.io:443/v1/'
//const baseUrl = 'https://fio.greymass.com/v1/'

pubKeys = [
  "FIO5GuBHP1xg4RF9MdLvTMXM6uBsjZrgLufeyUKef8WrzjozfcyFN",
  "FIO7DHRj39sLn86gd26D7LiNPtSPrBSK8i3bVnofD6Dk3sj5asT2C",
  "FIO6nfAMLCMGGYRD2uKmSMkrioUrBM1FZhnAtsQxsc1JnVY72ogG8",
  "FIO7aymPn21vqXZfg67toCbGCiYvYZM7QncQ5JMVoVgM5eK8GTDKT",
  "FIO6XYdXfUvhozN2CSL9ZEUEUJExt3oMfLcgYu25d8mRBN88adf7Z"
]

/*
Public Key: FIO7sXS5BGNCSL2WcUP9v7f8b5KR9SL8c6xHwAiVJDtqMCXaVphU8
Private key: 5Ja36kuNLrcWqDvzwykwqeH8b4ftFSvcarrUNSDLEAbkvX1wHnk

FIO Internal Account (actor name): cadfxiwdutcu
*/
const getAccount = async () => {

  user = new FIOSDK(
    "5Ja36kuNLrcWqDvzwykwqeH8b4ftFSvcarrUNSDLEAbkvX1wHnk",
    "FIO7sXS5BGNCSL2WcUP9v7f8b5KR9SL8c6xHwAiVJDtqMCXaVphU8",
    baseUrl,
    fetchJson
  )

  for (pubKey in pubKeys) {
    try {
      httpEndpoint = "https://testnet.fioprotocol.io"
      acct = await (await fetch(httpEndpoint + '/v1/chain/get_actor ', { body: `{"fio_public_key": "${pubKeys[pubKey]}"}`, method: 'POST' })).json()
      console.log(acct.actor + ',' + pubKeys[pubKey]);
    } catch (err) {
      console.log('Error: ', err)
    }
  }
  
}

getAccount();