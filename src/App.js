import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import { auth, handleUserProfile } from './firebase/utils';
import { setCurrentUser } from './redux/User/user.actions';


// components
import AdminToolbar from './components/AdminToolbar';

//hoc
import WithAuth from './hoc/withAuth';
import WithAdminAuth from './hoc/withAdminAuth';

// layouts

import MainLayout from './layouts/MainLayout';
import HomepageLayout from './layouts/HomepageLayout';



//pages

import Homepage from './pages/Homepage';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Recovery from './pages/Recovery';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import './default.scss';
import withAuth from './hoc/withAuth';

const App = props => {
  const dispatch = useDispatch(); 
  
    useEffect(() => {
      const authListener = auth.onAuthStateChanged(async userAuth => {
        if (userAuth) {
          const userRef = await handleUserProfile(userAuth);
          userRef.onSnapshot(snapshot => {
            dispatch(setCurrentUser({
              id: snapshot.id,
              ...snapshot.data()
            }));
          })
        }

      dispatch(setCurrentUser(userAuth)); 
  });

    return () => {
      authListener();
    };
  }, []);

    return(
      <div className="App">
        <AdminToolbar />
          <Switch>
            <Route exact path="/" render={() => (
              <HomepageLayout>
                <Homepage />
              </HomepageLayout>
  
            )} />
            <Route path="/registration"  render={() => (
              <MainLayout>
                <Registration />
              </MainLayout>
  
            )}/>  
            <Route path="/login"
              render={() =>  (
                <MainLayout>
                  <Login />
                </MainLayout>
    
              )}/> 

              <Route path="/recovery" render={() => (
                <MainLayout>
                  <Recovery />
                </MainLayout>
              )} />

              <Route path="/dashboard" render={() => (
                <WithAuth>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
                </WithAuth>
              )} />

              <Route path="/admin" render={() => (
                <WithAdminAuth>
                <MainLayout>
                  <Admin />
                </MainLayout>
                </WithAdminAuth>
              )} />
   
          </Switch>
       
      </div>
    );  
  }
  
export default App;
