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
import ProductionAdd from './components/dashboard/production/Add';
import ProductionDetail from './components/dashboard/production/Detail';
import ProductionEdit from './components/dashboard/production/Edit';

import Shift from './components/dashboard/shift/List';
import ShiftAdd from './components/dashboard/shift/Add';

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
          <PrivateRoute exact path="/dashboard/production/add" auth={props.store.auth} component={ProductionAdd} />
          <PrivateRoute exact path="/dashboard/production/detail/:productionId" auth={props.store.auth} component={ProductionDetail} />
          <PrivateRoute exact path="/dashboard/production/edit/:productionId" auth={props.store.auth} component={ProductionEdit} />
        
          <PrivateRoute exact path="/dashboard/shift" auth={props.store.auth} component={Shift} />
          <PrivateRoute exact path="/dashboard/shift/add" auth={props.store.auth} component={ShiftAdd} />
            
        </Container>
      </main>
    <Footer />
  </Router>
  );
}

const mapState = state => ({ store: state });
export default connect(mapState)(App);
