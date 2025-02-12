import React from 'react'
import HeaderEl from "../components/HeaderEl";
import SearchEl from "../components/SearchEl.tsx";

function Search() {
  return (
    <div>
      <HeaderEl/>
      <div className='pt-[56px]'>
        <div className='search-container'>
          <SearchEl/>
        </div>
      </div>
    </div>
  )
}

export default Search


