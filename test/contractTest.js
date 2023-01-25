const { expect } = require("chai");
const { ethers } = require("hardhat");

// remember that this test will not work after
// you change the Bank.sol to avoid Renntrancy attack!

describe("deploy contract", () => {
  let deployer, attacker, user, Bank, Attack;

  beforeEach(async () => {
    [deployer, attacker, user] = await ethers.getSigners();

    const BankFactory = await ethers.getContractFactory("Bank", deployer);
    Bank = await BankFactory.deploy();

    await Bank.deposit({ value: ethers.utils.parseEther("100") });
    await Bank.connect(user).deposit({
      value: ethers.utils.parseEther("30"),
    });

    const AttackFactory = await ethers.getContractFactory("Attack", attacker);
    Attack = await AttackFactory.deploy(Bank.address);
  });

  describe("Test deposit and withdraw of Bank contract", () => {
    it("Should accept deposits", async () => {
      const deployerBal = await Bank.balanceOf(deployer.address);
      const userBal = await Bank.balanceOf(user.address);

      expect(await deployerBal).to.be.equal(ethers.utils.parseEther("100"));
      expect(await userBal).to.be.equal(ethers.utils.parseEther("30"));
    });
    it("should accept withdrawls", async () => {
      await Bank.withdraw();

      const deployerBal = await Bank.balanceOf(deployer.address);
      const userBal = await Bank.balanceOf(user.address);

      expect(await deployerBal).to.be.eq("0");
      expect(await userBal).to.be.eq(ethers.utils.parseEther("30"));
    });
    it("Perform Attack", async () => {
      console.log("---------------Before Attack---------------");
      console.log(
        `Bank's balance: ${ethers.utils
          .formatEther(await ethers.provider.getBalance(Bank.address))
          .toString()}`
      );
      console.log(
        `Attacker's balance: ${ethers.utils
          .formatEther(await ethers.provider.getBalance(attacker.address))
          .toString()}`
      );

      await Attack.attack({ value: ethers.utils.parseEther("10") });

      console.log(" -------------After------------");
      console.log("*** After ***");
      console.log(
        `Bank's balance: ${ethers.utils
          .formatEther(await ethers.provider.getBalance(Bank.address))
          .toString()}`
      );
      console.log(
        `Attackers's balance: ${ethers.utils
          .formatEther(await ethers.provider.getBalance(attacker.address))
          .toString()}`
      );

      expect(await ethers.provider.getBalance(Bank.address)).to.be.equal(0);
    });
  });
});
