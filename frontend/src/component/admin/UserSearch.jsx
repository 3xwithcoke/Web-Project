import React, { useState } from "react";

const UserSearch = ({ query, setQuery }) => {
  return (
    <form className="flex gap-2 mb-6" onSubmit={(e) => e.preventDefault()}>
      <input
        type="text"
        placeholder="Search by username or email..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
      />
      <button
        type="submit"
        className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors"
      >
        Search
      </button>
    </form>
  );
};

export default UserSearch;
