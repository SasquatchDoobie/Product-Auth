const ProductAuthenticator = artifacts.require('ProductAuthenticator');
const truffleAssert = require('truffle-assertions');

contract('ProductAuthenticator', function(accounts) {
  const onlyOwnerError = 'Only owner can perform this operation'
  const success = '0x01'
  
  let productAuthenticator;

  beforeEach('Setup contract for each test', async function() {
    productAuthenticator = await ProductAuthenticator.new({ from: accounts[0] })
  });

  // Tests adding addManager()
  it('Success on owner adding new managers', async function() {
    let result = await productAuthenticator.addManager(accounts[1], { from: accounts[0]})
    assert.equal(result.receipt.status, success, 'Adding manager failed')
  });

  // Tests onlyOwner modifier on addManager()
  it('Failure on adding manager by non-owner', async function() {
    // Tests for a user with no role trying to add manager
    await truffleAssert.reverts(
      productAuthenticator.addManager(accounts[1], { from: accounts[2]}),
      truffleAssert.ErrorType.REVERT,
      onlyOwnerError
    )
    // Tests for a user with manager role trying to add another manager
    await productAuthenticator.addManager(accounts[1], { from: accounts[0]})
    await truffleAssert.reverts(
      productAuthenticator.addManager(accounts[2], { from: accounts[1] }),
      truffleAssert.ErrorType.REVERT,
      onlyOwnerError
    )
  });

  // Tests onlyOwner modifer on removeManager()
  it('Failure on removing manager by non-owner', async function() {
    // Tests for a user with no role trying to remove manager
    await productAuthenticator.addManager(accounts[1], { from: accounts[0]})
    await truffleAssert.reverts(
      productAuthenticator.removeManager(accounts[1], { from: accounts[2]}),
      truffleAssert.ErrorType.REVERT,
      onlyOwnerError
    )
    // Tests for a user with manager role trying to remove another manager
    await productAuthenticator.addManager(accounts[2], { from: accounts[0]})
    await truffleAssert.reverts(
      productAuthenticator.removeManager(accounts[1], { from: accounts[2]}),
      truffleAssert.ErrorType.REVERT,
      onlyOwnerError
    )
  });

  // Tests generateCode() and getProductInfor()
  it('Should generate product code and retrieve product information', async function() {
    const model = 'TestModel';
    const serialNumber = '123456789';
    const manufacturerName = 'TestManufacturer';
    const manufacturerLocation = 'TestLocation';
    const manufacturerTimestamp = '2023-12-01';

    await productAuthenticator.generateCode(model, serialNumber, manufacturerName, manufacturerLocation, manufacturerTimestamp, { from: accounts[0] });
    const productCode = await productAuthenticator.generateCode.call(model, serialNumber, manufacturerName, manufacturerLocation, manufacturerTimestamp);
    const productInfo = await productAuthenticator.getProductInfo(productCode);

    assert.equal(productInfo[0], model, 'Incorrect model retrieved');
    assert.equal(productInfo[1], serialNumber, 'Incorrect serial number retrieved');
    assert.equal(productInfo[2], manufacturerName, 'Incorrect manufacturer name retrieved');
    assert.equal(productInfo[3], manufacturerLocation, 'Incorrect manufacturer location retrieved');
  });
});
