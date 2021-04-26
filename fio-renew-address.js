const {FIOSDK } = require('@fioprotocol/fiosdk')
fetch = require('node-fetch')

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

//const baseUrl = 'https://testnet.fioprotocol.io:443/v1/'
const baseUrl = 'https://fio.greymass.com/v1/'

let privateKey = '5JC4xm6fJc9SJsaZPd2TTWYVZbCcHLmXiXmZJxhiNzFHzeaqygU',
  publicKey = 'FIO4zouEPAZ2KmnNEmjNfi1MjGCv1QAXjnZucQLaUoUr7dneLdcx7',
  address = 'changenow@fiomembers',
  maxFee = 100000000000


const fioRenewAddress = async () => {

  user = new FIOSDK(
    privateKey,
    publicKey,
    baseUrl,
    fetchJson
  )

  try {
    const result = await user.genericAction('pushTransaction', {
      action: 'renewaddress',
      account: 'fio.address',
      data: {
        "fio_address": address,
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

fioRenewAddress();