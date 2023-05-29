const { ethers } = require('hardhat')
const { faker } = require('@faker-js/faker')
const fs = require('fs')
const toWei = (num) => ethers.utils.parseEther(num.toString())
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}
const args = (iteration) => {
  const imageUrl = [
    'https://img.icons8.com/external-microdots-premium-microdot-graphic/512/external-lottery-lifestyle-entertainment-vol3-microdots-premium-microdot-graphic.png',
    'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/512/external-lottery-casino-flaticons-lineal-color-flat-icons-2.png',
    'https://img.icons8.com/emoji/512/crossed-fingers-medium-dark-skin-tone.png',
    'https://img.icons8.com/ios-filled/512/atlantic-lottery-corp.png',
    'https://img.icons8.com/officel/512/win.png',
    'https://img.icons8.com/color/512/lotto.png',
  ]
  const title = faker.random.words(5)
  const description = faker.lorem.paragraph()
  const prize = toWei(faker.finance.amount(8, 16))
  const ticketPrice = toWei(faker.finance.amount(0.01, 0.05))
  const expiresAt = addMinutes(5000 * iteration)
  const image = shuffleArray(imageUrl)[0]

  return {
    title,
    description,
    prize,
    ticketPrice,
    expiresAt,
    image,
  }
}
const addMinutes = (minutes) => {
  const currentDate = new Date()
  const millisecondsPerMinute = 60 * 1000
  const newTimestamp = currentDate.getTime() + minutes * millisecondsPerMinute
  return newTimestamp
}
async function main() {
  const servicePercent = 7
  const iteration = 6
  const Contract = await ethers.getContractFactory('DappLottery')
  const contract = await Contract.deploy(servicePercent)
  await contract.deployed()
  let tx, result

  const createLottery = async ({ title, description, image, prize, ticketPrice, expiresAt }) => {
    tx = await contract.functions.createLottery(
      title,
      description,
      image,
      prize,
      ticketPrice,
      expiresAt
    )
    await tx.wait()
  }

  for (let i = 1; i <= iteration; i++) {
    await createLottery(args(i))
  }

  result = await contract.getLotteries()

  const address = JSON.stringify({ address: contract.address }, null, 4)

  fs.writeFile('./artifacts/contractAddress.json', address, 'utf8', (error) => {
    if (error) {
      console.log(error)
      return
    }
    console.log('Deployed contract address: ', contract.address)
  })
}
main().catch((err) => {
  console.log(err)
  process.exitCode = 1
})
