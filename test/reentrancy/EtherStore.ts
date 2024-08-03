import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("EtherStore", function () {
  async function deployFixture() {
    const [deployer, victim, attacker] = await hre.ethers.getSigners();

    const EtherStore = await hre.ethers.getContractFactory("EtherStore");
    const etherStore = await EtherStore.deploy();

    const EtherStoreAttack = await hre.ethers.getContractFactory("EtherStoreAttack");
    const etherStoreAttack = await EtherStoreAttack.deploy(await etherStore.getAddress());

    return { etherStore, etherStoreAttack, deployer, victim, attacker };
  }

  describe("Attack", function () {
    it("Attack the vulnerable EtherStore contract.", async function () {
      const { etherStore, etherStoreAttack, deployer, victim, attacker } = await loadFixture(deployFixture);

      // Deposit with victim
      await etherStore.connect(victim).deposit({ value: hre.ethers.parseEther("5") });

      // Attack the vulnerable contract
      await etherStoreAttack.connect(attacker).attack({ value: hre.ethers.parseEther("1") });

      // Check if the balance of the victim is > 0 (e.g., contract has not updated the balance)
      expect(await etherStore.balances(victim)).to.equal(hre.ethers.parseEther("5"));

      // check if ether balance of the contract is zero
      expect(await hre.ethers.provider.getBalance(etherStore.getAddress())).to.equal(0);
    });
  });
});
