// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

contract ProductAuthenticator {
    address owner;
    mapping(address => bool) managers;

    // Struct to store product information
    struct Product {
        string model;
        string serialNumber;
        string manufacturerName;
        string manufacturerLocation;
        string manufacturerTimestamp;
    }

    // Mapping for products
    mapping(string => Product) products;
    mapping(string=> bool) productExists;

    // Modifiers
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    modifier onlyManager {
        require(managers[msg.sender], "Only managers can perfom this role.");
        _;
    }

    // Sets address of initializer to owner
    constructor() public {
        owner = msg.sender;
        managers[msg.sender] = true;

        initializeTestProduct();
    } 

    // Function to add a new manager
    function addManager(address newManager) public onlyOwner {
        managers[newManager] = true;
    }
 
    // Function to remove a manager
    function removeManager(address manager) public onlyOwner {
        require(manager != owner, "Owner cannot be removed as a manager.");
        managers[manager] = false;
    }

    // Function to generate new product code; Originally wanted to generate QR Codes, but used a simple code for simplicity
    function generateCode(string memory model, string memory serialNumber, string memory manufacturerName, string memory manufacturerLocation, string memory manufacturerTimestamp) public onlyManager returns(string memory){
        string memory productCode = string(abi.encodePacked(model, serialNumber, manufacturerTimestamp));

        Product memory newProduct = Product(model, serialNumber, manufacturerName, manufacturerLocation, manufacturerTimestamp);
        products[productCode] = newProduct;
        productExists[productCode] = true;

        return productCode;
    }


    // Function to search if the user inputted product code exists on the blockchain, if it does, then gives user information about the product
    function getProductInfo(string memory productCode) public view returns (string memory, string memory, string memory, string memory) {
        require(productExists[productCode], "Product does not exist");
        Product memory product = products[productCode];

        return (
            product.model,
            product.serialNumber,
            product.manufacturerName,
            product.manufacturerLocation
        );
    }

    // Function to initialize the contract with a test product
    function initializeTestProduct() internal {
        string memory testModel = "TestModel";
        string memory testSerialNumber = "123456789";
        string memory testManufacturerName = "TestManufacturer";
        string memory testManufacturerLocation = "TestLocation";
        string memory testManufacturerTimestamp = "2023-12-01";

        string memory testProductCode = generateCode(
            testModel,
            testSerialNumber,
            testManufacturerName,
            testManufacturerLocation,
            testManufacturerTimestamp
        );
    }
}