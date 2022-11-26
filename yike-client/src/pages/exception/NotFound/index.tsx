import { selectLogState } from '@/features/system/systemSlice'
import { store } from '@/store'
import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const NotFound: React.FC = () => {
  const logState = useSelector(selectLogState)
  return (
    <div>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      {logState ? (
        <Link to={'/auth'}>Please go back to the index page.</Link>
      ) : (
        <Link to={'/'}>Please go back to the index page.</Link>
      )}
    </div>
  )
}

export default NotFound
