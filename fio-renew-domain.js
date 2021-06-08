const {FIOSDK } = require('@fioprotocol/fiosdk')
fetch = require('node-fetch')

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

const baseUrl = 'https://testnet.fioprotocol.io:443/v1/'
//const baseUrl = 'https://fio.greymass.com/v1/'

let privateKey = '5KNMbAhXGTt2Leit3z5JdqqtTbLhxWNf6ypm4r3pZQusNHHKV7a',
  publicKey = 'FIO6TWRA6o5UNeMVwG8oGxedvhizd8UpfGbnGKaXEiPH2kUWEPiEb',
  domain = 'regtest',
  maxFee = 1000000000000


const fioRenewDomain = async () => {

  user = new FIOSDK(
    privateKey,
    publicKey,
    baseUrl,
    fetchJson
  )

  try {
    const result = await user.genericAction('pushTransaction', {
      action: 'renewdomain',
      account: 'fio.address',
      data: {
        "fio_domain": domain,
        "max_fee": maxFee,
        "tpid": '',
        "actor": user.account
      }
    })
    console.log('Result: ', result)
  } catch (err) {
    console.log('Error: ', err)
  }

}

fioRenewDomain();