import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {Center, ColorSchemeProvider, Loader, MantineProvider} from "@mantine/core";
import {RouterProvider} from "react-router-dom";
import {router} from "./router";
import {configureGlobalDayJs} from "./utils";
import {useMedia} from "react-use";

configureGlobalDayJs()

const LoadingView = () => {
    // it'd be nice if it faded in slowly and mby had a little fade out too... or some sort of less-jarring experience
    return <Center h="75vh">
        {<Loader size="xl"/>}
    </Center>
}

const Main = () => {
    const colorSchemeMode = useMedia("(prefers-color-scheme: dark)") ? "dark" : "light"

    return <React.StrictMode>
        <ColorSchemeProvider colorScheme={colorSchemeMode} toggleColorScheme={() => colorSchemeMode}>
            <MantineProvider theme={{colorScheme: colorSchemeMode}} withCSSVariables withGlobalStyles withNormalizeCSS>
                <RouterProvider router={router} fallbackElement={<LoadingView/>}/>
            </MantineProvider>
        </ColorSchemeProvider>
    </React.StrictMode>
}
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <Main/>,
)
