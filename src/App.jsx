// App.jsx
import { useState } from "react";
import { Client } from 'appwrite';

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  const client = new Client();
  client.setProject('67b620570008ec3b49d4');  

  const handleSearch = async (e) => {
    e.preventDefault();

    // Example: Replace with Marvel API call
    const dummyResults = [
      { id: 1, name: "Iron Man", image: "https://via.placeholder.com/150" },
      { id: 2, name: "Spider-Man", image: "https://via.placeholder.com/150" },
      { id: 3, name: "Captain America", image: "https://via.placeholder.com/150" },
    ];

    setResults(dummyResults);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <header className="mb-6 text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Marvel Universe</h1>
        <form onSubmit={handleSearch} className="flex justify-center gap-2">
          <input
            type="text"
            placeholder="Search for a character..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-lg border w-64"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Search
          </button>
        </form>
      </header>

      {/* Results Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {results.map((character) => (
          <div
            key={character.id}
            className="bg-white rounded-2xl shadow p-4 text-center"
          >
            <img
              src={character.image}
              alt={character.name}
              className="w-32 h-32 mx-auto rounded-full mb-4"
            />
            <h2 className="text-xl font-semibold">{character.name}</h2>
          </div>
        ))}
      </section>
    </div>
  );
}