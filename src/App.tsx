import React, {useState} from 'react'
import './App.css'
import {
    ActionIcon,
    AppShell,
    Burger,
    Header,
    MediaQuery,
    Navbar,
    Text,
    Title,
    useMantineColorScheme,
    useMantineTheme
} from "@mantine/core";
import {IconMoonStars, IconSun} from "@tabler/icons-react";
import {Link, Outlet, useLoaderData} from "react-router-dom";
import {rootLoader} from "./router";

function App() {
    const routeData = useLoaderData() as Awaited<ReturnType<typeof rootLoader>> | undefined
    const [opened, setOpened] = useState(false)
    const theme = useMantineTheme();
    const {colorScheme, toggleColorScheme} = useMantineColorScheme();

    return (
        <AppShell
            navbarOffsetBreakpoint="sm"
            styles={{
                main: {
                    background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                },
            }}
            navbar={<Navbar
                p="md"
                hiddenBreakpoint="sm"
                width={{sm: 200, lg: 300}}
            >
                <Navbar.Section><Text>Useful Stuff {routeData?.uuid}</Text></Navbar.Section>
                <Navbar.Section grow mt="md">
                    <Link to={`/files/today`}>Today</Link>
                </Navbar.Section>
                <Navbar.Section>
                    <Text>Some important fixed footer stuff here</Text>
                    <Link to={`/settings`}>Settings</Link>
                </Navbar.Section>

            </Navbar>}
            header={
                <Header height={{base: 50, md: 70}} p="md">
                    <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>
                        <MediaQuery largerThan="sm" styles={{display: 'none'}}>
                            <Burger
                                opened={opened}
                                onClick={() => setOpened((it) => !it)}
                                size="sm"
                                color={theme.colors.gray[6]}
                                mr="xl"
                            />
                        </MediaQuery>
                        <Title order={1}>Oof Notes</Title>
                        {/* TODO: this should go on the settings page */}
                        <ActionIcon variant="default" onClick={() => toggleColorScheme()} size={30}>
                            {colorScheme === 'dark' ? <IconSun size="1rem"/> : <IconMoonStars size="1rem"/>}
                        </ActionIcon>
                    </div>
                </Header>
            }
        >
            <Outlet/>
        </AppShell>
    )
}

export default App
