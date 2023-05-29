import { useState } from 'react'
import { useRouter } from 'next/router'
import SubHeader from '../components/SubHeader'
// function
import { createJackpot } from '../services/blockChain'
import { toast } from 'react-toastify'
const Create = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [prize, setPrize] = useState('')
  const [ticketPrice, setTicketPrice] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const router = useRouter()
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title || !description || !imageUrl || !prize || !ticketPrice || !expiresAt) return
    const params = {
      title,
      description,
      imageUrl,
      prize,
      ticketPrice,
      expiresAt: new Date(expiresAt).getTime(),
    }
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await createJackpot(params)
          .then(() => {
            router.push('/')
            onReset()
            return resolve()
          })
          .catch((err) => {
            console.log(err)
            return reject()
          })
      }),
      {
        pending: 'Approve transaction...',
        success: 'Lottery created successfully 👌',
        error: 'Encountered error 🤯',
      }
    )
  }
  const onReset = () => {
    setTitle('')
    setDescription('')
    setImageUrl('')
    setPrize('')
    setTicketPrice('')
    setExpiresAt('')
  }
  return (
    <div>
      <div className=" max-h-screen bg-slate-100">
        <SubHeader />
      </div>
      <div className="flex flex-col justify-center items-center mt-20 ">
        <div className="flex flex-col justify-center items-center my-5">
          <h2 className=" text-2xl font-bold  to-slate-800 py-5">Create Jackpots</h2>
          <p className=" text-center text-sm text-slate-600">
            We bring the personal and effective to every project wo work on. <br />
            Which is why our client love why they keep coming back.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="w-full max-w-md mb-8">
          <div className="mb-4">
            <input
              className=" appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              id="title"
              placeholder="Title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
              }}
              required
            />
          </div>
          <div className="mb-4">
            <input
              className=" appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              id="imageUrl"
              placeholder="imageUrl"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value)
              }}
              required
            />
          </div>
          <div className="mb-4">
            <input
              className=" appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              id="prize"
              placeholder="Prize"
              value={prize}
              onChange={(e) => {
                setPrize(e.target.value)
              }}
              required
            />
          </div>
          <div className="mb-6">
            <input
              className=" appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="ticketPrice"
              type="number"
              step={0.01}
              min={0.01}
              placeholder="Ticket Price"
              value={ticketPrice}
              onChange={(e) => {
                setTicketPrice(e.target.value)
              }}
              required
            />
          </div>
          <div className="mb-6">
            <input
              className=" appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="datetime-local"
              id="expiresAt"
              value={expiresAt}
              onChange={(e) => {
                setExpiresAt(e.target.value)
              }}
              required
            />
          </div>
          <div className="mb-4">
            <textarea
              className="appearance-none border rounded w-full py-2 px-3
                text-gray-700 leading-tight focus:outline-none
                focus:shadow-outline"
              id="description"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className=" flex justify-center">
            <button
              className="w-full bg-[#0c2856] hover:bg-[#1a396c] text-white font-bold py-2 px-4 rounded cursor-pointer focus:outline-none focus:shadow-inner"
              type="submit"
            >
              Submit Jackpot
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Create
