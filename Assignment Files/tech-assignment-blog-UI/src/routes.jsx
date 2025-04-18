import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BlogList from './pages/BlogList/BlogList';
import BlogPost from './pages/BlogPost/BlogPost';
import ErrorBoundary from './components/ErrorBoundary';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:postId" element={<BlogPost />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default AppRoutes;