import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import Sidebar from './components/common/Sidebar';
import Navbar from './components/common/Navbar';
import Container from './components/common/Container';
import Footer from './components/common/Footer';

import Login from './components/Login';
import AnonRoute from './components/AnonRoute';
import PrivateRoute from './components/PrivateRoute';

import Production from './components/dashboard/production/List';

import './App.scss';

const App = (props) => {
  return (
    <Router>
      <header>
        <Sidebar />
        <Navbar />
      </header>
      <main>
        <Container>
          <Route 
            exact path="/" 
            render={(props) => <Redirect to={{
              pathname: '/login',
              state: { from: props.location }
            }} />}
          />
          <AnonRoute exact path="/login" auth={props.store.auth} component={Login} />
          <PrivateRoute exact path="/dashboard/production" auth={props.store.auth} component={Production} />
        </Container>
      </main>
      <Footer />
  </Router>
  );
}

const mapState = (state) => ({ store: state });
export default connect(mapState)(App);
