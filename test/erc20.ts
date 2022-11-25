import { expect } from "chai";
import { HomeToken } from "../typechain-types";
import hre from "hardhat";
const { network, ethers } = require("hardhat");
const { expect } = require("chai");
import type { SignerWithAddress   } from "@nomiclabs/hardhat-ethers/signers";


describe("ERC20", function () {
  let erc20Token: ERC20;
  let owner: SignerWithAddress
  let addr1: SignerWithAddress
  let addr2: SignerWithAddress

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();
    const ERC20Token = await hre.ethers.getContractFactory("ERC20", {signer: owner});
    erc20Token = await ERC20Token.deploy("BTC", "Bitcoin");
  });


  describe("Check contract constructor", () => {
    it("Should mint 1000 BTC tokes", async function () {
      const mint_amount = BigInt(1000 * 10 ** 18);
      const balance = await erc20Token.balanceOf(owner.address);
      expect(await balance).to.equal(mint_amount);
    });

    it("Check contract token name", async function () {
      const token_name = "BTC";
      expect(await erc20Token.name()).to.equal(token_name);
    });

    it("Check contract token symbol", async function () {
      const token_symbol = "Bitcoin";
      expect(await erc20Token.symbol()).to.equal(token_symbol);
    });

    it("Check contract total supply", async function () {
      const total_supply = BigInt(1000 * 10 ** 18);
      expect(await erc20Token.totalSupply()).to.equal(total_supply);
    });
  });

  describe("Check approve functionality", async function () {
    it("Check approve with owner address equal to zero", async function (){
      await expect(erc20Token._approve(ethers.constants.AddressZero, addr1.address, 10)).to.be.revertedWith('ERC20: approve from the zero address');
    });

    it("Check approve with sender address equal to 0", async function (){
      await expect(erc20Token.approve(ethers.constants.AddressZero, 10)).to.be.revertedWith( 'ERC20: approve to zero address');
    });

    it("Approve transaction to sender returns true", async function (){
      const approve_result = await erc20Token.approve(addr1.address, 10);
      expect(Boolean(approve_result.value)).to.equal(true);
    });
  });

  describe("Check function transfer", async function () {
    it("Check transaction success and Check addr1 received amount", async function(){
      let amount_to_sent = BigInt(1 * 10 ** 18);
      const transaction = await erc20Token.transfer(addr1.address, amount_to_sent);
      expect(Boolean(transaction.value)).to.equal(true);
      const addr1_balance = await erc20Token.balanceOf(addr1.address);
      expect(addr1_balance).to.equal(amount_to_sent);
    });

    it("Check transaction failed due to  transfer amount exceeds balance", async function(){
      let exedet_amount = BigInt(1001 * 10 ** 18);
      await expect(erc20Token.transfer(addr1.address, exedet_amount)).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    it("Check transaction owner dicrease in balace", async function() {
      let amount_to_sent = BigInt(1 * 10 ** 18);
      const owner_balance_before = await erc20Token.balanceOf(owner.address);
      await erc20Token.transfer(addr1.address, amount_to_sent);
      const owner_balance_after = await erc20Token.balanceOf(owner.address);
      const owner_balance_left = owner_balance_before.sub(amount_to_sent);
      expect(owner_balance_after).to.equal(owner_balance_left);
    });

    it("Check transaction failed receiver address equal to zero", async function(){
      await expect(erc20Token.transfer(ethers.constants.AddressZero, 10)).to.be.revertedWith("ERC20: trnsfer to the zero address");
    });

  });

  describe("Check function transferFrom", async function () {
    it("Check trasnferFrom failed due to allowance", async function() {
      await expect(erc20Token.transferFrom(owner.address, addr2.address, 10)).to.be.revertedWith("ERC20: insufficient allowance");
    });

    it("Check transferFrom allowance and balanceOf addr1", async function () {
      await erc20Token.approve(addr1.address, 100);
      const addr1_allowances = await erc20Token.allowance(owner.address, addr1.address);
      expect(addr1_allowances).to.equal(100);
      const transferFromTrans = await erc20Token.connect(addr1).transferFrom(owner.address, addr1.address, 100);
      expect(Boolean(transferFromTrans.value)).to.equal(true);
      expect(await erc20Token.balanceOf(addr1.address)).to.equal(100);
    });
  });

});
