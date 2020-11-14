import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom"
import { createBrowserHistory } from "history"

import OsPage from './pages/OS'
// import OsViewOnlyPage from './pages/OsViewOnly'
import { ToastContextProvider } from './hooks/ToastContext'

const customHistory = createBrowserHistory();

export default function Router() {
    return (
        <>
        <ToastContextProvider>
            <BrowserRouter history={customHistory}>
                <Switch>
                    <Route exact path={["/", '/os/:os']} component={OsPage} />
                    {/* <Route path="" component={OsPage} /> */}
                    <Route path="*" >
                        <Redirect to='/' />
                    </Route>
                </Switch>
            </BrowserRouter>
        </ToastContextProvider>
        </>
    );
}
