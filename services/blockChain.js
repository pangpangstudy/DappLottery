import { ethers } from 'ethers'
import { globalActions } from '../store/globalSlice'
// import { globalStates } from '@/store/states/globalStates'
import store from '@/store'
import address from '../artifacts/contractAddress.json'
import abi from '../artifacts/contracts/DappLottery.sol/DappLottery.json'

const { setWallet } = globalActions
const contractAddress = address.address
const contractAbi = abi.abi

let tx, ethereum
//next 与 react 还是有不同的  node中并没有window
if (typeof window !== 'undefined') {
  ethereum = window.ethereum
}

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

// function
const connectWallet = async () => {
  try {
    if (!ethereum) {
      return reportError('Please install Metamask')
    }
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    store.dispatch(setWallet(accounts[0]))
  } catch (err) {
    console.log(err)
  }
}
// 监听 wallet账户
const monitorWalletConnection = async () => {
  try {
    if (!ethereum) {
      return reportError('Please install Metamask')
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' })
    window.ethereum.on('chainChanged', (chianId) => {
      window.location.reload() //重新加载
    })

    window.ethereum.on('accountsChanged', async () => {
      store.dispatch(setWallet(accounts[0]))
      await monitorWalletConnection() //继续监听
    })
    if (accounts.length) {
      store.dispatch(setWallet(accounts[0]))
    } else {
      store.dispatch(setWallet(''))
      reportError('Please,connect wallet,no accounts found')
    }
  } catch (err) {
    reportError(err)
  }
}
// ethereum   web   获取合约参数  可以再浏览器连接metamask后创建合约
const csrEthereumContract = async () => {
  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  const contract = new ethers.Contract(contractAddress, contractAbi, signer)
  console.log(contract)
  return contract
}

const createJackpot = async ({ title, description, imageUrl, prize, ticketPrice, expiresAt }) => {
  try {
    if (!ethereum) {
      return reportError('Please install metamask')
    }

    const contract = await csrEthereumContract()
    const wallet = store.getState().globalStates.wallet

    // const contract = await ssrEthereumContract()
    tx = await contract.createLottery(
      title,
      description,
      imageUrl,
      toWei(prize),
      toWei(ticketPrice),
      expiresAt,
      {
        from: wallet,
      }
    )
    tx.wait()
  } catch (err) {
    reportError(err)
  }
}

// localhost  获取已经创建的合约

const ssrEthereumContract = async () => {
  const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/') //hardhat本地
  // const wallet = new ethers.Wallet(privateKey,provider)
  // https://learnblockchain.cn/docs/ethers.js/api-wallet.html 资料
  const wallet = ethers.Wallet.createRandom() //创建一个新的钱包
  const signer = provider.getSigner(wallet.address)
  const contract = new ethers.Contract(contractAddress, contractAbi, signer)
  return contract
}

const getLotteries = async () => {
  const contract = await ssrEthereumContract()
  const lotteries = await contract.getLotteries()
  return structureLotteries(lotteries)
}

const getLottery = async (id) => {
  const contract = await ssrEthereumContract()
  const lottery = await contract.getLottery(id)
  // console.log(structureLotteries([lottery])[0])
  return structureLotteries([lottery])[0]
}

const exportLuckyNumber = async (id, luckyNumbers) => {
  try {
    if (!ethereum) {
      return reportError('Please install metamask')
    }
    const contract = await csrEthereumContract()
    const wallet = store.getState().globalStates.wallet

    tx = await contract.importLuckyNumber(id, luckyNumbers, { from: wallet })
    tx.wait()
  } catch (err) {
    reportError(err)
  }
}

function generateLuckyNumber(count) {
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
const getLuckyNumbers = async (id) => {
  const contract = await ssrEthereumContract()
  const luckyNumbers = await contract.getLotteryLuckyNumbers(id)
  return luckyNumbers
}

const buyTicket = async (id, luckyNumberId, ticketPrice) => {
  try {
    if (!ethereum) return notifyUser('Please install Metamask')
    const wallet = store.getState().globalStates.wallet
    console.log(wallet)
    const contract = await csrEthereumContract()
    console.log(contract)
    tx = await contract.buyTicket(id, luckyNumberId, {
      from: wallet,
      value: toWei(ticketPrice),
    })
    await tx.wait()
    // const purchasedNumbers = await getPurchasedNumbers(id)
    // const lotteryParticipants = await getParticipants(id)
    // const lottery = await getLottery(id)

    // store.dispatch(setPurchasedNumbers(purchasedNumbers))
    // store.dispatch(setParticipants(lotteryParticipants))
    // store.dispatch(setJackpot(lottery))
  } catch (error) {
    reportError(error)
  }
}

const getParticipants = async (id) => {
  const participants = await (await ssrEthereumContract()).functions.getLotteryParticipants(id)
  return structuredParticipants(participants[0])
}

const getPurchasedNumbers = async (id) => {
  const participants = await (await ssrEthereumContract()).functions.getLotteryParticipants(id)
  return structuredNumbers(participants[0])
}
// helper function
const structureLotteries = (lotteries) =>
  lotteries.map((lottery) => ({
    id: Number(lottery.id),
    title: lottery.title,
    description: lottery.description,
    owner: lottery.owner.toLowerCase(),
    prize: fromWei(lottery.prize),
    ticketPrice: fromWei(lottery.ticketPrice),
    image: lottery.image,
    createdAt: formatDate(Number(lottery.createdAt)),
    drawsAt: formatDate(Number(lottery.expiresAt)),
    expiresAt: Number(lottery.expiresAt),
    winners: Number(lottery.winners),
    participants: Number(lottery.participants),
    drawn: lottery.drawn,
  }))
const structuredParticipants = (participants) =>
  participants.map((participant) => ({
    account: participant[0].toLowerCase(),
    lotteryNumber: participant[1],
    paid: participant[2],
  }))
const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const monthsOfYear = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  const dayOfWeek = daysOfWeek[date.getDay()]
  const monthOfYear = monthsOfYear[date.getMonth()]
  const dayOfMonth = date.getDate()
  const year = date.getFullYear()

  return `${dayOfWeek} ${monthOfYear} ${dayOfMonth}, ${year}`
}
const structuredNumbers = (participants) => {
  const purchasedNumbers = []

  for (let i = 0; i < participants.length; i++) {
    const purchasedNumber = participants[i][1]
    purchasedNumbers.push(purchasedNumber)
  }

  return purchasedNumbers
}

const structuredResult = (result) => {
  const LotteryResult = {
    id: Number(result[0]),
    completed: result[1],
    paidout: result[2],
    timestamp: Number(result[3] + '000'),
    sharePerWinner: fromWei(result[4]),
    winners: [],
  }

  for (let i = 0; i < result[5].length; i++) {
    const winner = result[5][i][1]
    LotteryResult.winners.push(winner)
  }

  return LotteryResult
}
const truncate = function (text, startChart, endChart, maxLength) {
  let start = text.substring(0, startChart)
  let end = text.substring(text.length - endChart, text.length)
  while (start.length + end.length < maxLength) {
    start = start + '.'
  }
  return start + end
}

const reportError = (error) => {
  console.log(error)
}
export {
  connectWallet,
  truncate,
  monitorWalletConnection,
  getLotteries,
  structureLotteries,
  getLottery,
  createJackpot,
  exportLuckyNumber,
  generateLuckyNumber,
  getLuckyNumbers,
  buyTicket,
  getParticipants,
  getPurchasedNumbers,
}
