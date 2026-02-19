import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PostsManager from './pages/PostsManager';

import BlogEditor from './pages/BlogEditor';
import CategoriesManager from './pages/CategoriesManager';
import UsersManager from './pages/UsersManager';
import AdminLayout from './components/AdminLayout';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="posts" element={<PostsManager />} />
          <Route path="categories" element={<CategoriesManager />} />
          <Route path="users" element={<UsersManager />} />
          <Route path="editor" element={<BlogEditor />} />
          <Route path="editor/:id" element={<BlogEditor />} />
        </Route>
      </Routes>
    </Router>
  );
}


export default App;
