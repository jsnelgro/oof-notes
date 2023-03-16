import React, {useState} from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {Center, ColorScheme, ColorSchemeProvider, Loader, MantineProvider} from "@mantine/core";
import {useColorScheme} from "@mantine/hooks";
import {RouterProvider} from "react-router-dom";
import {router} from "./router";

const Main = () => {
    // TODO: add event listener to listen for dark mode change.
    //  Should probably make a service that exposes dark mode + listener
    // actually useColorScheme should work dynamically... hmm...
    // docs: https://mantine.dev/hooks/use-color-scheme/#usage
    const colorSchemeMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light"
    const preferredColorScheme = useColorScheme(colorSchemeMode);
    const [colorScheme, setColorScheme] = useState<ColorScheme>(preferredColorScheme);
    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

    return <React.StrictMode>
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <MantineProvider theme={{colorScheme}} withGlobalStyles withNormalizeCSS>
                <RouterProvider router={router} fallbackElement={
                    // TODO: should wait about 200ms before showing spinner to make it less glitchy/jarring
                    //   also it'd be nice if it faded in slowly and had a little fade out too...
                    //   not too big a deal though
                    <Center h="75vh"><Loader size="xl"/></Center>
                }/>
            </MantineProvider>
        </ColorSchemeProvider>
    </React.StrictMode>
}
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <Main/>,
)
