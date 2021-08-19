const payout = require('./payout')
const solanaWeb3 = require('@solana/web3.js');
const NETWORK = solanaWeb3.clusterApiUrl('devnet');

/**
 * Connection to the network
 */
let connection =  new solanaWeb3.Connection(NETWORK);
let greetedPubkey = new solanaWeb3.PublicKey("DeH2ULUKz8Hw33fmXU9a5ATf9cabk6cKUf7U9EJjuW5v")

// const logging = () =>{
// connection.onLogs(greetedPubkey,async function(logs,context){
//   const requiredAccounts = [''];
//   console.log('started logging')
//   if(logs.err==null){
//     console.log(logs,context)
//     let signature = logs.signature
//     console.log(signature)
//     let payer_pubkey =  await connection.getParsedConfirmedTransaction(signature);
//     let account = await payer_pubkey.transaction.message.instructions
//     console.log("accounts" , account[0])
//     // let accounts = await account[0].parsed
//     // console.log(accounts)
//     requiredAccounts.push(account[0])
//     console.log("array" , requiredAccounts)
    

//   }
// })  
// }

  
  const main = async () => {
    console.log("connect to solana account...");
  
    // Establish connection to the cluster
    await payout.establishConnection();
  
    // Determine who pays for the fees
    await payout.establishPayer();
  
    // Check if the program has been deployed
    await payout.checkProgram();
  
    // send payouts to an account
    await payout.sendPayouts();
  
    //await reportGreetings();
  
    console.log('Success');
  }
  
//   async function parseTransaction(logs,context){
//     const requiredAccounts = [''];
//     console.log('working')
//     let signature = await logs.signature
//     console.log(signature)
//     let payer_pubkey =  await connection.getParsedConfirmedTransaction(signature);
//     let account = await payer_pubkey.transaction.message.instructions
//     let accounts = await account[0].parsed
//     //console.log(accounts.info.source)
//     requiredAccounts.push(accounts.info.source)
//     console.log(requiredAccounts)
   
// }

// connection.onLogs(greetedPubkey,async function(logs,context){
//   const requiredAccounts = [''];

//   if(logs.err==null){
//     console.log(logs,context)
//     let signature = logs.signature
//     console.log(signature)
//     let payer_pubkey =  await connection.getParsedConfirmedTransaction(signature);
//     let account = await payer_pubkey.transaction.message.instructions
//     console.log("accounts" , account[0])
//     // let accounts = await account[0].parsed
//     // console.log(accounts)
//     requiredAccounts.push(account[0])
//     console.log("array" , requiredAccounts)
    

//   }
// })  
  
  
const makepayouts = async ()=>{
  await main().then(
   console.log("success")
  
  );

  }

module.exports = {makepayouts}