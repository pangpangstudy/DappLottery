import sp from '@/assets/sp.webp'
// 单个
function generateLottery(id) {
  const image = sp
  const expiresIn = getRandomInt(7, 30)
  const expiresAt = new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000).getTime()
  return {
    title: `lottery ${id}`,
    description: `This is the ${id} lottery`,
    owner: generateRandomEthereumAddress(),
    prize: getRandomFloat(10, 100).toFixed(2),
    ticketPrice: getRandomFloat(0.01, 0.1).toFixed(2),
    image,
    createAt: getRandomTimestamp(
      new Date('2022-01-01').getTime(),
      new Date('2023-05-20').getTime()
    ),
    drawsAt: getRandomTimestamp(new Date('2022-01-01').getTime(), new Date('2023-05-20').getTime()),
    expiresAt,
    participants: getRandomInt(10, 100),
    drawn: false,
  }
}
// 主页多个 lottery
const generateLotteries = (n) => {
  const lotteries = []
  for (let i = 1; i <= n; i++) {
    const id = i.toString()
    const title = `lottery${id}`
    const description = `This is the ${1} lottery`
    const owner = generateRandomEthereumAddress()
    const prize = getRandomFloat(10, 100).toFixed(2)
    const ticketPrice = getRandomFloat(0.01, 0.1).toFixed(2)
    const image = sp
    const createAt = getRandomTimestamp(
      new Date('2022-01-01').getTime(),
      new Date('2023-05-20').getTime()
    )
    const drawsAt = getRandomTimestamp(
      new Date('2022-01-01').getTime(),
      new Date('2023-05-20').getTime()
    )
    const expiresIn = getRandomInt(7, 30) // 失效间隔
    const expiresAt = new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000).getTime() //失效日期
    const participants = getRandomInt(10, 100) //参与者
    const drawn = false
    lotteries.push({
      id,
      title,
      description,
      owner,
      prize,
      ticketPrice,
      image,
      createAt,
      expiresAt,
      participants,
      drawn,
      drawsAt,
    })
  }
  return lotteries
}
function generateLotteryParticipants(count) {
  const participants = []
  const accounts = [
    '0xBcd4042DE499D14e55001CcbB24a551F3b954096',
    '0x71bE63f3384f5fb98995898A86B02Fb2426c5788',
    '0xFABB0ac9d68B0B445fB7357272Ff202C5651694a',
    '0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec',
    '0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097',
    '0xcd3B766CCDd6AE721141F452C550Ca635964ce71',
    '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
    '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E',
    '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
    '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
  ]
  for (let i = 0; i < count; i++) {
    const participant = {
      account: accounts[Math.floor(Math.random() * accounts.length)],
      lotteryNumber: Math.random().toString(36).substring(2, 8),
      paid: false,
    }
    participants.push(participant)
  }
  return participants
}
function getPurchasedNumber(count) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const result = []
  for (let i = 0; i < count; i++) {
    let string = ''
    for (let j = 0; j < 6; j++) {
      string += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    result.push(string)
  }
  return result
}
function generateRandomEthereumAddress() {
  const hexChars = '0123456789abcdef'
  let address = '0x'
  for (let i = 0; i < 40; i++) {
    //   str.charAt(index) 返回一个指定字符
    address += hexChars.charAt(Math.floor(Math.random() * hexChars.length))
  }
  return address
}
function getRandomFloat(min, max) {
  return Math.random() * (max - min + 1)
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
function getRandomTimestamp(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
export { generateLotteries, generateLottery, generateLotteryParticipants, getPurchasedNumber }
