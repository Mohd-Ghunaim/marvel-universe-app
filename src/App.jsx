import { useState } from "react";
import md5 from "md5";
import "./App.css";
import CharacterCard from "./components/CharacterCard";
import LoadingIcon from "./components/LoadingIcon";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); // Track if search has been performed
  const [filteredResults, setFilteredResults] = useState('characters');

  const API_BASE_URL = "https://gateway.marvel.com:443";
  const API_PUBLIC_KEY = import.meta.env.VITE_MARVEL_PUBLIC_API_KEY;
  const API_PRIVATE_KEY = import.meta.env.VITE_MARVEL_PRIVATE_API_KEY;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;
  
    setIsLoading(true);
    setHasSearched(true);
  
    const ts = Date.now().toString();
    const hash = md5(ts + API_PRIVATE_KEY + API_PUBLIC_KEY);
  
    // Correct parameter based on selected category
    const searchParam =
      filteredResults === "characters" || filteredResults === "creators"
        ? "nameStartsWith"
        : "titleStartsWith";
  
    const endpoint = `/v1/public/${filteredResults}?${searchParam}=${searchTerm}&ts=${ts}&apikey=${API_PUBLIC_KEY}&hash=${hash}`;
    const data = await fetchMarvelData(endpoint);
  
    if (data && data.data) {
      setResults(data.data.results);
    }
  
    setIsLoading(false);
  };

  const fetchMarvelData = async (endpoint) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error fetching Marvel data:", error);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="title">Marvel Universe</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder={`Search for a ${filteredResults}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
          <select
            onChange={(e) => setFilteredResults(e.target.value)}
            className="search-category"
            defaultChecked="characters"
          >
            <option value="characters">Character</option>
            <option value="comics">Comic</option>
            <option value="series">Series</option>
            <option value="stories">Story</option>
            <option value="events">Event</option>
            <option value="creators">Creator</option>
          </select>
        </form>
      </header>

      <section className="results-grid">
        {isLoading ? (
          <LoadingIcon />
        ) : hasSearched && results.length === 0 ? ( 
          <p className="no-results">No results found.</p>
        ) : (
          results.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))
        )}
      </section>
    </div>
  );
}
