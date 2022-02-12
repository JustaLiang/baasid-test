// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers, getNamedAccounts } from "hardhat";
import { ERC721Admin, ERC721Admin__factory } from "../typechain";
import LOCAL_CONFIG from "../deployments/localhost/ERC721Admin.json";
import BAASID_CONFIG from "../deployments/baasid/ERC721Admin.json";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const { provider } = ethers;

const getContract = (chainId: number, signer: SignerWithAddress) => {
  if (chainId === 1337) {
    return ERC721Admin__factory.connect(LOCAL_CONFIG.address, signer);
  } else if (chainId === 7414) {
    return ERC721Admin__factory.connect(BAASID_CONFIG.address, signer);
  } else {
    console.error("[ERROR] invalid network");
  }
}

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract
  const { admin, user1, user2 } = await getNamedAccounts();
  const adminSigner = await ethers.getSigner(admin);
  const network = await provider.getNetwork();
  const contract = getContract(network.chainId, adminSigner);
  if (!contract) return;

  // Mint
  const tokenIds = [...Array(10).keys()];
  const baseURI = "ipfs://QmQu2oEk2ZmeDFcoaJsCPSnFGPkoDUPWEyVhT6VRZSuxbz/";
  const startBlockNumber = await provider.getBlockNumber();
  await Promise.all(tokenIds.map(async (tid) => {
    try {
      const tx = await contract.mintTo(user1, tid, baseURI + tid);
      const receipt = await tx.wait();
      // console.log(receipt.blockNumber);
    } catch (err: any) {
      console.error("[ERROR]", err.data.message);
    }
  }));
  const endBlockNumber = await provider.getBlockNumber();
  console.log("Block cost:", endBlockNumber - startBlockNumber);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
