import React, {useState} from 'react'
import './App.css'
import {
    ActionIcon,
    AppShell,
    Burger,
    Button,
    Header,
    MediaQuery,
    Navbar,
    ScrollArea,
    Text,
    Title,
    useMantineColorScheme,
    useMantineTheme
} from "@mantine/core";
import {IconMoonStars, IconSun} from "@tabler/icons-react";
import {NavLink, Outlet, useLoaderData} from "react-router-dom";
import {rootLoader} from "./router";
import {If} from "./widgets/react-utils";
import {DirNode, initApp, setSelectedFile, state} from "./state/store";
import {TreeNode} from "./widgets/TreeNode";
import {useSnapshot} from "valtio";

function App() {
    const routeData = useLoaderData() as Awaited<ReturnType<typeof rootLoader>> | undefined
    const [opened, setOpened] = useState(false)
    const theme = useMantineTheme();
    const {colorScheme, toggleColorScheme} = useMantineColorScheme();
    const store = useSnapshot(state)

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
                <Navbar.Section>
                    <NavLink to={`/files/today`}>Today</NavLink>
                </Navbar.Section>
                <Navbar.Section grow component={ScrollArea} mt="lg">
                    <If when={store.rootDirHandle === null}>
                        <Button onClick={() => initApp()}>Open Files</Button>
                    </If>
                    <If when={!!store.filesAsTree}>
                        <TreeNode root={store.filesAsTree as DirNode}
                                  expanded={true}
                                  onClick={(n, actions) => {
                                      actions.toggleExpanded()
                                      setSelectedFile(n.path)
                                  }}
                                  selectedPaths={new Set([store.selectedFilePath])}
                        />
                    </If>
                </Navbar.Section>
                <Navbar.Section>
                    <Text>Some important fixed footer stuff here</Text>
                    <NavLink to={`/settings`}>Settings</NavLink>
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
