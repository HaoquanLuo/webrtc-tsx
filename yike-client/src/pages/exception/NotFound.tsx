import React from 'react'
import { Link } from 'react-router-dom'

const NotFound: React.FC = () => {
  return (
    <div
      fixed
      top-0
      bottom-0
      left-0
      right-0
      w-full
      h-full
      grid
      place-items-center
      text-center
    >
      <div flex flex-col gap-2 items-start>
        <div text-6xl font-bold text-red>
          Oops!
        </div>
        <div text-xl>Sorry, an unexpected error has occurred.</div>
        <Link to={'/'} className="text-base text-blue visited:text-blue">
          Please go back to the index page.
        </Link>
      </div>
    </div>
  )
}

export default NotFound
