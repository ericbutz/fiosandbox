const {FIOSDK } = require('@fioprotocol/fiosdk')
fetch = require('node-fetch')

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

const baseUrl = 'https://testnet.fioprotocol.io:443/v1/'
//const baseUrl = 'https://https://fio.greymass.com/v1/'

let payeePrivKey = '',
  payeePubKey = '',
  payeeAddress = '',
  payerPubKey = ''
  payerAddress = '',
  chainCode = 'ABC',
  tokenCode = 'ABC',
  tokenAddress = 'thisispayeetokenpublicaddress',
  amount = 1000000000,
  requestMemo = 'Request test memo',
  maxFee = 100000000000


const fioRequest = async () => {

  payee = new FIOSDK(
    payeePrivKey,
    payeePubKey,
    baseUrl,
    fetchJson
  )

  try {
    const result = await payee.genericAction('requestFunds', {
      payerFioAddress: payerAddress,
      payeeFioAddress: payeeAddress,
      payeeTokenPublicAddress: tokenAddress,
      amount: amount,
      chainCode: chainCode,
      tokenCode: tokenCode,
      memo: requestMemo,
      maxFee: maxFee,
      payerFioPublicKey: payerPubKey,
    })
    console.log('Result: ', result)
  } catch (err) {
    console.log('Error: ', err)
  }
}

fioRequest();