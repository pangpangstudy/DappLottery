const { expect, assert } = require('chai')
const { faker } = require('@faker-js/faker')
const { network } = require('hardhat')
//
const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)
const addDays = (days) => {
  const currentDate = new Date()
  const millisecondsPerDay = 24 * 60 * 60 * 1000
  const newTimestamp = currentDate.getTime() + days * millisecondsPerDay
  return newTimestamp
}

//count--> luckyNumber数量
const generateLuckyNumber = (count) => {
  const result = []
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < count; i++) {
    let string = ''
    for (let j = 0; j < 6; j++) {
      string += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    result.push(string)
  }

  return result
}
// test  测试思路 1，检查函数执行前的状态 2.检查函数执行后的状态
describe('DappLottery', () => {
  let LotteryContract, lottery, result
  //---------------------------
  //合约参数
  const servicePercent = 5
  const title = faker.random.words(5)
  const description = faker.lorem.paragraph(5)
  const image = faker.image.imageUrl()
  const prize = toWei(10)
  const ticketPrice = toWei(0.01)
  const expiresAt = addDays(7)
  const lotteryId = 1
  const generateLuckyNumberCount = 5
  const numberOfWinners = 2
  //-------------------------
  beforeEach(async () => {
    LotteryContract = await ethers.getContractFactory('DappLottery')
    // 语句加入分号是为了避免解析错误  分号代表与上一句代码无关
    ;[serviceAccount, participant1, participant2, participant3, participant4, participant5] =
      await ethers.getSigners()
    lottery = await LotteryContract.deploy(servicePercent)
    await lottery.deployed()
  })
  describe('Deployed State', () => {
    it('deployer address = lottery.owner && constructor arg servicePercent ', async () => {
      result = await lottery.owner() //owner 是 Ownable合约库的方法
      expect(result).to.be.equal(serviceAccount.address)
      result = await lottery.servicePercent() //个人理解因为公开的变量都会被自动添加view函数，所以请求查看lottery的servicePercent的值是，应将其当作函数对待
      expect(result.toNumber() /**bigNumber */).to.be.equal(servicePercent)
    })
  })
  // create lottery
  describe('create lottery', () => {
    it('confirm create lottery', async () => {
      result = await lottery.getLotteries()
      assert.equal(result.length, 0) //<--
      expect(result).to.have.lengthOf(0) //<--

      await lottery.createLottery(title, description, image, prize, ticketPrice, expiresAt)
      result = await lottery.getLotteries()
      expect(result).to.have.lengthOf(1) //<--
    })
  })
  // luckyNumber generation
  describe('luckyNumber Generation', () => {
    beforeEach(async () => {
      await lottery.createLottery(title, description, image, prize, ticketPrice, expiresAt)
    })
    it('confirm lucky number import', async () => {
      result = await lottery.getLotteryLuckyNumbers(lotteryId)
      expect(result).to.have.lengthOf(0)
      await lottery.importLuckyNumber(lotteryId, generateLuckyNumber(generateLuckyNumberCount))
      result = await lottery.getLotteryLuckyNumbers(lotteryId)
      expect(result).to.have.lengthOf(generateLuckyNumberCount)
    })
  })
  // buy ticket
  describe('buy ticket', () => {
    beforeEach(async () => {
      await lottery.createLottery(title, description, image, prize, ticketPrice, expiresAt)
      await lottery.importLuckyNumber(lotteryId, generateLuckyNumber(generateLuckyNumberCount))
    })
    it('confirm ticket purchase', async () => {
      result = await lottery.getLottery(lotteryId)
      expect(result.participants).to.be.equal(0)
      result = await lottery.getLotteryParticipants(lotteryId)
      expect(result).to.have.lengthOf(0)
      await lottery
        .connect(participant1)
        .buyTicket(lotteryId, generateLuckyNumberCount - 1, { value: ticketPrice })
      result = await lottery.getLottery(lotteryId)
      expect(result.participants).to.be.equal(1)
      result = await lottery.getLotteryParticipants(lotteryId)
      expect(result).to.have.lengthOf(1)
    })
  })
  describe('selecting Winner && pay for winner', () => {
    beforeEach(async () => {
      await lottery.createLottery(title, description, image, prize, ticketPrice, expiresAt)
      await lottery.importLuckyNumber(lotteryId, generateLuckyNumber(generateLuckyNumberCount))
      await lottery
        .connect(participant1)
        .buyTicket(lotteryId, generateLuckyNumberCount - 1, { value: ticketPrice })
      await lottery
        .connect(participant2)
        .buyTicket(lotteryId, generateLuckyNumberCount - 2, { value: ticketPrice })
      await lottery
        .connect(participant3)
        .buyTicket(lotteryId, generateLuckyNumberCount - 3, { value: ticketPrice })
      await lottery
        .connect(participant4)
        .buyTicket(lotteryId, generateLuckyNumberCount - 4, { value: ticketPrice })
      await lottery
        .connect(participant5)
        .buyTicket(lotteryId, generateLuckyNumberCount - 5, { value: ticketPrice })
    })
    it('random selection of winners', async () => {
      result = await lottery.getLotteryParticipants(lotteryId)
      expect(result).to.have.lengthOf(generateLuckyNumberCount)
      result = await lottery.getLotteryResult(lotteryId)
      expect(result.winners).to.have.lengthOf(0)
      await lottery.randomlySelectWinners(lotteryId, numberOfWinners)
      result = await lottery.getLotteryResult(lotteryId)
      expect(result.winners).to.have.lengthOf(numberOfWinners)
    })
    it('pay for winners', async () => {
      result = await lottery.getLottery(lotteryId)
      expect(result.winners.toNumber()).to.be.equal(0)
      assert.equal(result.drawn, false)

      result = await lottery.getLotteryResult(lotteryId)
      expect(result.winners).to.have.lengthOf(0)
      expect(result.paidout).to.be.equal(false)

      await lottery.randomlySelectWinners(lotteryId, numberOfWinners)

      result = await lottery.getLottery(lotteryId)
      expect(result.winners.toNumber()).to.be.equal(numberOfWinners)
      assert.equal(result.drawn, true)

      result = await lottery.getLotteryResult(lotteryId)

      expect(result.winners).to.have.lengthOf(numberOfWinners)
      expect(result.paidout).to.be.equal(true)
    })
    it('expiresAt < currentTime', async () => {
      await network.provider.send('evm_increaseTime', [+expiresAt + 1000])
      expect(lottery.randomlySelectWinners(lotteryId, numberOfWinners)).to.be.revertedWith(
        'Event deadline not reached'
      )
      console.log('success')
    })
  })
})
