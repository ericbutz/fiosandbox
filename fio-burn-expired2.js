const {FIOSDK } = require('@fioprotocol/fiosdk');
fetch = require('node-fetch');
const rp = require('request-promise');

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

async function timeout(ms) {
  await new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

/**
 * Generic call to API
 * @param {string} apiCall - The FIO API endpoint.
 * @param {json} JSONObject - The json body to pass to the endpoint.
 * @return {json} - Returns json object.
 */
 function callFioApi(apiCall, JSONObject) {
  return (new Promise(function(resolve, reject) {
      var options = {
          method: "POST",
          uri: fiourl + apiCall,
          body: JSONObject,
          json: true // Automatically stringifies the body to JSON
      };

      rp(options)
          .then(function (body){
              //console.log(body);
              resolve(body);
          }).catch(function(ex) {
              reject(ex);
          });
  }));
};

const baseUrl = 'https://fiotestnet.blockpane.com/v1/'
//const baseUrl = 'https://fio.blockpane.com/v1/'

const fiourl = baseUrl + "chain/";

let privateKey = '5J9NxRe8Eych3SBHeaKzf7U6opXZWL6q4FDwyzFqHqtms32mYTs',
  publicKey = 'FIO66TsSyX9w2m492ZfeHGrvEo5qu7MTcy8xhQNkVMkAcDHSRU3tN'


const burnExpired = async () => {

  user = new FIOSDK(
    privateKey,
    publicKey,
    baseUrl,
    fetchJson
  )

  const retryLimit = 1; // Number of times to call burnexpired with the same offset/limit when hitting a CPU limit error

  let offset = 9079;
  let limit = 100;
  let retryCount = 0;
  let empty = false;
  let burned = false;
  let workDoneThisRound = true;
  let workDoneThisOffset = false;
  let count = 1; 
  let burnLowerBound;
  const burnLimit = 1;

  const curdate = new Date();
  const ninetyDaysInSecs = 90*24*60*60;
  const utcSeconds = (curdate.getTime() + curdate.getTimezoneOffset()*60*1000)/1000;  // Convert to UTC
  const utcMinus90Days = utcSeconds - ninetyDaysInSecs;
  console.log('utcSeconds = ', utcSeconds);
  
  console.log('ninetyDaysInSecs = ', ninetyDaysInSecs);
  console.log('plus = ', utcSeconds - ninetyDaysInSecs);

  while (!empty) {
    console.log('offset: ', offset);  

    const json = {
      json: true,
      code: 'fio.address',
      scope: 'fio.address',
      table: 'domains',
      limit: limit,
      lower_bound: offset,
      reverse: false,
      show_payer: false
    }
    domains = await callFioApi("get_table_rows", json);

    if (domains.rows.length == 0) {
        empty = true;
        break;
    } else {  // Step through each expired domain

      for (domain in domains.rows) {
        console.log('domain: ', domain)
        if (domains.rows[domain].expiration < utcMinus90Days) {
          console.log('domains.rows[domain].expiration = ', domains.rows[domain].expiration);
          console.log('id: ', domains.rows[domain].id)
          burnLowerBound = domains.rows[domain].id; 
          console.log('burnLowerBound: ', burnLowerBound);
          burned = false;

          while (!burned) {
            pushResultBefore = await fetch(baseUrl + 'chain/get_table_rows', {
              body: `{
              "json": true,
              "code": "fio.address",
              "scope": "fio.address",
              "table": "domains",
              "limit": "1",
              "lower_bound": "${burnLowerBound}",
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
                  offset: burnLowerBound,
                  limit: burnLimit
                }
              })
              console.log('Offset = ' + burnLowerBound + ', Limit = ' + burnLimit + ', Result: {status: ' + result.status + ', items_burned: ' + result.items_burned + ' }');
              workDoneThisOffset = true;
              workDoneThisRound = true;
              retryCount = 0;
              await timeout(1000); // To avoid duplicate transaction
            } catch (err) {
              workDoneThisOffset = false;
              //console.log('Error: ', err);
              
              if (err.errorCode == 400 && err.json.fields[0].error == 'No work.') {
                //console.log('error: ', err.json)
                burned = true; // If no work done, exit out of this domain
                break;
                console.log('Offset = ' + burnLowerBound + ', Limit = ' + burnLimit + ', Result: ' + err.json.fields[0].error);
              } else if (err.json.code == 500 && err.json.error.what == 'Transaction exceeded the current CPU usage limit imposed on the transaction') {
                console.log('Offset = ' + burnLowerBound + ', Limit = ' + burnLimit + ', Result: Transaction exceeded the current CPU usage limit imposed on the transaction');
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
              "limit": "1",
              "lower_bound": "${burnLowerBound}",
              "reverse": false,
              "show_payer": false
            }`,
              method: 'POST',
            });

            result = await pushResult.json()
            //console.log('After action table lookup: ', result);
            
            if (result.rows.length == 0) {
              console.log("DONE");
              count = 1;  // Start again
              // If this is the first round, or work was done during the round, reset 
              if (workDoneThisRound) {
                workDoneThisRound = false;
              } else {
                burned = true;  // No work was done this round and we are at the end of the domains
              }
            } else {
              // Only increment the offset if no work was done
              if (!workDoneThisOffset) {
                // If you have done several retries, exit out of while !burned loop
                if (!workDoneThisOffset) {
                  // If you have done several retries, move to next offset
                  if (retryCount == 0) {
                    count++;
                  } else if (retryCount >= retryLimit) {
                    retryCount = 0;
                    count++;
                  }
                }
              };
            }
          }; // while !burned
        }; // if
      };  // for
    };  // else

    offset += limit;
    console.log('offset: ', offset);

  };  // while !empty
}

burnExpired();