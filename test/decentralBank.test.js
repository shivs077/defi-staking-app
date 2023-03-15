const Tether = artifacts.require("Tether");
const RWD = artifacts.require("RWD");
const DecentralBank = artifacts.require("DecentralBank");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("DecentralBank", ([owner, customer]) => {
  // All the code goes here for testing
  let tether, rwd, decentralBank;

  function tokens(number) {
    return web3.utils.toWei(number, "ether");
  }
  before(async () => {
    tether = await Tether.new();
    rwd = await RWD.new();
    decentralBank = await DecentralBank.new(rwd.address, tether.address);

    // Transfer all reward tokens to decentral bank
    await rwd.transfer(decentralBank.address, tokens("1000000"));

    // Transfer 100 mock Tethers to Customer
    await tether.transfer(customer, tokens("100"), { from: owner });
  });

  describe("Mock Tether Deployment", async () => {
    it("matches name successfully", async () => {
      const name = await tether.name();
      assert.equal(name, "Tether");
    });
  });

  describe("Reward Token", async () => {
    it("matches name successfully", async () => {
      const name = await rwd.name();
      assert.equal(name, "Reward Token");
    });
  });

  describe("Customer Balance", async () => {
    it("Customer has 100 Tokens", async () => {
      const customerBalance = await tether.balanceOf(customer);
      const updatedBal = await web3.utils.fromWei(customerBalance);
      assert.equal(updatedBal, "100");
    });
  });

  describe("Decentral Bank Balance", async () => {
    it("matches name successfully", async () => {
      const name = await decentralBank.name();
      assert.equal(name, "Decentral Bank");
    });
    it("Decentral Bank has 1 mil reward tokens", async () => {
      const decentralBankAmount = await rwd.balanceOf(decentralBank.address);
      assert.equal(decentralBankAmount.toString(), tokens("1000000"));
    });
  });

  describe("Yield Farming", async () => {
    it("Reward tokens for staking", async () => {
      let result = await tether.balanceOf(customer);

      //check investor balance
      assert.equal(
        result.toString(),
        tokens("100"),
        "customer mock wallet balance before staking"
      ); // customer mock wallet balance before staking

      // check staking customer
      await tether.approve(decentralBank.address, tokens("100"), {
        from: customer,
      });

      await decentralBank.depositTokens(tokens("100"), { from: customer });

      // check updated balance of customer
      result = await tether.balanceOf(customer);

      assert.equal(
        result.toString(),
        tokens("0"),
        "customer mock wallet balance after staking"
      ); // customer mock wallet balance before staking

      //check updated balance of decentral bank
      let decentralBalance = await tether.balanceOf(decentralBank.address);
      assert.equal(
        decentralBalance.toString(),
        tokens("100"),
        "bank mock wallet balance after staking"
      );

      // Is staking update
      result = await decentralBank.isStaking(customer);
      assert.equal(result, true, "customer is staking status after staking");

      // Issue tokens
      await decentralBank.issueTokens({ from: owner });

      // Ensure only the Owner can issue tokens
      await decentralBank.issueTokens({ from: customer }).should.be.rejected;

      // Unstake tokens
      await decentralBank.unstakeTokens({ from: customer });

      // check unstaking balances
      result = await tether.balanceOf(customer);

      assert.equal(
        result.toString(),
        tokens("100"),
        "customer mock wallet balance after unstaking"
      ); // customer mock wallet balance before staking

      // Is staking update
      result = await decentralBank.isStaking(customer);
      assert.equal(result, false, "customer is staking status after unstaking");
      //check updated balance of decentral bank
      decentralBalance = await tether.balanceOf(decentralBank.address);
      assert.equal(
        decentralBalance.toString(),
        tokens("0"),
        "bank mock wallet balance after staking"
      );
    });
  });
});
