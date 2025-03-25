import React from 'react'
import HeaderEl from "../components/HeaderEl";
import SearchEl from "../components/SearchEl";

function Search() {
  return (
    <div className='min-h-screen bg-[#181a1b]'>
      <HeaderEl/>
      <div>
        <div className='search-container'>
          <SearchEl/>
        </div>
      </div>
    </div>
  )
}

export default Search


