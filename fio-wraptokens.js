// This is in draft. Needs to be completed.

const {FIOSDK } = require('@fioprotocol/fiosdk')
fetch = require('node-fetch')

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

const baseUrl = 'https://testnet.fioprotocol.io/v1/'
//const baseUrl = 'https://fio.greymass.com/v1/'

let privateKey = '',
  publicKey = '',
  amount = 1000000000,
  chainCode = '',
  publicAddress = '',
  maxOracleFee = 6000000000,
  maxFee = 100000000000
  


const fioWrap = async () => {

  user = new FIOSDK(
    privateKey,
    publicKey,
    baseUrl,
    fetchJson
  )

  try {
    const result = await user.genericAction('pushTransaction', {
      action: 'wraptokens',
      account: 'fio.oracle',
      data: {
        amount: amount,
        chain_code: chainCode,
        public_address: publicAddress,
        max_oracle_fee: maxOracleFee,
        max_fee: maxFee,
        tpid: ''
      }
    })
    console.log('Result: ', result)
  } catch (err) {
    console.log('Error: ', err.json)
  }
}

fioWrap();