import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("EtherGame", function () {
  async function deployFixture() {
    const [deployer, victim, attacker] = await hre.ethers.getSigners();

    const EtherGame = await ethers.getContractFactory("EtherGame");
    const etherGame = await EtherGame.deploy();

    const EtherGameAttack = await ethers.getContractFactory("EtherGameAttack");
    const etherGameAttack = await EtherGameAttack.deploy(await etherGame.getAddress());

    return { etherGame, etherGameAttack, deployer, victim, attacker };
  }

  describe("Attack", function () {
    it.only("Attack the vulnerable EtherGame contract.", async function () {
      const { etherGame, etherGameAttack, deployer, victim, attacker } = await loadFixture(deployFixture);

      // Deposit ether
      await etherGame.connect(deployer).deposit({ value: ethers.parseEther("1") });
      await etherGame.connect(victim).deposit({ value: ethers.parseEther("1") });

      // Attack the vulnerable contract
      await etherGameAttack.connect(attacker).attack({ value: ethers.parseEther("5") });

      // check if ether balance of the contract is zero
      expect(await ethers.provider.getBalance(etherGame)).to.equal(ethers.parseEther("7"));
    });
  });
});
