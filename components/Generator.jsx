import { useState } from 'react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { FaTimes } from 'react-icons/fa'
import { globalActions } from '../store/globalSlice'
import { useSelector, useDispatch } from 'react-redux'
import { exportLuckyNumber, generateLuckyNumber } from '../services/blockChain'
// import { getPurchasedNumber } from '@/services/fakeData'
const Generator = () => {
  const router = useRouter()
  const { jackpotId } = router.query

  const dispatch = useDispatch()

  const [luckyNumbers, setLuckyNumbers] = useState('')
  const scale = useSelector((store) => store.globalStates.generatorModal)

  const handleSubmit = async (e) => {
    e.preventDefault()
    // dispatch(globalActions.setPurchasedNumbers(luckyNumbers))
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await exportLuckyNumber(jackpotId, generateLuckyNumber(luckyNumbers)) //一次引入 后续不可再次引入
          .then(async () => {
            setLuckyNumbers('')
            dispatch(globalActions.setGeneratorModal('scale-0'))
            return resolve()
          })
          .catch(() => reject())
      }),
      {
        pending: 'Approve transaction...',
        success: 'Lucky numbers saved to chain 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  return (
    <div
      className={`w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-50 flex justify-center items-center transform transition-transform duration-300 ${scale}`}
    >
      <div className="bg-white shadow-xl shadow-[#0c2856] rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex justify-between items-center">
            <p className=" font-semibold">Generate Number</p>
            <button
              onClick={() => {
                dispatch(globalActions.setGeneratorModal('scale-0'))
              }}
              type="button"
              className=" border-0 bg-transparent focus:outline-none"
            >
              <FaTimes />
            </button>
          </div>
          <div
            className="flex justify-between items-center
          bg-gray-300 rounded-xl p-2.5 my-5"
          >
            <input
              className="block w-full bg-transparent
              border-0 text-sm text-slate-500 focus:outline-none
              focus:ring-0"
              type="number"
              step={1}
              min={1}
              name="luckyNumbers"
              placeholder="Lucky Numbers e.g 19"
              onChange={(e) => setLuckyNumbers(e.target.value)}
              value={luckyNumbers}
            />
          </div>

          <button
            type="submit"
            className="flex flex-row justify-center items-center
              w-full text-white text-md py-2 px-5 rounded-full
              drop-shadow-xl bg-[#0c2856] hover:bg-[#1a396c]"
          >
            Generate and Save
          </button>
        </form>
      </div>
    </div>
  )
}

export default Generator
