import React, {useState} from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {ColorScheme, ColorSchemeProvider, MantineProvider} from "@mantine/core";
import {useColorScheme} from "@mantine/hooks";

const Main = () => {
    const colorSchemeMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light"
    const preferredColorScheme = useColorScheme(colorSchemeMode);
    const [colorScheme, setColorScheme] = useState<ColorScheme>(preferredColorScheme);
    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

    return <React.StrictMode>
        {/**
         TODO: doesn't seem to pick up user system preference... also there's a bug with the framework that causes a flash
         */}
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <MantineProvider theme={{colorScheme}} withGlobalStyles withNormalizeCSS>
                <App/>
            </MantineProvider>
        </ColorSchemeProvider>
    </React.StrictMode>
}
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <Main/>,
)
