const os = require('os')
const path = require('path');
const fs  = require('mz/fs')
const yaml = require('yaml')
const solanaWeb3 = require('@solana/web3.js');
const NETWORK = solanaWeb3.clusterApiUrl('devnet');

/**
 * Connection to the network
 */

const newAccountWithLamports = async  (
    connection = new solanaWeb3.Connection(NETWORK),
    lamports = 1000000,
  ) =>{
    //console.log('newAccountWithLamports')

    const keypair = solanaWeb3.Keypair.generate();
    const signature = await connection.requestAirdrop(
      keypair.publicKey,
      lamports,
    );
    await connection.confirmTransaction(signature);
    return keypair;
  }

  //gets config file to to determine the cluster and payer
  const getConfig = async  ()=>{
    // Path to Solana CLI config file
    const CONFIG_FILE_PATH = path.resolve(
      os.homedir(),
      '.config',
      'solana',
      'cli',
      'config.yml',
    );
    const configYml = await fs.readFile(CONFIG_FILE_PATH, {encoding: 'utf8'});
    return yaml.parse(configYml);
  }

/**
 * Load and parse the Solana CLI config file to determine which RPC url to use
 */

  const getRpcUrl =  async () =>{
    //console.log('getRpcUrl')

    try {
      const config = await getConfig();
      if (!config.json_rpc_url) throw new Error('Missing RPC URL');
      return config.json_rpc_url;
    } catch (err) {
      console.warn(
        'Failed to read RPC url from CLI config file, falling back to localhost',
      );
      return 'http://localhost:8899';
    }
  }

  /**
 * Load and parse the Solana CLI config file to determine which payer to use
 */

   const getPayer = async() => {
    //console.log('getpayer')

    try {
      const config = await getConfig();
      if (!config.keypair_path) throw new Error('Missing keypair path');
      return createKeypairFromFile(config.keypair_path);
    } catch (err) {
      console.warn(
        'Failed to create keypair from CLI config file, falling back to new random keypair',
      );
      return solanaWeb3.Keypair.generate();
    }
  }

  /**
 * Create a Keypair from a secret key stored in file as bytes' array
 */
    const createKeypairFromFile = async(
    filePath = "",
  )=>{
    //console.log('createKeypairFromFile')

    const secretKeyString = await fs.readFile(filePath, {encoding: 'utf8'});
    const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    return solanaWeb3.Keypair.fromSecretKey(secretKey);
  }

module.exports = {createKeypairFromFile,getPayer,getRpcUrl,getConfig,newAccountWithLamports}