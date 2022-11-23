import React from 'react'

interface Props {
  to: string
  from: string
  next: () => void
}

function RouterBeforeEach(to: string, from: string, next: () => void) {}

export default RouterBeforeEach
