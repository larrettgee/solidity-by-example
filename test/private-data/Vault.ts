import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("Vault (Private Data)", function () {
  async function deployFixture() {
    const [deployer, user2] = await hre.ethers.getSigners();

    const Vault = await hre.ethers.getContractFactory("Vault");
    const vault = await Vault.deploy("0xf652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f");

    return { vault, user2 };
  }

  describe("Check Values", function () {
    it("Extract all the private data!", async function () {
      const { vault, user2 } = await loadFixture(deployFixture);

      // slot 0 - count
      expect(await ethers.provider.getStorage(vault, 0)).to.equal(
        "0x000000000000000000000000000000000000000000000000000000000000007b"
      );

      // slot 1 - u16, isTrue, owner
      expect(await ethers.provider.getStorage(vault, 1)).to.equal(
        "0x000000000000000000001f01f39fd6e51aad88f6f4ce6ab8827279cfffb92266"
      );

      // slot 2 - password
      expect(await ethers.provider.getStorage(vault, 2)).to.equal(
        "0xf652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f"
      );

      // slot 3 - empty (array), will be same for slot 4 and 5
      expect(await ethers.provider.getStorage(vault, 3)).to.equal(
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      );

      await vault.addUser("0xf652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d40");
      await vault.connect(user2).addUser("0xf652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d40");

      // slot 6 - length of array
      expect(await ethers.provider.getStorage(vault, 6)).to.equal(
        "0x0000000000000000000000000000000000000000000000000000000000000002"
      );
    });
  });
});
