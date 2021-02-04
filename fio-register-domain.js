const {FIOSDK } = require('@fioprotocol/fiosdk')
fetch = require('node-fetch')

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

const baseUrl = 'https://testnet.fioprotocol.io:443/v1/'
//const baseUrl = 'https://fio.greymass.com/v1/'

let privateKey = '',
  publicKey = '',
  newDomain = '',
  maxFee = 1000000000000


const fioRegDomain = async () => {

  user = new FIOSDK(
    privateKey,
    publicKey,
    baseUrl,
    fetchJson
  )

  try {
    const result = await user.genericAction('registerFioDomain', {
      fioDomain: newDomain,
      maxFee: maxFee,
      technologyProviderId: ''
    })
    console.log('Result: ', result)
  } catch (err) {
    console.log('Error: ', err)
  }
}

fioRegDomain();