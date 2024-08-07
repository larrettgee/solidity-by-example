import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("GuessTheRandomNumber", function () {
  async function deployFixture() {
    const [deployer, alice, eve] = await hre.ethers.getSigners();

    // Deploy GuessTheRandomNumber contract with 1 Ether
    const GuessTheRandomNumber = await hre.ethers.getContractFactory("GuessTheRandomNumber");
    const guessTheRandomNumber = await GuessTheRandomNumber.deploy({ value: hre.ethers.parseEther("1") });

    // Deploy Attack contract
    const Attack = await hre.ethers.getContractFactory("GuessAttack");
    const attack = await Attack.deploy();

    return { guessTheRandomNumber, attack, deployer, alice, eve };
  }

  describe("Attack", function () {
    it("should guess the random number and win 1 Ether", async function () {
      const { guessTheRandomNumber, attack, eve } = await loadFixture(deployFixture);

      // Initial balance of Attack contract should be 0
      expect(await hre.ethers.provider.getBalance(attack.getAddress())).to.equal(0);

      // Execute the attack
      await attack.connect(eve).attack(await guessTheRandomNumber.getAddress());

      // Check if the Attack contract balance is now 1 Ether
      expect(await hre.ethers.provider.getBalance(attack.getAddress())).to.equal(hre.ethers.parseEther("1"));
    });
  });
});
