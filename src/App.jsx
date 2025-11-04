import React, { useState, useEffect } from 'react';
import { storage } from './utils/storage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import HomePage from './components/HomePage';
import ResultsPage from './components/ResultsPage';
import AdminPanel from './components/AdminPanel';

const App = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  
  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    city: '',
    maxResults: 10,
    resultsPerPage: 10,
    totalPages: 1,
    apiKey: '',
    searchEngineId: ''
  });
  const [adminCredentials, setAdminCredentials] = useState({
    username: '',
    password: ''
  });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Load data from storage
  useEffect(() => {
    loadUsers();
    loadCurrentUser();
  }, []);

  const loadUsers = async () => {
    try {
      const result = await storage.list('user:');
      if (result && result.keys) {
        const userPromises = result.keys.map(key => storage.get(key));
        const userResults = await Promise.all(userPromises);
        const loadedUsers = userResults
          .filter(r => r && r.value)
          .map(r => JSON.parse(r.value));
        setUsers(loadedUsers);
      }
    } catch (error) {
      console.log('No users found yet');
    }
  };

  const loadCurrentUser = async () => {
    try {
      const result = await storage.get('current_user');
      if (result && result.value) {
        const user = JSON.parse(result.value);
        setCurrentUser(user);
        setCurrentPage('home');
      }
    } catch (error) {
      console.log('No current user');
    }
  };

  const handleSignup = async () => {
    if (signupData.password !== signupData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (signupData.password.length < 6) {
      alert('Password must be at least 6 characters!');
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      name: signupData.name,
      email: signupData.email.toLowerCase(),
      password: signupData.password,
      isApproved: false,
      createdAt: new Date().toISOString()
    };

    try {
      await storage.set(`user:${newUser.id}`, JSON.stringify(newUser));
      alert('Account created! Please wait for admin approval.');
      setSignupData({ name: '', email: '', password: '', confirmPassword: '' });
      setCurrentPage('login');
      loadUsers();
    } catch (error) {
      alert('Error creating account. Please try again.');
    }
  };

  const handleLogin = async () => {
    try {
      const result = await storage.list('user:');
      if (!result || !result.keys) {
        alert('No users found. Please sign up first.');
        return;
      }

      const userPromises = result.keys.map(key => storage.get(key));
      const userResults = await Promise.all(userPromises);
      const allUsers = userResults
        .filter(r => r && r.value)
        .map(r => JSON.parse(r.value));

      const user = allUsers.find(
        u => u.email === loginEmail.toLowerCase() && u.password === loginPassword
      );

      if (!user) {
        alert('Invalid email or password!');
        return;
      }

      if (!user.isApproved) {
        alert('Your account is pending admin approval. Please wait.');
        return;
      }

      await storage.set('current_user', JSON.stringify(user));
      setCurrentUser(user);
      setCurrentPage('home');
      setLoginEmail('');
      setLoginPassword('');
    } catch (error) {
      alert('Error logging in. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await storage.delete('current_user');
      setCurrentUser(null);
      setCurrentPage('login');
      setSearchResults(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleUserApproval = async (userId) => {
    try {
      const result = await storage.get(`user:${userId}`);
      if (result && result.value) {
        const user = JSON.parse(result.value);
        user.isApproved = !user.isApproved;
        await storage.set(`user:${userId}`, JSON.stringify(user));
        loadUsers();
      }
    } catch (error) {
      alert('Error updating user status');
    }
  };

  const handleAdminLogin = () => {
    const ADMIN_USERNAME = 'admin';
    const ADMIN_PASSWORD = 'Admin@2024';
    
    if (adminCredentials.username === ADMIN_USERNAME && adminCredentials.password === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      setAdminCredentials({ username: '', password: '' });
    } else {
      alert('Invalid admin credentials!');
    }
  };

  const handleSearch = async () => {
    if (!searchParams.keyword || !searchParams.city) {
      alert('Please enter both keyword and city');
      return;
    }

    if (!searchParams.apiKey || !searchParams.searchEngineId) {
      alert('Please enter API Key and Search Engine ID');
      return;
    }

    setIsSearching(true);
    setSearchResults(null);

    try {
      const response = await fetch('https://n8n.boundlesshhr.com/webhook/linkedin-scraper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword: searchParams.keyword,
          city: searchParams.city,
          maxResults: parseInt(searchParams.maxResults),
          apiKey: searchParams.apiKey,
          searchEngineId: searchParams.searchEngineId,
          resultsPerPage: parseInt(searchParams.resultsPerPage),
          totalPages: parseInt(searchParams.totalPages)
        })
      });

      const data = await response.json();
      setSearchResults(data);
      setCurrentPage('results');
    } catch (error) {
      alert('Error searching. Please check your API credentials and try again.');
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Admin Login Page Component
  const AdminLoginPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Login</h1>
          <p className="text-gray-600 mt-2">Enter admin credentials</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={adminCredentials.username}
              onChange={(e) => setAdminCredentials({...adminCredentials, username: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Admin username"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={adminCredentials.password}
              onChange={(e) => setAdminCredentials({...adminCredentials, password: e.target.value})}
              onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
          
          <button
            onClick={handleAdminLogin}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            Login
          </button>
        </div>
        
        <div className="mt-6 text-center">
          <button
            onClick={() => setCurrentPage('login')}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Back to User Login
          </button>
        </div>
      </div>
    </div>
  );

  // Render appropriate page
  if (currentPage === 'signup') return (
    <SignupPage
      signupData={signupData}
      setSignupData={setSignupData}
      handleSignup={handleSignup}
      setCurrentPage={setCurrentPage}
    />
  );

  if (currentPage === 'login') return (
    <LoginPage
      loginEmail={loginEmail}
      setLoginEmail={setLoginEmail}
      loginPassword={loginPassword}
      setLoginPassword={setLoginPassword}
      handleLogin={handleLogin}
      setCurrentPage={setCurrentPage}
    />
  );

  if (currentPage === 'admin') return isAdminAuthenticated ? (
    <AdminPanel
      users={users}
      toggleUserApproval={toggleUserApproval}
      setIsAdminAuthenticated={setIsAdminAuthenticated}
      setCurrentPage={setCurrentPage}
    />
  ) : (
    <AdminLoginPage />
  );

  if (currentPage === 'home') return (
    <HomePage
      currentUser={currentUser}
      searchParams={searchParams}
      setSearchParams={setSearchParams}
      handleSearch={handleSearch}
      isSearching={isSearching}
      handleLogout={handleLogout}
    />
  );

  if (currentPage === 'results') return (
    <ResultsPage
      searchResults={searchResults}
      setCurrentPage={setCurrentPage}
      handleLogout={handleLogout}
    />
  );

  return (
    <LoginPage
      loginEmail={loginEmail}
      setLoginEmail={setLoginEmail}
      loginPassword={loginPassword}
      setLoginPassword={setLoginPassword}
      handleLogin={handleLogin}
      setCurrentPage={setCurrentPage}
    />
  );
};

export default App;