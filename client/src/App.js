import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import Sidebar from './components/common/Sidebar';
import Navbar from './components/common/Navbar';
import Container from './components/common/Container';
import Footer from './components/common/Footer';

import Login from './components/Login';
import ChangePassword from './components/ChangePassword';

import AnonRoute from './components/AnonRoute';
import PrivateRoute from './components/PrivateRoute';

import Production from './components/dashboard/production/List';
import ProductionAdd from './components/dashboard/production/Add';
import ProductionDetail from './components/dashboard/production/Detail';
import ProductionEdit from './components/dashboard/production/Edit';

import Shift from './components/dashboard/shift/List';
import ShiftAdd from './components/dashboard/shift/Add';
import ShiftDetail from './components/dashboard/shift/Detail';
import ShiftEdit from './components/dashboard/shift/Edit';

import Group from './components/dashboard/group/List';
import GroupAdd from './components/dashboard/group/Add';
import GroupDetail from './components/dashboard/group/Detail';
import GroupEdit from './components/dashboard/group/Edit';

import ProccessName from './components/dashboard/proccessname/List';
import ProccessNameAdd from './components/dashboard/proccessname/Add';
import ProccessNameDetail from './components/dashboard/proccessname/Detail';
import ProccessNameEdit from './components/dashboard/proccessname/Edit';

import LineNumber from './components/dashboard/linenumber/List';
import LineNumberAdd from './components/dashboard/linenumber/Add';
import LineNumberDetail from './components/dashboard/linenumber/Detail';
import LineNumberEdit from './components/dashboard/linenumber/Edit';

import ModelType from './components/dashboard/modeltype/List';
import ModelTypeAdd from './components/dashboard/modeltype/Add';
import ModelTypeDetail from './components/dashboard/modeltype/Detail';
import ModelTypeEdit from './components/dashboard/modeltype/Edit';

import PlannedActivity from './components/dashboard/plannedactivity/List';
import PlannedActivityAdd from './components/dashboard/plannedactivity/Add';
import PlannedActivityDetail from './components/dashboard/plannedactivity/Detail';
import PlannedActivityEdit from './components/dashboard/plannedactivity/Edit';

import UnplannedActivity from './components/dashboard/unplannedactivity/List';
import UnplannedActivityAdd from './components/dashboard/unplannedactivity/Add';
import UnplannedActivityDetail from './components/dashboard/unplannedactivity/Detail';
import UnplannedActivityEdit from './components/dashboard/unplannedactivity/Edit';

import OperationNumber from './components/dashboard/operationnumber/List';
import OperationNumberAdd from './components/dashboard/operationnumber/Add';
import OperationNumberDetail from './components/dashboard/operationnumber/Detail';
import OperationNumberEdit from './components/dashboard/operationnumber/Edit';

import User from './components/dashboard/user/List';
import UserAdd from './components/dashboard/user/Add';
import UserDetail from './components/dashboard/user/Detail';
import UserEdit from './components/dashboard/user/Edit';

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
          <PrivateRoute exact path="/dashboard/shift/detail/:colId" auth={props.store.auth} component={ShiftDetail} />
          <PrivateRoute exact path="/dashboard/shift/edit/:colId" auth={props.store.auth} component={ShiftEdit} />

          <PrivateRoute exact path="/dashboard/group" auth={props.store.auth} component={Group} />
          <PrivateRoute exact path="/dashboard/group/add" auth={props.store.auth} component={GroupAdd} />
          <PrivateRoute exact path="/dashboard/group/detail/:colId" auth={props.store.auth} component={GroupDetail} />
          <PrivateRoute exact path="/dashboard/group/edit/:colId" auth={props.store.auth} component={GroupEdit} />

          <PrivateRoute exact path="/dashboard/proccess-name" auth={props.store.auth} component={ProccessName} />
          <PrivateRoute exact path="/dashboard/proccess-name/add" auth={props.store.auth} component={ProccessNameAdd} />
          <PrivateRoute exact path="/dashboard/proccess-name/detail/:colId" auth={props.store.auth} component={ProccessNameDetail} />
          <PrivateRoute exact path="/dashboard/proccess-name/edit/:colId" auth={props.store.auth} component={ProccessNameEdit} />

          <PrivateRoute exact path="/dashboard/line-number" auth={props.store.auth} component={LineNumber} />
          <PrivateRoute exact path="/dashboard/line-number/add" auth={props.store.auth} component={LineNumberAdd} />
          <PrivateRoute exact path="/dashboard/line-number/detail/:colId" auth={props.store.auth} component={LineNumberDetail} />
          <PrivateRoute exact path="/dashboard/line-number/edit/:colId" auth={props.store.auth} component={LineNumberEdit} />

          <PrivateRoute exact path="/dashboard/model-type" auth={props.store.auth} component={ModelType} />
          <PrivateRoute exact path="/dashboard/model-type/add" auth={props.store.auth} component={ModelTypeAdd} />
          <PrivateRoute exact path="/dashboard/model-type/detail/:colId" auth={props.store.auth} component={ModelTypeDetail} />
          <PrivateRoute exact path="/dashboard/model-type/edit/:colId" auth={props.store.auth} component={ModelTypeEdit} />

          <PrivateRoute exact path="/dashboard/planned-activity" auth={props.store.auth} component={PlannedActivity} />
          <PrivateRoute exact path="/dashboard/planned-activity/add" auth={props.store.auth} component={PlannedActivityAdd} />
          <PrivateRoute exact path="/dashboard/planned-activity/detail/:colId" auth={props.store.auth} component={PlannedActivityDetail} />
          <PrivateRoute exact path="/dashboard/planned-activity/edit/:colId" auth={props.store.auth} component={PlannedActivityEdit} />

          <PrivateRoute exact path="/dashboard/unplanned-activity" auth={props.store.auth} component={UnplannedActivity} />
          <PrivateRoute exact path="/dashboard/unplanned-activity/add" auth={props.store.auth} component={UnplannedActivityAdd} />
          <PrivateRoute exact path="/dashboard/unplanned-activity/detail/:colId" auth={props.store.auth} component={UnplannedActivityDetail} />
          <PrivateRoute exact path="/dashboard/unplanned-activity/edit/:colId" auth={props.store.auth} component={UnplannedActivityEdit} />

          <PrivateRoute exact path="/dashboard/operation-number" auth={props.store.auth} component={OperationNumber} />
          <PrivateRoute exact path="/dashboard/operation-number/add" auth={props.store.auth} component={OperationNumberAdd} />
          <PrivateRoute exact path="/dashboard/operation-number/detail/:colId" auth={props.store.auth} component={OperationNumberDetail} />
          <PrivateRoute exact path="/dashboard/operation-number/edit/:colId" auth={props.store.auth} component={OperationNumberEdit} />

          <PrivateRoute exact path="/dashboard/users" auth={props.store.auth} component={User}/>
          <PrivateRoute exact path="/dashboard/users/add" auth={props.store.auth} component={UserAdd}/>
          <PrivateRoute exact path="/dashboard/users/detail/:userId" auth={props.store.auth} component={UserDetail}/>
          <PrivateRoute exact path="/dashboard/users/edit/:userId" auth={props.store.auth} component={UserEdit}/>

          <PrivateRoute exact path="/account/change-password" auth={props.store.auth} component={ChangePassword}/>
            
        </Container>
      </main>
    <Footer />
  </Router>
  );
}

const mapState = state => ({ store: state });
export default connect(mapState)(App);
