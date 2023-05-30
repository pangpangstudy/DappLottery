// import store from '../store'
import Link from 'next/link'
import Countdown from './Countdown'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { FaEthereum } from 'react-icons/fa'
import { buyTicket } from '../services/blockChain'
import { globalActions } from '../store/globalSlice'
import { useRouter } from 'next/router'

const JackpotTable = ({ jackpot, lotteryNumbers, purchasedNumber }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { jackpotId } = router.query
  const { setGeneratorModal } = globalActions
  // const { wallet } = store.getState().globalStates
  const { wallet } = useSelector((state) => state.globalStates)
  const onGenerate = async () => {
    if (lotteryNumbers.length > 0) return toast.warning('Already generated')
    dispatch(setGeneratorModal('scale-100'))
  }

  const handlePurchase = async (luckyNumberId) => {
    if (!wallet) return toast.warning('Connect your wallet')
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await buyTicket(jackpotId, luckyNumberId, jackpot?.ticketPrice)
          .then(async () => {
            return resolve()
          })
          .catch(() => reject())
      }),
      {
        pending: 'Approve transaction...',
        success: 'Ticket purchased successfully 👌',
        error: 'Encountered error 🤯',
      }
    )
  }
  return (
    <div className="py-10 px-5 bg-slate-100">
      <div className="flex flex-col justify-center items-center text-center py-10">
        <h4 className="text-4xl text-center text-slate-700 font-bold pb-3">
          Buy Lottery Tickets Online
        </h4>
        <p className="text-lg text-slate-700 font-semibold capitalize pb-2">{jackpot?.title}</p>
        <p className="text-sm text-slate-600 w-full sm:w-2/3 pb-1">{jackpot?.description}</p>
        <p className="text-sm text-slate-600 font-semibold sm:w-2/3 ">
          {jackpot?.participants} participants
        </p>
      </div>
      <div className="flex flex-col justify-center items-center space-y-4 mb-6">
        {jackpot?.expiresAt ? <Countdown timestamp={jackpot?.expiresAt} /> : null}

        <div className="flex justify-center items-center space-x-2">
          {wallet?.toLowerCase() === jackpot?.owner ? (
            <button
              //   当布尔属性 disabled 存在时，元素将不可变、不能聚焦或与表单一同提交。用户将不能在表单控件本身或其子控件进行编辑或聚焦操作。
              disabled={jackpot?.expiresAt < Date.now()}
              onClick={onGenerate}
              className={`flex flex-nowrap border py-2 px-4 rounded-full bg-amber-500
${jackpot?.expiresAt < Date.now() ? 'cursor-not-allowed' : 'hover:bg-rose-600'} font-semibold `}
            >
              Generate Lucky Numbers
            </button>
          ) : null}
          {/* Results */}
          <Link
            href={`/results/` + jackpot?.id}
            className="flex flex-nowrap border py-2 px-4 rounded-full bg-[#0c2856]
            hover:bg-[#1a396c] cursor-pointer font-semibold text-white"
          >
            Draw Result
          </Link>
        </div>
      </div>
      <div className="bg-white text-sm overflow-x-auto flex flex-col w-full sm:w-3/4 mx-auto p-5 rounded-md">
        <div className="pb-4 text-center">
          <p className="semibold text-2xl">Select Your winning Lottery Numbers</p>
        </div>

        <table className="table-auto ">
          <thead className="max-h-80 overflow-y-auto block">
            <tr className="grid grid-cols-5 text-center" id="threadTr">
              <th className="px-4 py-2 ">#</th>
              <th className="px-4 py-2 ">Ticket Price</th>
              <th className="px-4 py-2 ">Draw Date</th>
              <th className="px-4 py-2 ">Ticket Number</th>
              <th className="px-4 py-2 ">Action</th>
            </tr>
          </thead>
          <tbody className="max-h-80 overflow-y-auto block ">
            {lotteryNumbers?.map((luckyNumber, i) => (
              <tr className="grid grid-cols-5 text-center border-b" key={i}>
                <td className="px-4 py-2 font-semibold ">{i + 1}</td>
                <td className="px-4 py-2 font-semibold ">
                  <div className="flex justify-center items-center  space-x-1">
                    <FaEthereum />
                    <span>{jackpot?.ticketPrice}</span>
                  </div>
                </td>
                <td className="px-4 py-2 font-semibold ">{jackpot?.drawsAt}</td>
                <td className="px-4 py-2 font-semibold ">{luckyNumber}</td>
                <td className="px-4 py-2 font-semibold ">
                  <button
                    disabled={purchasedNumber.includes(luckyNumber)}
                    onClick={() => handlePurchase(i)}
                    className={`bg-black ${
                      purchasedNumber.includes(luckyNumber)
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-rose-600'
                    } text-white text-sm py-2 px-4 rounded-full`}
                  >
                    BUY NOW
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default JackpotTable
