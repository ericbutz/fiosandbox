const {FIOSDK } = require('@fioprotocol/fiosdk')
fetch = require('node-fetch')

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

async function timeout(ms) {
  await new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

const baseUrl = 'https://testnet.fioprotocol.io/v1/'
//const baseUrl = 'https://fio.blockpane.com/v1/'

let privateKey = '',
  publicKey = ''


const burnExpired = async () => {

  user = new FIOSDK(
    privateKey,
    publicKey,
    baseUrl,
    fetchJson
  )

  let burnexpiredStepSize = 1; // Offset gets incremented by this number in the while loop. Also index is set to this number.
  const retryLimit = 1; // Number of times to call burnexpired with the same offset/limit when hitting a CPU limit error

  let offset, limit;
  let retryCount = 0;
  let empty = false;
  let workDoneThisRound = true;
  let workDoneThisOffset = false;
  let count = 1; 

  while (!empty) {
    offset = burnexpiredStepSize * count;
    limit = burnexpiredStepSize;

    pushResultBefore = await fetch(baseUrl + 'chain/get_table_rows', {
      body: `{
      "json": true,
      "code": "fio.address",
      "scope": "fio.address",
      "table": "domains",
      "limit": "${burnexpiredStepSize}",
      "lower_bound": "${burnexpiredStepSize * count}",
      "reverse": false,
      "show_payer": false
    }`,
      method: 'POST',
    });

    resultBefore = await pushResultBefore.json()
    console.log('\nBefore action Table lookup: ', resultBefore);

    try {
      const result = await user.genericAction('pushTransaction', {
        action: 'burnexpired',
        account: 'fio.address',
        data: {
          actor: user.account,
          offset: offset,
          limit: limit
        }
      })
      console.log('Offset = ' + offset + ', Limit = ' + limit + ', Result: {status: ' + result.status + ', items_burned: ' + result.items_burned + ' }');
      workDoneThisOffset = true;
      workDoneThisRound = true;
      retryCount = 0;
      await timeout(1000); // To avoid duplicate transaction
    } catch (err) {
      workDoneThisOffset = false;
      //console.log('Error: ', err);
      
      if (err.errorCode == 400 && err.json.fields[0].error == 'No work.') {
        retryCount = 0;
        console.log('Offset = ' + offset + ', Limit = ' + limit + ', Result: ' + err.json.fields[0].error);
      } else if (err.json.code == 500 && err.json.error.what == 'Transaction exceeded the current CPU usage limit imposed on the transaction') {
        console.log('Offset = ' + offset + ', Limit = ' + limit + ', Result: Transaction exceeded the current CPU usage limit imposed on the transaction');
        retryCount++;
      } else {
        console.log('UNEXPECTED ERROR: ', err);
      }

    }

    pushResult = await fetch(baseUrl + 'chain/get_table_rows', {
      body: `{
      "json": true,
      "code": "fio.address",
      "scope": "fio.address",
      "table": "domains",
      "limit": "${burnexpiredStepSize}",
      "lower_bound": "${burnexpiredStepSize * count}",
      "reverse": false,
      "show_payer": false
    }`,
      method: 'POST',
    });

    result = await pushResult.json()
    //console.log('Table lookup: ', result);
    
    if (result.rows.length == 0) {
      console.log("DONE");
      count = 1;  // Start again
      // If this is the first round, or work was done during the round, reset 
      if (workDoneThisRound) {
        workDoneThisRound = false;
      } else {
        empty = true;  // No work was done this round and we are at the end of the domains
      }
    } else {
      // Only increment the offset if no work was done
      if (!workDoneThisOffset) {
        // If you have done several retries, move to next offset
        if (retryCount == 0) {
          count++;
        } else if (retryCount >= retryLimit) {
          retryCount = 0;
          count++;
        }
      }
      
    }
  }
}

burnExpired();