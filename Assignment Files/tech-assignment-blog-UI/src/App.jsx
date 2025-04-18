import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import AppRoutes from './routes';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default App;