import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("Bar2", function () {
  async function deployFixture() {
    const [deployer, user] = await hre.ethers.getSigners();

    // Deploy Bar2 contract, which internally deploys Foo2
    const Bar2 = await ethers.getContractFactory("Bar2");
    const bar = await Bar2.deploy();

    return { bar, deployer, user };
  }

  describe("tryCatchExternalCall", function () {
    it("should emit 'external call failed' when myFunc is called with 0", async function () {
      const { bar } = await loadFixture(deployFixture);

      // Capture the emitted event
      await expect(bar.tryCatchExternalCall(0)).to.emit(bar, "Log").withArgs("external call failed");
    });

    it("should emit 'my func was called' when myFunc is called with non-zero value", async function () {
      const { bar } = await loadFixture(deployFixture);

      // Capture the emitted event
      await expect(bar.tryCatchExternalCall(1)).to.emit(bar, "Log").withArgs("my func was called");
    });
  });

  describe("tryCatchNewContract", function () {
    it("should emit 'invalid address' when Foo2 is created with the zero address", async function () {
      const { bar } = await loadFixture(deployFixture);

      // Capture the emitted event
      await expect(bar.tryCatchNewContract(ethers.ZeroAddress)).to.emit(bar, "Log").withArgs("invalid address");
    });

    it("should emit empty bytes when Foo2 is created with address(1)", async function () {
      const { bar } = await loadFixture(deployFixture);

      // Capture the emitted event
      await expect(bar.tryCatchNewContract("0x0000000000000000000000000000000000000001")).to.emit(bar, "LogBytes");
    });

    it("should emit 'Foo2 created' when Foo2 is created with a valid address", async function () {
      const { bar, user } = await loadFixture(deployFixture);

      // Capture the emitted event
      await expect(bar.tryCatchNewContract(await user.getAddress()))
        .to.emit(bar, "Log")
        .withArgs("Foo created");
    });
  });
});
