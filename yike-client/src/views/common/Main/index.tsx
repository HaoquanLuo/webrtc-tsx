import React from 'react'
import { useLoaderData, useLocation } from 'react-router-dom'

const Main: React.FC = () => {
  const data = useLoaderData()
  const location = useLocation()
  console.log('data', data)
  console.log('location', location)

  return (
    <>
      <h2>Main</h2>
    </>
  )
}

export default Main
