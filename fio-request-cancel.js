const {FIOSDK } = require('@fioprotocol/fiosdk')
fetch = require('node-fetch')

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

const baseUrl = 'https://testnet.fioprotocol.io:443/v1/'
//const baseUrl = 'https://fio.greymass.com/v1/'

let payeePrivKey = '',
  payeePubKey = '',
  requestId = 1,
  maxFee = 100000000000


const cancelFioRequest = async () => {

  payee = new FIOSDK(
    payeePrivKey,
    payeePubKey,
    baseUrl,
    fetchJson
  )

  try {
    const result = await payee.genericAction('cancelFundsRequest', {
      fioRequestId: requestId,
      maxFee: maxFee
    })
    console.log('Result: ', result)
  } catch (err) {
    console.log('Error: ', err)
  }
}

cancelFioRequest();