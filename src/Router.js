import React from 'react'
import { HashRouter as DomRouter, Switch, Route, Redirect } from "react-router-dom"
import { createHashHistory } from "history"

import OsPage from './pages/OS'
import { ToastContextProvider } from './hooks/ToastContext'
import Authentication from './components/Authentication'

const customHistory = createHashHistory();
const PrivateRoute = (props) => {
    return (
        <Authentication >
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
                        <PrivateRoute exact path={['/', '/admin']} component={OsPage} />
                        {/* <Route  >
                            <Authentication >
                                <OsPage />
                            </Authentication>
                        </Route> */}
                        {/* <Route exact path={'/admin'} component={Authentication} /> */}
                        <Route exact path={'/os/:os'} component={OsPage} />
                        <Route path="*" >
                            <Redirect to='/' />
                        </Route>
                    </Switch>
                </DomRouter>
            </ToastContextProvider>
        </>
    );
}
