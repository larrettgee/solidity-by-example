import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("Proxy Contract", function () {
  async function deployFixture() {
    // Deploy ProxyAdmin contract
    const ProxyAdmin = await hre.ethers.getContractFactory("ProxyAdmin");
    const proxyAdmin = await ProxyAdmin.deploy();

    // Deploy InnocentContract contract
    const InnocentContract = await hre.ethers.getContractFactory("InnocentContract");
    const innocentContract = await InnocentContract.deploy();

    // Deploy BadBoyContract contract
    const BadBoyContract = await hre.ethers.getContractFactory("BadBoyContract");
    const badBoyContract = await BadBoyContract.deploy();

    // Deploy Proxy contract with the address of ProxyAdmin
    const Proxy = await hre.ethers.getContractFactory("Proxy");
    const proxy = await Proxy.deploy(await proxyAdmin.getAddress());

    // Set the implementation of the Proxy to the InnocentContract
    await proxyAdmin.upgrade(await innocentContract.getAddress());

    return { proxyAdmin, innocentContract, proxy, badBoyContract };
  }

  describe("Upgrade to BadBoyContract", function () {
    it("should return 100 when calling getValue through the proxy after upgrade", async function () {
      const { proxy, proxyAdmin, badBoyContract } = await loadFixture(deployFixture);

      const proxyAsInnocentContract = await hre.ethers.getContractAt("InnocentContract", await proxy.getAddress());
      console.log(await proxyAsInnocentContract.getAddress());

      expect(await proxyAsInnocentContract.getValue()).to.equal(69);

      await proxyAdmin.upgrade(await badBoyContract.getAddress());

      const proxyAsBadBoyContract = await hre.ethers.getContractAt("BadBoyContract", await proxy.getAddress());
      console.log(await proxyAsBadBoyContract.getAddress());

      // Call getValue through the proxy, should return 100 after upgrade
      expect(await proxyAsBadBoyContract.getValue()).to.equal(100);
    });
  });
});
