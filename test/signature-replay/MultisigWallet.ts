import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("BadMultiSigWallet", function () {
  async function deployFixture() {
    const [deployer, owner1, owner2, user] = await hre.ethers.getSigners();

    // Deploy BadMultiSigWallet contract
    const BadMultiSigWallet = await ethers.getContractFactory("BadMultiSigWallet");
    const badWallet = await BadMultiSigWallet.deploy([owner1.address, owner2.address]);

    // Deploy BadMultiSigWallet contract
    const GoodMultiSigWallet = await ethers.getContractFactory("GoodMultiSigWallet");
    const goodWallet = await GoodMultiSigWallet.deploy([owner1.address, owner2.address]);

    return { wallet: badWallet, goodWallet, deployer, owner1, owner2, user };
  }

  describe("Signature Reuse Attack", function () {
    it("should allow reuse of the same signatures for different transactions", async function () {
      const { wallet, owner1, owner2, user } = await loadFixture(deployFixture);

      // Deposit ether
      await wallet.deposit({ value: ethers.parseEther("10") });
      expect(await ethers.provider.getBalance(await wallet.getAddress())).to.equal(ethers.parseEther("10"));

      const amount = ethers.parseEther("1");

      // Create a valid transaction hash
      const txHash = await wallet.getTxHash(user.address, amount);

      // Sign the transaction hash by both owners
      const sig1 = await owner1.signMessage(ethers.toBeArray(txHash));
      const sig2 = await owner2.signMessage(ethers.toBeArray(txHash));

      // Use the signatures to transfer to user
      await wallet.transfer(user.address, amount, [sig1, sig2]);
      expect(await ethers.provider.getBalance(await wallet.getAddress())).to.equal(ethers.parseEther("9"));
      expect(await ethers.provider.getBalance(user.address)).to.equal(ethers.parseEther("10001"));

      // Reuse the same signatures to transfer again
      await wallet.transfer(user.address, amount, [sig1, sig2]);
      expect(await ethers.provider.getBalance(await wallet.getAddress())).to.equal(ethers.parseEther("8"));
    });

    it("Should stop reuse of transactions", async function () {
      const { goodWallet: wallet, owner1, owner2, user } = await loadFixture(deployFixture);

      // Deposit ether
      await wallet.deposit({ value: ethers.parseEther("10") });
      expect(await ethers.provider.getBalance(await wallet.getAddress())).to.equal(ethers.parseEther("10"));

      const amount = ethers.parseEther("1");

      // Create a valid transaction hash
      const txHash = await wallet.getTxHash(user.address, amount, 0);

      // Sign the transaction hash by both owners
      const sig1 = await owner1.signMessage(ethers.toBeArray(txHash));
      const sig2 = await owner2.signMessage(ethers.toBeArray(txHash));

      // Use the signatures to transfer to user
      await wallet.transfer(user.address, amount, 0, [sig1, sig2]);
      expect(await ethers.provider.getBalance(await wallet.getAddress())).to.equal(ethers.parseEther("9"));
      expect(await ethers.provider.getBalance(user.address)).to.equal(ethers.parseEther("10001"));

      // Reuse the same signatures to transfer again
      await expect(wallet.transfer(user.address, amount, 0, [sig1, sig2])).to.be.reverted;
      await expect(wallet.transfer(user.address, amount, 1, [sig1, sig2])).to.be.reverted;
    });
  });
});
