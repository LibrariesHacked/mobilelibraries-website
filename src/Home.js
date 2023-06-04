import React from 'react'

import Search from './Search'
import Stops from './Stops'

function Home () {
  return (
    <div style={{ maxWidth: '100%' }}>
      <Search />
      <Stops />
    </div>
  )
}

export default Home
