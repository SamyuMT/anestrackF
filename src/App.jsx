import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, createContext } from 'react';
import LoginAdmin from './pages/LoginAdmin';
import LoginToken from './pages/LoginToken';
import TablaAdmin from './pages/TablaAdmin';
import Registro from './pages/Registro';

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState('');

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, isTokenValid, setIsTokenValid }}>
      {children}
    </AuthContext.Provider>
  );
}

function PrivateRoute({ children, condition }) {
  return condition ? children : <Navigate to="/token" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/admin" element={<LoginAdmin />} />
            <Route path="/token" element={<LoginToken />} />
            <Route
              path="/tabla-admin"
              element={
                <AuthContext.Consumer>
                  {({ isAuthenticated }) => (
                    <PrivateRoute condition={isAuthenticated}>
                      <TablaAdmin />
                    </PrivateRoute>
                  )}
                </AuthContext.Consumer>
              }
            />
            <Route
              path="/registro"
              element={
                <AuthContext.Consumer>
                  {({ isTokenValid }) => (
                    <PrivateRoute condition={isTokenValid}>
                      <Registro />
                    </PrivateRoute>
                  )}
                </AuthContext.Consumer>
              }
            />
            <Route path="*" element={<Navigate to="/token" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;