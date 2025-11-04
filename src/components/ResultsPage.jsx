import React from 'react';
import { Search, LogOut } from 'lucide-react';

const ResultsPage = ({ 
  searchResults, 
  setCurrentPage, 
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
              <button
                onClick={() => setCurrentPage('home')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                New Search
              </button>
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

      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Search Results</h2>
          
          {searchResults && searchResults.length > 0 ? (
            <div className="space-y-4">
              <p className="text-gray-600 mb-4">Found {searchResults.length} profiles</p>
              {searchResults.map((profile, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                  <div className="flex items-start space-x-4">
                    {profile.image && (
                      <img src={profile.image} alt={profile.name} className="w-16 h-16 rounded-full" />
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800">{profile.name}</h3>
                      <p className="text-gray-600 mt-1">{profile.headline}</p>
                      {profile.location && (
                        <p className="text-sm text-gray-500 mt-2">📍 {profile.location}</p>
                      )}
                      {profile.education && (
                        <p className="text-sm text-gray-500 mt-1">🎓 {profile.education}</p>
                      )}
                      {profile.experience && (
                        <p className="text-sm text-gray-500 mt-1">💼 {profile.experience}</p>
                      )}
                      {profile.linkedin_url && (
                        <a
                          href={profile.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-3 text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                          View Profile →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No results found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;