const { ethers } = require('hardhat')
const fs = require('fs')
async function main() {
  const servicePercent = 7
  const ContractLottery = await ethers.getContractFactory('DappLottery')
  const lottery = await ContractLottery.deploy(servicePercent)
  await lottery.deployed()
  const address = JSON.stringify({ address: lottery.address }, null, 4)
  fs.writeFile('./artifacts/contactAddress.json', address, 'utf8', (err) => {
    if (err) {
      console.log(err)
      return
    }
    console.log('Deployed contract address', lottery.address)
  })
}
main().catch((err) => {
  console.log(err)
  process.exitCode = 1
})
