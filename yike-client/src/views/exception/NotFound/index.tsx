import React from 'react'
import { Link, useRouteError } from 'react-router-dom'

const NotFound: React.FC = () => {
  const error = useRouteError() as any
  return (
    <div>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <Link to={'/'}>Please go back to the index page.</Link>
      <p>
        <i>{error?.statusText || error?.message}</i>
      </p>
    </div>
  )
}

export default NotFound
