import { useEffect } from 'react'
import Generator from '@/components/Generator'
import SubHeader from '@/components/SubHeader'
import JackpotTable from '@/components/JackpotTable'
import { useDispatch, useSelector } from 'react-redux'
import { globalActions } from '../../store/globalSlice'
import { getLottery, getLuckyNumbers, getPurchasedNumbers } from '@/services/blockChain'
// import { generateLottery, getPurchasedNumber } from '@/services/fakeData'

const Jackpot = ({ lottery, lotteryNumbers, numberPurchased }) => {
  const { setJackpot, setLuckyNumbers, setPurchasedNumbers } = globalActions
  const { jackpot, luckyNumbers, purchasedNumbers } = useSelector((store) => store.globalStates)
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
        <Generator jackpot={jackpot} />
      </div>
    </div>
  )
}

export const getServerSideProps = async (context) => {
  const { jackpotId } = context.query
  const lottery = await getLottery(jackpotId)
  const lotteryNumbers = await getLuckyNumbers(jackpotId)
  const purchasedNumber = await getPurchasedNumbers(jackpotId)

  return {
    props: {
      lottery: JSON.parse(JSON.stringify(lottery)),
      lotteryNumbers: JSON.parse(JSON.stringify(lotteryNumbers)),
      numberPurchased: JSON.parse(JSON.stringify(purchasedNumber)),
    },
  }
}
export default Jackpot
