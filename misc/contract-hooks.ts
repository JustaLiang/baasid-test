import { ERC721Admin__factory } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { existsSync } from "fs";

const LOCAL_DEPLOYMENT = "./deployments/localhost/ERC721Admin.json";
const BAASID_DEPLOYMENT = "./deployments/baasid/ERC721Admin.json";

export const getContract = async (chainId: number, signer: SignerWithAddress) => {
    if (chainId === 1337) {
      if (existsSync(LOCAL_DEPLOYMENT)) {
        const deployment = await import("."+LOCAL_DEPLOYMENT).then((module) => module.default);
        console.log("contract address:", deployment.address);
        return ERC721Admin__factory.connect(deployment.address, signer);
      } else {
        console.error("[ERROR] localhost deployment not exists");
      }
    } else if (chainId === 7414) {
      if (existsSync(BAASID_DEPLOYMENT)) {
        const deployment = await import("."+BAASID_DEPLOYMENT).then((module) => module.default);
        console.log("contract address:", deployment.address);
        return ERC721Admin__factory.connect(deployment.address, signer);
      } else {
        console.error("[ERROR] baasid deployment not exists");
      }
    } else {
      console.error("[ERROR] invalid network");
    }
  }