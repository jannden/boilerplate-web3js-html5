# Web3.js in HTML5 Boilerplate

This boilerplate uses Web3.js and MetaMask to connect to blockchain in HTML5.

It also shows an example of:

- using a web3 method
- using call() on a contract's method that doesn't require gas
- using send() on a contract's method that requires gas
- subscribing to an Event

## How to use

1. You should have a smart contract deployed to the blockchain first. If you don't, you can deploy `./SampleContract.sol` with `remix.ethereum.org`. Take a note of the deployed contract's address.
2. Set the variables `contractAddress` and `contractAbi` in `./index.js`. The `contractAbi` takes a path to a JSON file. You will find the ABI for `./SampleContract.sol` in `./sampleAbi.json`.
3. Make sure you have the MetaMask Chrome plugin activated and you are logged in to your account.
4. Run `./index.html` in localhost (to start a localhost, you can use the Live Server extension for VS Code for example).
