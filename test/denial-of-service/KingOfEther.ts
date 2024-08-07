import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("KingOfEther", function () {
  async function deployFixture() {
    const [deployer, alice, bob, eve] = await hre.ethers.getSigners();

    // Deploy KingOfEther contract
    const KingOfEther = await hre.ethers.getContractFactory("KingOfEther");
    const kingOfEther = await KingOfEther.deploy();

    // Deploy KingAttack contract with the address of KingOfEther
    const KingAttack = await hre.ethers.getContractFactory("KingAttack");
    const kingAttack = await KingAttack.deploy(await kingOfEther.getAddress());

    return { kingOfEther, kingAttack, deployer, alice, bob, eve };
  }

  describe("Attack", function () {
    it.only("should allow players to claim the throne and then block new claims", async function () {
      const { kingOfEther, kingAttack, deployer, alice, bob, eve } = await loadFixture(deployFixture);

      // Alice claims the throne by sending 1 Ether
      await kingOfEther.connect(alice).claimThrone({ value: hre.ethers.parseEther("1") });
      expect(await kingOfEther.king()).to.equal(alice.address);
      expect(await hre.ethers.provider.getBalance(await kingOfEther.getAddress())).to.equal(hre.ethers.parseEther("1"));

      // Bob claims the throne by sending 2 Ether
      await kingOfEther.connect(bob).claimThrone({ value: hre.ethers.parseEther("2") });
      expect(await kingOfEther.king()).to.equal(bob.address);
      expect(await hre.ethers.provider.getBalance(await kingOfEther.getAddress())).to.equal(hre.ethers.parseEther("2"));

      // Eve deploys the KingAttack contract and performs the attack with 3 Ether
      await kingAttack.connect(eve).attack({ value: hre.ethers.parseEther("3") });
      expect(await kingOfEther.king()).to.equal(await kingAttack.getAddress());
      expect(await hre.ethers.provider.getBalance(await kingOfEther.getAddress())).to.equal(hre.ethers.parseEther("3"));

      // Attempt to reclaim the throne by Alice with 4 Ether should fail
      await expect(kingOfEther.connect(alice).claimThrone({ value: hre.ethers.parseEther("4") })).to.be.revertedWith(
        "Failed to send Ether"
      );
    });
  });
});
