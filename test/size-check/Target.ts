import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("Target", function () {
  async function deployFixture() {
    const [deployer, user, attacker] = await hre.ethers.getSigners();

    // Deploy Target contract
    const Target = await ethers.getContractFactory("Target");
    const target = await Target.deploy();

    // Deploy FailedAttack contract
    const FailedAttack = await ethers.getContractFactory("FailedAttack");
    const failedAttack = await FailedAttack.deploy();

    return { target, failedAttack, deployer, user, attacker };
  }

  describe("Protected Function", function () {
    it("should prevent contracts from calling the protected function", async function () {
      const { target, failedAttack, attacker } = await loadFixture(deployFixture);

      // Attempt to call the protected function from the FailedAttack contract
      await expect(failedAttack.connect(attacker).pwn(await target.getAddress())).to.be.revertedWith(
        "no contract allowed"
      );

      // Ensure the Target contract was not pwned
      expect(await target.pwned()).to.equal(false);
    });

    it("should allow the Hack contract to call the protected function during construction", async function () {
      const { target } = await loadFixture(deployFixture);

      // Deploy Hack contract, which should bypass the isContract check during construction
      const Hack = await ethers.getContractFactory("Hack");
      const hack = await Hack.deploy(await target.getAddress());

      // Ensure the Target contract was pwned
      expect(await target.pwned()).to.equal(true);
    });

    it("should detect contract address correctly", async function () {
      const { target, deployer, user } = await loadFixture(deployFixture);

      // Check if the deployer and user are detected as non-contract addresses
      expect(await target.isContract(deployer.address)).to.equal(false);
      expect(await target.isContract(user.address)).to.equal(false);

      // Check if the Target contract itself is detected as a contract address
      expect(await target.isContract(await target.getAddress())).to.equal(true);
    });
  });
});
