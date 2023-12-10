// User variables
const enterButton = document.getElementById('enterButton');
const productCodeInput = document.getElementById('productCode');
const productInfoDisplay = document.getElementById('productInfoDisplay');
// Manufacturer variables
const generateButton = document.getElementById('generateButton');
const modelInput = document.getElementById('model');
const serialNumberInput = document.getElementById('serialNumber');
const manufacturerNameInput = document.getElementById('manufacturerName');
const manufacturerLocationInput = document.getElementById('manufacturerLocation');
const manufacturerTimestampInput = document.getElementById('manufacturerTimestamp');
const generatedCodeDisplay = document.getElementById('generatedCodeDisplay');

const contractAddress = '0x690c4f34702E0430cD31accAe53879759A688229'; // Replace
const contractABI = [
  {
    "inputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "address",
        "name": "newManager",
        "type": "address"
      }
    ],
    "name": "addManager",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "address",
        "name": "manager",
        "type": "address"
      }
    ],
    "name": "removeManager",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "string",
        "name": "model",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "serialNumber",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "manufacturerName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "manufacturerLocation",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "manufacturerTimestamp",
        "type": "string"
      }
    ],
    "name": "generateCode",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "string",
        "name": "productCode",
        "type": "string"
      }
    ],
    "name": "getProductInfo",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];

// Create contract instance
const web3 = new Web3('http://127.0.0.1:7545');
const authContract = new web3.eth.Contract(contractABI, contractAddress);

// Enter Product Code Button
enterButton.onclick = async () => {
	const userInputCode = productCodeInput.value;
	try {
		const productInfo = await authContract.methods.getProductInfo(userInputCode).call(); // Call getProductInfo with user input
		// Display the retrieved information
		productInfoDisplay.innerHTML = `Model: ${productInfo[0]}<br>
									   Serial Number: ${productInfo[1]}<br>
									   Manufacturer Name: ${productInfo[2]}<br>
									   Manufacturer Location: ${productInfo[3]}<br>`;
	  } catch (error) {
		// Handle errors
		productInfoDisplay.innerHTML = "Invalid product code";
	  }
};

// Generate Product Code Button
generateButton.onclick = async () => {
	const accounts = await web3.eth.getAccounts();
	const model = modelInput.value;
	const serialNumber = serialNumberInput.value;
	const manufacturerName = manufacturerNameInput.value;
	const manufacturerLocation = manufacturerLocationInput.value;
	const manufacturerTimestamp = manufacturerTimestampInput.value;
  
	try {
	  const generatedCode = await authContract.methods.generateCode(
      model, 
      serialNumber, 
      manufacturerName, 
      manufacturerLocation,
      manufacturerTimestamp
    ).send({ from: accounts[0], gas: 200000 }); 

	  // Display generated code
    generatedCodeDisplay.innerHTML = `Generated Product Code`;
	  console.log('Generated Product Code:', generatedCode);
	} catch (error) {
	  // Handle errors
	  console.error('Error generating product code:', error);
	}
};