import Link from 'next/link'
import { useSelector } from 'react-redux'
// image
import background from '../assets/background.jpg'
// function
import { connectWallet, truncate } from '../services/blockChain'
const SubHeader = () => {
  const { wallet } = useSelector((store) => store.globalStates)
  return (
    <div
      style={{ background: `url(${background.src}) fixed no-repeat top/cover` }}
      className="flex justify-between items-center text-white px-10 py-5"
    >
      <div>
        <Link href="/" className=" text-xl font-bold">
          DappLottery
        </Link>
      </div>
      <div className="hidden lg:flex items-center space-x-6 font-semibold">
        <p>Home</p>
        <p>How To Play</p>
        <p>All Lottery</p>
        <p>Contact</p>
      </div>
      {wallet ? (
        <button
          className="flex flex-nowrap border py-2 px-4 rounded-full bg-amber-500 hover:bg-rose-600 cursor-pointer font-semibold text-sm"
          onClick={() => {
            connectWallet()
          }}
        >
          {truncate(wallet, 4, 8, 15)}
        </button>
      ) : (
        <button
          className="flex flex-nowrap border py-2 px-4 rounded-full bg-amber-500 hover:bg-rose-600 cursor-pointer font-semibold text-sm"
          onClick={() => {
            connectWallet()
          }}
        >
          Connect Wallet
        </button>
      )}
    </div>
  )
}

export default SubHeader
