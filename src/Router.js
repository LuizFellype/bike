import React from 'react'
import { HashRouter as DomRouter, Switch, Route, Redirect } from "react-router-dom"
import { createHashHistory } from "history"

import AdminPage from './pages/Admin'
import OsPage from './pages/OS'
import { ToastContextProvider } from './hooks/ToastContext'
import Authentication from './components/Authentication'
import { CONSTS } from './helpers/constants'

const customHistory = createHashHistory();
const AuthRoute = ({auth, ...props}) => {
    return (
        <Authentication auth={auth}>
            <Route {...props} />
        </Authentication>
    )
}

export default function Router() {
    return (
        <>
            <ToastContextProvider>
                <DomRouter history={customHistory}>
                    <Switch>
                        <AuthRoute exact path='/admin' auth={CONSTS.PERMISSIONS.private} component={AdminPage} />
                        <AuthRoute exact path='/' component={OsPage} auth={CONSTS.PERMISSIONS.private} />
                        <AuthRoute exact path={'/os/:os'} component={OsPage} auth={CONSTS.PERMISSIONS.available} />
                        {/* <Route exact path={'/os/:os'} component={OsPage} /> */}
                        <Route path="*" >
                            <Redirect to='/' />
                        </Route>
                    </Switch>
                </DomRouter>
            </ToastContextProvider>
        </>
    );
}
