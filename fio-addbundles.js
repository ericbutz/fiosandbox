// This is in draft. Needs to be completed.

const {FIOSDK } = require('@fioprotocol/fiosdk')
fetch = require('node-fetch')

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

const baseUrl = 'https://testnet.fioprotocol.io:443/v1/'
//const baseUrl = 'https://fio.greymass.com/v1/'

let privateKey = '',
  publicKey = '',
  fioAddress = '',
  bundleSets = 2
  maxFee = 100000000000


const fioAddBundles = async () => {

  user = new FIOSDK(
    privateKey,
    publicKey,
    baseUrl,
    fetchJson
  )

  try {
    const result = await user.genericAction('pushTransaction', {
      action: 'addbundles',
      account: 'fio.address',
      data: {
        fio_address: fioAddress,
        bundle_sets: bundleSets,
        max_fee: maxFee,
        tpid: ''
      }
    })
    console.log('Result: ', result)
  } catch (err) {
    console.log('Error: ', err)
  }
}

fioAddBundles();