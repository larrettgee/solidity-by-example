import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("HackMe", function () {
  async function deployFixture() {
    const [deployer, alice, eve] = await hre.ethers.getSigners();

    // Deploy Lib contract
    const Lib = await hre.ethers.getContractFactory("Lib");
    const lib = await Lib.deploy();

    // Deploy HackMe contract with the address of Lib
    const HackMe = await hre.ethers.getContractFactory("HackMe");
    const hackMe = await HackMe.deploy(await lib.getAddress());

    // Deploy Attack contract with the address of HackMe
    const Attack = await hre.ethers.getContractFactory("Attack");
    const attack = await Attack.deploy(await hackMe.getAddress());

    return { hackMe, attack, deployer, alice, eve };
  }

  describe("Attack", function () {
    it("should transfer ownership of HackMe to the attacker", async function () {
      const { hackMe, attack, deployer, eve } = await loadFixture(deployFixture);

      // Initial owner of HackMe should be the deployer
      expect(await hackMe.owner()).to.equal(deployer.address);

      // Execute the attack
      await attack.connect(eve).attack();

      // Check if the owner of HackMe is now the attack contract
      expect(await hackMe.owner()).to.equal(eve.address);
    });
  });
});