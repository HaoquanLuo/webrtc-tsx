import React from 'react'
import { Link } from 'react-router-dom'

const Main: React.FC = () => {
  return (
    <>
      <h2>Auth Main</h2>
      <Link to={'/auth/room/1'}>room 1</Link>
    </>
  )
}

export default Main
