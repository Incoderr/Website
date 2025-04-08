import React from 'react'
import HeaderEl from "../components/HeaderEl";
import SearchEl from "../components/SearchEl";

const Search: React.FC = () => {
  return (
    <div className='min-h-screen bg-[#0d0d0f]'>
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


