import React from "react";
import { FaSearch } from "react-icons/fa";

const UserSearch = ({ query, setQuery }) => {
  return (
    <form className="relative group" onSubmit={(e) => e.preventDefault()}>
      <input
        type="text"
        placeholder="Find collectors in the registry..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-transparent border-b border-gray-900 py-4 pr-12 text-sm font-light focus:border-white transition-all outline-none placeholder:text-gray-700"
      />
      <button
        type="submit"
        className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-800 group-focus-within:text-white transition-colors"
      >
        <FaSearch size={14} />
      </button>
    </form>
  );
};

export default UserSearch;
