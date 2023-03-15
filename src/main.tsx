import React, {useState} from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {ColorScheme, ColorSchemeProvider, Loader, MantineProvider} from "@mantine/core";
import {useColorScheme} from "@mantine/hooks";
import {RouterProvider} from "react-router-dom";
import {router} from "./router";

const Main = () => {
    // TODO: add event listener to listen for dark mode change
    const colorSchemeMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light"
    const preferredColorScheme = useColorScheme(colorSchemeMode);
    const [colorScheme, setColorScheme] = useState<ColorScheme>(preferredColorScheme);
    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

    return <React.StrictMode>
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <MantineProvider theme={{colorScheme}} withGlobalStyles withNormalizeCSS>
                <RouterProvider router={router} fallbackElement={<Loader/>}/>
            </MantineProvider>
        </ColorSchemeProvider>
    </React.StrictMode>
}
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <Main/>,
)
