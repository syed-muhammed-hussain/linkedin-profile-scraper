import React from 'react';
import { Search, LogOut, Loader2 } from 'lucide-react';

const HomePage = ({ 
  currentUser, 
  searchParams, 
  setSearchParams, 
  handleSearch, 
  isSearching, 
  handleLogout 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Search className="w-8 h-8 text-indigo-600 mr-2" />
              <span className="text-xl font-bold text-gray-800">LinkedIn Scraper</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {currentUser?.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Search LinkedIn Profiles</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Keyword</label>
                <input
                  type="text"
                  value={searchParams.keyword}
                  onChange={(e) => setSearchParams({...searchParams, keyword: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Software Engineer"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={searchParams.city}
                  onChange={(e) => setSearchParams({...searchParams, city: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., New York"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Results</label>
              <input
                type="number"
                value={searchParams.maxResults}
                onChange={(e) => setSearchParams({...searchParams, maxResults: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                min="1"
                max="100"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Results Per Page</label>
                <input
                  type="number"
                  value={searchParams.resultsPerPage}
                  onChange={(e) => setSearchParams({...searchParams, resultsPerPage: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  min="1"
                  max="10"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Pages</label>
                <input
                  type="number"
                  value={searchParams.totalPages}
                  onChange={(e) => setSearchParams({...searchParams, totalPages: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  min="1"
                  max="10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Google API Key</label>
              <input
                type="text"
                value={searchParams.apiKey}
                onChange={(e) => setSearchParams({...searchParams, apiKey: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Your Google Custom Search API Key"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Engine ID</label>
              <input
                type="text"
                value={searchParams.searchEngineId}
                onChange={(e) => setSearchParams({...searchParams, searchEngineId: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Your Google Custom Search Engine ID"
              />
            </div>

            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="w-full bg-indigo-600 text-white py-4 rounded-lg hover:bg-indigo-700 transition font-medium flex items-center justify-center disabled:bg-gray-400"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Search Profiles
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;