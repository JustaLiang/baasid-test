import { ERC721Admin__factory, ERC20Mojo__factory } from "../typechain";
import { ethers } from "hardhat";
const { provider } = ethers;

type ArtifactMap = { [chainId: number]: string };

export const artifactMap: ArtifactMap = {
  1337: "../deployments/localhost/",
  7414: "../deployments/baasid/",
  5079: "../deployments/baasid_120/",
}

export const getERC721Admin = async () => {
  const network = await provider.getNetwork();
  const chainId = network.chainId;
  const [signer] = await ethers.getSigners();
  const prefix = artifactMap[chainId];
  if (!prefix) {
    console.error("[ERROR] invalid network");
    return
  }
  const artifactJson = prefix + 'ERC721Admin.json';
  const deployment = require(artifactJson);
  if (deployment) {
    console.log("contract address:", deployment.address);
    return ERC721Admin__factory.connect(deployment.address, signer);
  } else {
    console.error(`[ERROR] deployment not exists (${chainId})`);
  }
}

export const getERC20Mojo = async () => {
  const network = await provider.getNetwork();
  const chainId = network.chainId;
  const [signer] = await ethers.getSigners();
  const prefix = artifactMap[chainId];
  if (!prefix) {
    console.error("[ERROR] invalid network");
    return
  }
  const artifactJson = prefix + 'ERC20Mojo.json';
  const deployment = require(artifactJson);
  if (deployment) {
    console.log("contract address:", deployment.address);
    return ERC20Mojo__factory.connect(deployment.address, signer);
  } else {
    console.error(`[ERROR] deployment not exists (${chainId})`);
  }
}