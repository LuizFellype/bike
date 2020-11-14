import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom"
import { createBrowserHistory } from "history"

import OsPage from './pages/OS'
import { ToastContextProvider } from './hooks/ToastContext'
import Authentication from './components/Authentication'

const customHistory = createBrowserHistory();

export default function Router() {
    return (
        <>
            <ToastContextProvider>
                <BrowserRouter history={customHistory}>
                    <Authentication>
                        <Switch>
                            <Route exact path={["/", '/os/:os']} component={OsPage} />
                            {/* <Route exact path={'/admin'} component={Authentication} />  */}
                            <Route path="*" >
                                <Redirect to='/' />
                            </Route>
                        </Switch>
                    </Authentication>
                </BrowserRouter>
            </ToastContextProvider>
        </>
    );
}
