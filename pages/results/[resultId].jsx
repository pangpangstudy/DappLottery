import Head from 'next/head'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { globalActions } from '@/store/globalSlice'
// import components
import ResultTable from '@/components/ResultTable'
import SubHeader from '@/components/SubHeader'
import Winners from '@/components/Winners'
// import fake data
import {
  generateLottery,
  getPurchasedNumber,
  generateLotteryParticipants,
} from '@/services/fakeData'
export default function Results({ lottery, participantList, lotteryResult }) {
  return (
    <div>
      <Head>
        <title>Dapp Lottery | Results</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-slate-100">
        <SubHeader />
        <ResultTable jackpot={lottery} participants={participantList} result={lotteryResult} />

        <Winners />
      </div>
    </div>
  )
}

export const getServerSideProps = async (context) => {
  const { resultId } = context.query
  const lottery = await generateLottery(resultId)
  const participantList = await generateLotteryParticipants(10)
  const lotteryResult = []
  return {
    props: {
      lottery: JSON.parse(JSON.stringify(lottery)),
      participantList: JSON.parse(JSON.stringify(participantList)),
      lotteryResult: JSON.parse(JSON.stringify(lotteryResult)),
    },
  }
}
