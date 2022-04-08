/*** SET THESE VARIABLES ***/
const contractAddress = ""; // Update with the address of your smart contract
const contractAbi = ""; // Update with an ABI file, for example "./sampleAbi.json"

/*** Global scope variables that will be automatically assigned values later on ***/
let infoSpace; // This is an <ul> element where we will print out all the info
let web3; // Web3 instance
let contract; // Contract instance
let account; // Your account as will be reported by Metamask

/*** Initialize when page loads ***/
window.addEventListener("load", () => {
  // Shortcut to interact with HTML elements
  infoSpace = document.querySelector(".info");

  // Check whether ethereum is defined, ie. MetaMask plugin is active
  document.querySelector(".start").addEventListener("click", async () => {
    if (contractAddress === "" || contractAbi === "") {
      printResult(
        `Make sure to set the variables <code>contractAddress</code> and <code>contractAbi</code> in <code>./index.js</code> first. Check out <code>README.md</code> for more info.`
      );
      return;
    }

    if (typeof ethereum === "undefined") {
      printResult(
        `Metamask not connected. Make sure you have the Metamask plugin, you are logged in to your MetaMask account, and you are using a server or a localhost (simply opening the html in a browser won't work).`
      );
      return;
    }

    // Create a Web3 instance
    web3 = new Web3(window.ethereum);

    // Calling desired functions
    await connectWallet();
    await connectContract(contractAbi, contractAddress);
    await getBalance(account);
    await balanceOf(account);
    const transferAmount = web3.utils.toWei("1"); // This is a necessary conversion, contract methods use Wei, we want a readable Ether format
    listenToTransferEvent(account, contractAddress, transferAmount); // Not an async function
    await transfer(contractAddress, transferAmount);
  });
});

/*** Functions ***/

// Helper function to print results
const printResult = (text) => {
  infoSpace.innerHTML += `<li>${text}</li>`;
};

// Helper function to display readable address
const readableAddress = (address) => {
  return `${address.slice(0, 5)}...${address.slice(address.length - 4)}`;
};

// Helper function to get JSON (in order to read ABI in our case)
const getJson = async (path) => {
  const response = await fetch(path);
  const data = await response.json();
  return data;
};

// Connect to the MetaMast wallet
const connectWallet = async () => {
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  account = accounts[0];
  printResult(`Connected account: ${readableAddress(account)}`);
};

// Connect to the contract
const connectContract = async (contractAbi, contractAddress) => {
  const data = await getJson(contractAbi);
  const contractABI = data.abi;
  contract = new web3.eth.Contract(contractABI, contractAddress);
};

// Example of a web3 method
const getBalance = async (address) => {
  printResult(`getBalance() requested.`);
  const balance = await web3.eth.getBalance(address);
  printResult(`Account ${readableAddress(account)} has ${web3.utils.fromWei(balance)} currency`);
};

// Example of using call() on a contract's method that doesn't require gas
const balanceOf = async (account) => {
  printResult(`balanceOf() called.`);
  try {
    const balance = await contract.methods.balanceOf(account).call();
    printResult(`Account ${readableAddress(account)} has ${web3.utils.fromWei(balance)} tokens.`);
  } catch (error) {
    printResult(`Error: ${error.message}`);
  }
};

// Example of using send() on a contract's method that requires gas
const transfer = async (to, amount) => {
  printResult(`transfer() sent.`);
  try {
    const result = await contract.methods.transfer(to, amount).send({ from: account });
    printResult(`Result: ${result.status}`);
  } catch (error) {
    printResult(`Error: ${error.message}`);
  }
};

// Example of subscribing to an Event
const listenToTransferEvent = (account, otherAccount, transferAmount) => {
  contract.events
    .Transfer(account, otherAccount, transferAmount)
    .on("data", console.log)
    .on("error", console.error);
};
