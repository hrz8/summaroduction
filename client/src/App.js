import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Sidebar from './components/common/Sidebar';
import Navbar from './components/common/Navbar';
import Container from './components/common/Container';
import Footer from './components/common/Footer';

import Login from './components/Login';


import './App.scss';

const App = () => {
  return (
    <Router>
      <header>
        <Sidebar />
        <Navbar />
      </header>
      <main>
        <Container>
          <Route exact path="/login" component={Login} />
        </Container>
      </main>
      <Footer />
  </Router>
  );
}

export default App;
