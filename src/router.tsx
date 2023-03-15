import React from "react";
import {createHashRouter} from "react-router-dom";
import {HomePage} from "./pages/Home";
import App from "./App";
import ErrorPage from "./pages/ErrorPage";
import SingleFilePage, {submitAction} from "./pages/SingleFilePage";
import {uuid, wait} from "./state/services/utils";
import {SettingsPage} from "./pages/Settings";

export async function rootLoader() {
    // TODO: do all my initial async loading stuff can go here.
    //  maybe this should be in the /state package and this inits + hooks into my state tree...
    //  do things like fetch persisted state from localstorage, etc
    await wait(20) // placeholder async for testing spinner
    return {uuid: uuid()}
}

// NOTE: use hash router so we don't lose filesystem permissions while navigating
export const router = createHashRouter([
    {
        path: "/",
        element: <App/>,
        errorElement: <ErrorPage/>,
        loader: rootLoader,
        children: [
            {
                path: "/",
                element: <HomePage/>,
            },
            {
                path: "/files/:filepath",
                element: <SingleFilePage/>,
                loader: async (args) => {
                    return {filepath: args.params.filepath}
                },
                action: submitAction,
            },
            {
                path: "/settings",
                element: <SettingsPage/>,
            },
            // TODO: lookup how to do redirects in react router
            //  need to redirect to an InitPage if state is not ready for
            //  running the app (e.g. FS not loaded, and whatever other init stuff comes up)
            {
                path: "/init",
                element: <HomePage/>,
            },
        ]
    },
])