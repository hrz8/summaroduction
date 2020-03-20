import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const AnonRoute = ({component: Component, auth, ...rest}) => (
    <Route {...rest}
        render={(props) => (
            auth === null ? 
                <Component {...props} /> :
                <Redirect to={{
                    pathname: '/dashboard/production',
                    state: { from: props.location }
                }} />
        )}
    />
)

export default AnonRoute;
