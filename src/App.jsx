// src/App.jsx
import React from 'react';

import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import { useAuth } from './contexts/AuthContext';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import SetsPage from './pages/SetsPage'; // <-- NEW: Import the new Sets page

// This component protects routes that require a user to be logged in
function ProtectedRoute({ children }) {
    const { currentUser } = useAuth();
    return currentUser ? children : <Navigate to="/" />;
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route 
                    path="/sets" // <-- NEW: The main page after login
                    element={
                        <ProtectedRoute>
                            <SetsPage />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/dashboard/:setId" // <-- UPDATED: Now a dynamic route
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    } 
                />
            </Routes>
        </Router>
    );
}

export default App;