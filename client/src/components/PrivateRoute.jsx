import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({component: Component, auth, ...rest}) => (
    <Route {...rest}
        render={(props) => (
            auth !== null ? 
                <Component {...props} /> :
                <Redirect to={{
                    pathname: '/login',
                    state: { from: props.location }
                }} />
        )}
    />
)

export default PrivateRoute;
