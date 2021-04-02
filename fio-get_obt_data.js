const {FIOSDK } = require('@fioprotocol/fiosdk')
fetch = require('node-fetch')

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

const baseUrl = 'https://testnet.fioprotocol.io:443/v1/'
//const baseUrl = 'https://fio.greymass.com/v1/'

let privateKey = '',
  publicKey = ''


const getObtData = async () => {
  let result

  user = new FIOSDK(
    privateKey,
    publicKey,
    baseUrl,
    fetchJson
  )

  try {
    result = await user.genericAction('getObtData', {
      limit: '',
      offset: ''
    })
    console.log('Result: ', result)
  } catch (err) {
    console.log('Error: ', err)
  }

  for (obtrecord in result.obt_data_records) {
    console.log('\nOBT Record #', obtrecord);
    console.log('payer_fio_address: ', result.obt_data_records[obtrecord].payer_fio_address);
    console.log('payee_fio_address: ', result.obt_data_records[obtrecord].payee_fio_address);
    console.log('payer_fio_public_key: ', result.obt_data_records[obtrecord].payer_fio_public_key);
    console.log('payee_fio_public_key: ', result.obt_data_records[obtrecord].payee_fio_public_key);
    console.log('status: ', result.obt_data_records[obtrecord].status);
    console.log('Content payee_public_address: ', result.obt_data_records[obtrecord].content.payee_public_address);
    console.log('Content amount: ', result.obt_data_records[obtrecord].content.amount);
    console.log('Content chain_code: ', result.obt_data_records[obtrecord].content.chain_code);
    console.log('Content token_code: ', result.obt_data_records[obtrecord].content.token_code);
    console.log('Content memo: ', result.obt_data_records[obtrecord].content.memo);
  }
  
}

getObtData();