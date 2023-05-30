// import components
import Head from 'next/head'
import { useEffect } from 'react'
import Winners from '@/components/Winners'
import SubHeader from '@/components/SubHeader'
import ResultTable from '@/components/ResultTable'
import { globalActions } from '@/store/globalSlice'
import { useDispatch, useSelector } from 'react-redux'
import { getLottery, getParticipants, getLotteryResult } from '../../services/blockChain'

export default function Results({ lottery, participantList, lotteryResult }) {
  const dispatch = useDispatch()
  const { setJackpot, setResult, setParticipants } = globalActions
  const { participants, jackpot, result } = useSelector((states) => states.globalStates)

  useEffect(() => {
    dispatch(setJackpot(lottery))
    dispatch(setParticipants(participantList))
    dispatch(setResult(lotteryResult))
  })

  return (
    <div>
      <Head>
        <title>Dapp Lottery | Results</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-slate-100">
        <SubHeader />
        <ResultTable jackpot={jackpot} participants={participants} result={result} />
        <Winners />
      </div>
    </div>
  )
}

export const getServerSideProps = async (context) => {
  const { resultId } = context.query
  const lottery = await getLottery(resultId)
  const participantList = await getParticipants(resultId)
  const lotteryResult = await getLotteryResult(resultId)
  return {
    props: {
      lottery: JSON.parse(JSON.stringify(lottery)),
      participantList: JSON.parse(JSON.stringify(participantList)),
      lotteryResult: JSON.parse(JSON.stringify(lotteryResult)),
    },
  }
}
// import fake data
// import {generateLottery,  getPurchasedNumber, generateLotteryParticipants,} from '@/services/fakeData'
