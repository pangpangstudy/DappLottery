import Head from 'next/head'
import styled from '@emotion/styled'
import styles from '@/styles/Home.module.css'
import Header from '@/components/Header'
import Jackpots from '@/components/Jackpots'
// import { generateLotteries } from '@/services/fakeData'
import { getLotteries } from '@/services/blockChain'
export default function Home({ jackpots }) {
  return (
    <div className=" min-h-screen bg-slate-100">
      <Head>
        <title>Dapp Lottery</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Header></Header>
        <Jackpots jackpots={jackpots}></Jackpots>
      </div>
    </div>
  )
}
export const getServerSideProps = async () => {
  const data = await getLotteries() // 6 script util test
  return {
    props: {
      jackpots: JSON.parse(JSON.stringify(data)),
    },
  }
}
