//solana-keygen new
//npm run build:program-rust
const data = require('./Accountdata.json')
const path = require('path');
const fs = require('mz/fs')
const solanaWeb3 = require('@solana/web3.js');
const borsh = require('borsh')


const {
  getPayer,
  getRpcUrl,
  newAccountWithLamports,
  createKeypairFromFile,
} = require('./utils')


let destinationKey = new solanaWeb3.PublicKey("HJCLMisGueh1BbDZeH6AEBJmvgVg43qe7a9WE1NMFYdR")

const NETWORK = solanaWeb3.clusterApiUrl('devnet');

/**
 * Connection to the network
 */
let connection = new solanaWeb3.Connection(NETWORK);


/**
 * Hello world's program id
 */
let programId = solanaWeb3.PublicKey;

/**
 * The public key of the account we are saying hello to
 */
let greetedPubkey = solanaWeb3.PublicKey;

/**
 * Path to program files
 */
const PROGRAM_PATH = path.resolve(__dirname, '../../../dist/program');

/**
 * Path to program shared object file which should be deployed on chain.
 * This file is created when running either:
 *   - `npm run build:program-c`
 *   - `npm run build:program-rust`
 */
const PROGRAM_SO_PATH = path.join(PROGRAM_PATH, 'helloworld.so');

/**
 * Path to the keypair of the deployed program.
 * This file is created when running `solana program deploy dist/program/helloworld.so`
 */
const PROGRAM_KEYPAIR_PATH = path.join(PROGRAM_PATH, 'helloworld-keypair.json');

/**
 * The state of a greeting account managed by the hello world program
 */


const PayoutAmount = (function () {
  function PayoutAmount(fields) {
    if (fields === void 0) { fields = undefined; }
    this.amount = "";
    this.count = 0;
    if (fields) {
      this.amount = fields.amount;
      this.count = fields.datatype;
    }
  }
  return PayoutAmount;
}());


const PayoutSchema = new Map([
  [PayoutAmount, { kind: 'struct', fields: [['amount', 'String'], ['count', 'u64']] }],
])


const ContestInstruction = (function () {
  function ContestInstruction(fields) {
    if (fields === void 0) { fields = undefined; }
    this.contestids = "";
    this.datatype = 0
    if (fields) {
      this.contestids = fields.contestids;
      this.datatype = fields.datatype;

    }
  }
  return ContestInstruction;
}());

const ContestSchema = new Map([
  [ContestInstruction, { kind: 'struct', fields: [['contestids', 'String'], ['datatype', 'u64']] }],
]);

/**
* The expected size of each greeting account.
*/

const GREETING_SIZE = borsh.serialize(
  PayoutSchema,
  new PayoutAmount(),
).length;

const PAYOUT_AMOUNT_SIZE = borsh.serialize(
  PayoutSchema,
  new PayoutAmount()
).length

/**
* Establish a connection to the cluster
*/

const establishConnection = async () => {

  //console.log('establishConnection')
  const rpcUrl = await getRpcUrl();
  const connection = new solanaWeb3.Connection(rpcUrl, 'confirmed');
  const version = await connection.getVersion();
  console.log('Connection to cluster established:', rpcUrl, version);
}


/**
* Establish an account to pay for everything
*/
const establishPayer = async () => {
  let payer = await getPayer();

  //console.log('establishPayer')

  let fees = 0;
  if (!payer) {
    const { feeCalculator } = await connection.getRecentBlockhash();

    // Calculate the cost to fund the greeter account
    fees += await connection.getMinimumBalanceForRentExemption(GREETING_SIZE);

    // Calculate the cost of sending transactions
    fees += feeCalculator.lamportsPerSignature * 100; // wag

    try {
      // Get payer from cli config
      payer = await getPayer();

    } catch (err) {
      // Fund a new payer via airdrop
      payer = await newAccountWithLamports(connection, fees);
    }
  }

  const lamports = await connection.getBalance(payer.publicKey);
  if (lamports < fees) {
    // This should only happen when using cli config keypair
    const sig = await connection.requestAirdrop(
      payer.publicKey,
      fees - lamports,
    );
    await connection.confirmTransaction(sig);
  }

  console.log(
    'Using account',
    payer.publicKey.toBase58(),
    'containing',
    lamports / solanaWeb3.LAMPORTS_PER_SOL,
    'SOL to pay for fees',
  );
}

/**
 * Check if the hello world BPF program has been deployed
 */
const checkProgram = async () => {
  //console.log('chkprogram')
  let payer = await getPayer();

  // Read program id from keypair file
  try {
    const programKeypair = await createKeypairFromFile(PROGRAM_KEYPAIR_PATH);
    //console.log(programKeypair)

    programId = programKeypair.publicKey;
  } catch (err) {
    const errMsg = err.message;
    throw new Error(
      `Failed to read program keypair at '${PROGRAM_KEYPAIR_PATH}' due to error: ${errMsg}. Program may need to be deployed with \`solana program deploy dist/program/helloworld.so\``,
    );
  }

  // Check if the program has been deployed
  const programInfo = await connection.getAccountInfo(programId);
  if (programInfo === null) {
    if (fs.existsSync(PROGRAM_SO_PATH)) {
      throw new Error(
        'Program needs to be deployed with `solana program deploy dist/program/helloworld.so`',
      );
    } else {
      throw new Error('Program needs to be built and deployed');
    }
  } else if (!programInfo.executable) {
    throw new Error(`Program is not executable`);
  }
  console.log(`Using program ${programId.toBase58()}`);

  // Derive the address (public key) of a greeting account from the program so that it's easy to find later.
  const GREETING_SEED = 'hello';
  greetedPubkey = await solanaWeb3.PublicKey.createWithSeed(
    payer.publicKey,
    GREETING_SEED,
    programId,
  );

  //console.log('greeted account' , greetedPubkey)

  // Check if the greeting account has already been created
  const greetedAccount = await connection.getAccountInfo(greetedPubkey);
  if (greetedAccount === null) {
    console.log(
      'program owned account',
      greetedPubkey.toBase58(),
    );
    const lamports = await connection.getMinimumBalanceForRentExemption(
      GREETING_SIZE,
    );

    const transaction = new solanaWeb3.Transaction().add(
      solanaWeb3.SystemProgram.createAccountWithSeed({
        fromPubkey: payer.publicKey,
        basePubkey: payer.publicKey,
        seed: GREETING_SEED,
        newAccountPubkey: greetedPubkey,
        lamports,
        space: 20,
        programId,
      }),
    );
    await solanaWeb3.sendAndConfirmTransaction(connection, transaction, [payer]);
  }
}

var requiredAccounts = new Array();

// var requiredAccounts = [
//   {
//     address: '8MNBtM2Qq7p5GfNApjhp2n9e9YLJzkJReyS1JFZtJEZW',
//     contestid: '0.00003'
//   },
//   {
//     address: 'BMRt6EihfG2PiGBK5dtZpyzLVQQ3EziSLfeNGKZCiy3t',
//     contestid: '12.0944'
//   },
//   {
//     address: 'H6s1ce7kLzxy267hxgWYbRbXJzQTKzhrKrjPYsuV7UWq',
//     contestid: '12.0944'
//   }
// ]

const logging = async() => {

  console.log('started logging')
  connection.onLogs(destinationKey, async function (logs, context) {
    console.log(logs)
    if (logs.err == null) {
      console.log("inside log block")
      let signature = logs.signature

      let payer_pubkey = await connection.getParsedConfirmedTransaction(signature);
      let account = await payer_pubkey.transaction.message.instructions
      let accounts = await account[0].parsed.info.source
      console.log(accounts)
      if (requiredAccounts.some(requiredAccount => requiredAccount.address === accounts)) {
         console.log("Account is already present")

      }else {
        console.log("reported greetings")
        const accountInfo = await connection.getAccountInfo(destinationKey);
        if (accountInfo === null) {
            throw 'Error: cannot find the greeted account';
        }
        const recievedata = borsh.deserialize(

          ContestSchema,
          ContestInstruction,
          accountInfo.data,
        );
        console.log(destinationKey.toBase58(),'contestid', recievedata.contestids);
        requiredAccounts.push({'address':accounts,'contestid':recievedata.contestids})
        console.log(requiredAccounts)

      }
      




    }
  })
}



/**
* Say hello
*/
console.log("Program started")
const sendPayouts = async (req, res) => {
 
    


  let payer = await getPayer();

  console.log('payouts from', greetedPubkey.toBase58());
  let source_keys = [{ pubkey: greetedPubkey, isSigner: false, isWritable: true}]
  let payout_accounts = []
  for (let i = 0; i < requiredAccounts.length; i++) {
    payout_accounts.push({"pubkey" : new solanaWeb3.PublicKey(requiredAccounts[i].address),isSigner: false, isWritable: true})

  }
  let payout_keys = [...source_keys,...payout_accounts]
  console.log(payout_keys.length-1)
  let payout_Amount = new PayoutAmount()
  payout_Amount.amount = "1.98550"
  console.log(payout_Amount)
  payout_Amount.count = payout_keys.length-1
  const account_signer_destination = await new solanaWeb3.PublicKey("8MNBtM2Qq7p5GfNApjhp2n9e9YLJzkJReyS1JFZtJEZW");

  
  const instruction = new solanaWeb3.TransactionInstruction(
    {
      
      keys:  payout_keys,
      programId,
      data: Buffer.from(borsh.serialize(PayoutSchema, payout_Amount)),
    });
  await solanaWeb3.sendAndConfirmTransaction(
    connection,
    new solanaWeb3.Transaction().add(instruction),
    [payer],
    { commitment: 'singleGossip', preflightCommitment: 'singleGossip', }
  ) .then(() => { console.log('transaction made to ' + requiredAccounts[i].address ) }).catch((e) => { console.log(e) });

}

const reportContest = async () => {
  console.log("reported greetings")
  const accountInfo = await connection.getAccountInfo(destinationKey);
  if (accountInfo === null) {
    throw 'Error: cannot find the greeted account';
  }
  const recievedata = borsh.deserialize(

    ContestSchema,
    ContestInstruction,
    accountInfo.data,
  );
  console.log(
    destinationKey.toBase58(),
    'contestid',
    recievedata

  );
}





module.exports = { sendPayouts, checkProgram, establishPayer, establishConnection, logging, reportContest }

/**
 * Report the number of times the greeted account has been said hello to
 */



//  let payer = await getPayer();
//   const destinationPubkey = new solanaWeb3.PublicKey('HJCLMisGueh1BbDZeH6AEBJmvgVg43qe7a9WE1NMFYdR')
//   let ContestID = new ContestInstruction()
//   ContestID.contestids = "tradla12"
//   ContestID.datatype = 0
//   const instruction = new solanaWeb3.TransactionInstruction(
//         {
//           keys: [{pubkey : destinationPubkey, isSigner : false,  isWritable: true},  
//           ],
//           programId,
//           data: Buffer.from(borsh.serialize(ContestSchema,ContestID)),
//         });
//       await solanaWeb3.sendAndConfirmTransaction(
//         connection,
//         new solanaWeb3.Transaction().add(instruction),
//         [payer],
//         { commitment: 'singleGossip', preflightCommitment: 'singleGossip', }
//       )