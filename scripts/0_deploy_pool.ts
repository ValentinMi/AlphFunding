import { Deployer, DeployFunction, Network } from '@alephium/cli'
import { Settings } from '../alephium.config'
import { Pool } from '../artifacts/ts'
import { ZERO_ADDRESS } from '@alephium/web3'

// This deploy function will be called by cli deployment tool automatically
// Note that deployment scripts should prefixed with numbers (starting from 0)
const deployPool: DeployFunction<Settings> = async (
  deployer: Deployer
): Promise<void> => {
  const issueTokenAmount = 100n
  const result = await deployer.deployContract(Pool, {
    // The amount of token to be issued
    issueTokenAmount: issueTokenAmount,
    // The initial states of the faucet contract
    initialFields: {
        end: BigInt(Date.now() + 86400 * 100 * 7),
        goal: 10n,
        owner: "19jG4CADXWwdaCntVn3qteRUVYmJQxqDHkqyUHERZKwWr",
        totalCollected: 0n 
    }
  })
  console.log('Pool contract id: ' + result.contractInstance.contractId)
  console.log('Pool contract address: ' + result.contractInstance.address)
}

export default deployPool