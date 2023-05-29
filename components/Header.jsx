import Image from 'next/image'
import Link from 'next/link'
import { useSelector } from 'react-redux'
// image
import networking from '../assets/networking.png'
import background from '../assets/background.jpg'

// blockChian  function
import { connectWallet, truncate } from '../services/blockChain'

// Header
const Header = () => {
  const { wallet } = useSelector((store) => store.globalStates)
  return (
    <div
      className="px-5 md:px-40"
      style={{ background: `url(${background.src}) fixed no-repeat top/cover` }}
    >
      <div className="flex items-center justify-between text-white py-5 ">
        <div>
          <h1 className="text-xl font-bold ">DappLottery</h1>
        </div>
        <div className="hidden lg:flex items-center space-x-3 font-semibold ">
          <p>Home</p>
          <p>How to play</p>
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
      <div className="flex items-center justify-between pb-5">
        <div>
          <div className="text-white py-5">
            <h2 className="text-4xl font-bold py-4">
              Take the change to <br /> change your life
            </h2>
            <p className="text-xl">
              We bring the personal and effective to every project wo work on. <br />
              Which is why our client love why they keep coming back.
            </p>
          </div>
        </div>
        <div>
          <Image
            src={networking}
            width={100}
            height={100}
            alt="network"
            className="rounded-lg w-80"
          />
        </div>
      </div>
      <div className="pb-10">
        <Link
          href={'/create'}
          className="bg-amber-500 hover:bg-rose-600 text-white rounded-md cursor-pointer font-semibold py-3 px-5"
          style={{ display: 'inline-block' }}
        >
          Create Jackpot
        </Link>
      </div>
    </div>
  )
}

export default Header
