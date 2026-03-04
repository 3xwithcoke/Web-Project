import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaTimes, FaArrowLeft } from "react-icons/fa";
import { searchProducts } from "../services/api";
import debounce from "lodash.debounce";

const suggestedItems = ["Rolex", "Omega", "Patek Philippe", "Audemars Piguet", "Automatic", "Chronograph"];

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
      setResults([]);
      if (err.response?.status !== 404) {
        setError(err?.response?.data?.message || "Server error while searching.");
      }
    } finally {
      setLoading(false);
    }
  };

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
    <div className="min-h-screen bg-black text-white px-6 py-12 selection:bg-white selection:text-black">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-gray-500 hover:text-white transition-colors"
          >
            <FaArrowLeft />
            <span>Return</span>
          </button>

          <FaTimes
            onClick={() => navigate("/")}
            className="text-xl cursor-pointer text-gray-500 hover:text-white transition-colors"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-16">
          {/* Search Sidebar */}
          <div className="w-full md:w-1/3 space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-serif font-light tracking-tight">Search</h2>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Find your masterpiece"
                  value={query}
                  onChange={handleChange}
                  autoFocus
                  className="w-full bg-transparent border-b border-gray-900 focus:border-white text-xl py-4 pr-12 transition-all outline-none font-light placeholder:text-gray-800"
                />
                <FaSearch className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-800 group-focus-within:text-white transition-colors" />
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-[10px] uppercase tracking-[0.4em] text-gray-600 font-medium">Curated Suggestions</p>
              <ul className="space-y-4">
                {suggestedItems.map((item) => (
                  <li
                    key={item}
                    onClick={() => handleSuggestionClick(item)}
                    className="text-sm font-light text-gray-400 cursor-pointer hover:text-white hover:translate-x-2 transition-all duration-500"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Results Area */}
          <div className="flex-1 min-h-[50vh]">
            {loading && (
              <div className="flex items-center gap-4 py-20 text-gray-500 animate-pulse">
                <div className="w-4 h-4 border-t border-gray-500 rounded-full animate-spin"></div>
                <span className="text-[10px] uppercase tracking-widest">Consulting archives...</span>
              </div>
            )}

            {!loading && error && (
              <p className="py-20 text-gray-600 text-xs uppercase tracking-widest">{error}</p>
            )}

            {!loading && !error && results.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {results.map((p) => (
                  <Link
                    key={p.product_id}
                    to={`/product/${p.product_id}`}
                    className="group space-y-4 bg-gray-950/20 border border-transparent hover:border-gray-900 transition-all duration-700 p-4"
                  >
                    <div className="aspect-[4/5] w-full overflow-hidden bg-gray-950">
                      <img
                        src={p.thumbnail ? `${import.meta.env.VITE_API_BASE_URL}${p.thumbnail}` : "/placeholder.png"}
                        alt={p.name}
                        className="h-full w-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-widest text-gray-600">{p.brand || "Luxury Edition"}</p>
                      <h3 className="text-sm font-serif font-light tracking-wide text-white uppercase">{p.name}</h3>
                      <p className="text-xs text-gray-400 font-light tracking-widest">₹{p.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {!loading && !error && results.length === 0 && query && (
              <div className="py-20 border-t border-gray-900">
                <p className="text-gray-700 text-sm font-light italic">
                  No records found for "{query}" in our collection.
                </p>
              </div>
            )}
            
            {!loading && !query && (
              <div className="py-20 flex flex-col items-center justify-center space-y-4 text-gray-800">
                 <FaSearch className="text-6xl opacity-10" />
                 <p className="text-[10px] uppercase tracking-[0.5em]">Awaiting discovery</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
