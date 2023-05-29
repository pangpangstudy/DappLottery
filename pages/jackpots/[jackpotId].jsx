import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Generator from '@/components/Generator'
import SubHeader from '@/components/SubHeader'
import JackpotTable from '@/components/JackpotTable'
import { useDispatch, useSelector } from 'react-redux'
import { globalActions } from '../../store/actions/globalActions'
import { getLottery, getLuckyNumbers, getPurchasedNumbers } from '@/services/blockChain'
// import { generateLottery, getPurchasedNumber } from '@/services/fakeData'

export default function Jackpot({ lottery, lotteryNumbers, numberPurchased }) {
  const { jackpot, luckyNumbers, purchasedNumbers } = useSelector((store) => store.globalStates)
  const { setJackpot, setLuckyNumbers, setPurchasedNumbers } = globalActions

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setJackpot(lottery))
    dispatch(setLuckyNumbers(lotteryNumbers))
    dispatch(setPurchasedNumbers(numberPurchased))
  }, [])

  return (
    <div>
      <div className=" max-h-screen bg-slate-100">
        <SubHeader />
        <JackpotTable
          jackpot={jackpot}
          lotteryNumbers={luckyNumbers}
          purchasedNumber={purchasedNumbers}
        />
        {console.log(jackpot)}
        <Generator jackpot={jackpot} />
      </div>
    </div>
  )
}

export const getServerSideProps = async (context) => {
  const { jackpotId } = context.query
  const lottery = await getLottery(jackpotId)
  const lotteryNumbers = await getLuckyNumbers(jackpotId)
  const purchasedNumber_bc = await getPurchasedNumbers(jackpotId)

  // const lottery = generateLottery(jackpotId)
  //console.log(context.query) //查看必须在终端查看
  // const purchasedNumber = getPurchasedNumber(5)  fake data
  return {
    props: {
      lottery: JSON.parse(JSON.stringify(lottery)),
      lotteryNumbers: JSON.parse(JSON.stringify(lotteryNumbers)),
      numberPurchased: JSON.parse(JSON.stringify(purchasedNumber_bc)),
    },
  }
}
