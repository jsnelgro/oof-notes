import React from "react";
import {createHashRouter} from "react-router-dom";
import {HomePage} from "./pages/Home";
import App from "./App";
import ErrorPage from "./pages/ErrorPage";
import SingleFilePage from "./pages/SingleFilePage";

export const router = createHashRouter([
    {
        path: "/",
        element: <App/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                path: "/",
                element: <HomePage/>,
            },
            {
                path: "/files/:filepath",
                element: <SingleFilePage/>,
            },
            // TODO: make redirect to an InitPage if state is not ready for running the app
            {
                path: "/init",
                element: <HomePage/>,
            },
        ]
    },
])