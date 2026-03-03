import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaTimes, FaArrowLeft } from "react-icons/fa";
import { searchProducts } from "../services/api";
import debounce from "lodash.debounce";

const suggestedItems = ["Cleanser", "Hydrators", "Parsley Seed", "Face Mask"];

const SearchPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const performSearch = async (keyword) => {
    if (!keyword.trim()) {
      setResults([]);
      setError("");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await searchProducts(keyword);
      console.log(res)

      // If backend returns 404, treat as empty results
      if (res.status === 404 || (res?.data?.results?.length === 0)) {
        setResults([]);
        setError("");
        return;
      }

      const fetchedResults = res?.data?.results ?? [];
      setResults(fetchedResults);
      setError("");
    } catch (err) {
      console.error(err);

      if (err.response?.status === 404) {
        setResults([]);
        setError("");
      } else {
        setResults([]);
        setError(err?.response?.data?.message || "Server error while searching.");
      }
    } finally {
      setLoading(false);
    }
  };


  // for live-result change
  const debouncedSearch = useMemo(
    () => debounce((value) => performSearch(value), 500),
    []
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  const handleSuggestionClick = (item) => {
    setQuery(item);
    performSearch(item);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6">
      <div className="flex justify-between items-center mb-6 max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-black"
        >
          <FaArrowLeft />
          <span>Back</span>
        </button>

        <FaTimes
          onClick={() => navigate("/")}
          className="text-xl cursor-pointer text-gray-500 hover:text-black"
        />
      </div>

      <div className="max-w-7xl mx-auto flex bg-white border rounded-lg overflow-hidden shadow">
        <div className="w-1/3 border-r p-6">
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search Belleze products"
              value={query}
              onChange={handleChange}
              autoFocus
              className="w-full border-b border-gray-300 focus:outline-none focus:border-pink-500 text-lg py-2 pr-10"
            />
            <FaSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <p className="text-xs uppercase text-gray-400 mb-3">Suggested</p>
          <ul className="space-y-2">
            {suggestedItems.map((item) => (
              <li
                key={item}
                onClick={() => handleSuggestionClick(item)}
                className="cursor-pointer hover:text-pink-600"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-2/3 p-6 grid grid-cols-2 gap-6">
          {loading && (
            <p className="col-span-2 text-gray-500">Loading...</p>
          )}

          {!loading && error && (
            <p className="col-span-2 text-gray-400">{error}</p>
          )}

          {!loading && !error && results.length > 0 &&
            results.map((p) => (
              <Link
                key={p.product_id}
                to={`/product/${p.product_id}`}
                className="hover:shadow-lg transition bg-gray-50 rounded overflow-hidden"
              >
                <img
                  src={p.thumbnail ? `${import.meta.env.VITE_API_BASE_URL}${p.thumbnail}` : "/placeholder.png"}
                  alt={p.name}
                  className="h-40 w-full object-cover"
                />
                <div className="p-3">
                  <h3 className="font-medium">{p.name}</h3>
                  <p className="text-pink-600 font-semibold">${p.price}</p>
                </div>
              </Link>
            ))}

          {!loading && !error && results.length === 0 && query && (
            <p className="col-span-2 text-gray-400">
              No products found for "{query}"
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
