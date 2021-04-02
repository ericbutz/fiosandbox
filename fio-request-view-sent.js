const {FIOSDK } = require('@fioprotocol/fiosdk')
fetch = require('node-fetch')

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

const baseUrl = 'https://testnet.fioprotocol.io:443/v1/'
//const baseUrl = 'https://fio.greymass.com/v1/'

let privateKey = '',
  publicKey = ''

const getSentFioRequests = async () => {
  let result

  user = new FIOSDK(
    privateKey,
    publicKey,
    baseUrl,
    fetchJson
  )

  try {
    result = await user.genericAction('getSentFioRequests', {
      limit: '',
      offset: ''
    })
    console.log('Result: ', result)
  } catch (err) {
    console.log('Error: ', err)
  }

  for (request in result.requests) {
    console.log('\nRequest #', request);
    console.log('payer_fio_address: ', result.requests[request].payer_fio_address);
    console.log('payee_fio_address: ', result.requests[request].payee_fio_address);
    console.log('payer_fio_public_key: ', result.requests[request].payer_fio_public_key);
    console.log('payee_fio_public_key: ', result.requests[request].payee_fio_public_key);
    console.log('status: ', result.requests[request].status);
    console.log('Content payee_public_address: ', result.requests[request].content.payee_public_address);
    console.log('Content amount: ', result.requests[request].content.amount);
    console.log('Content chain_code: ', result.requests[request].content.chain_code);
    console.log('Content token_code: ', result.requests[request].content.token_code);
    console.log('Content memo: ', result.requests[request].content.memo);
  }
  
}

getSentFioRequests();