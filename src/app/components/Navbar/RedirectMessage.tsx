import React from 'react'

interface RedirectMessageProps {
  countdown: number
  cancelRedirect: () => void
}

const RedirectMessage: React.FC<RedirectMessageProps> = ({ countdown, cancelRedirect }) => (
  <div className="w-full p-4 bg-[#1a1a1a] text-white flex items-center justify-between transition-all duration-300">
    <span>Redirecting in {countdown} seconds...</span>
    <button
      onClick={cancelRedirect}
      className="px-4 py-1 text-white border-none bg-transparent cursor-pointer hover:text-[#bfbfbf] transition"
    >
      Cancel
    </button>
  </div>
)

export default RedirectMessage
