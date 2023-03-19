import React, {useState} from 'react'
import './App.css'
import {
    AppShell,
    Burger,
    Button,
    Divider,
    Group,
    Header,
    MediaQuery,
    Navbar,
    NavLink as UINavLink,
    ScrollArea,
    Title,
    useMantineTheme
} from "@mantine/core";
import {NavLink, Outlet, useLoaderData, useNavigate} from "react-router-dom";
import {rootLoader} from "./router";
import {If} from "./widgets/react-utils";
import {DirNode, fileStore, init, setSelectedFile} from "./state/fileStore";
import {TreeNode} from "./widgets/TreeNode";
import {useSnapshot} from "valtio";
import {IconBrain, IconClock, IconHome, IconSettings} from "@tabler/icons-react";

function App() {
    const routeData = useLoaderData() as Awaited<ReturnType<typeof rootLoader>> | undefined
    const navigate = useNavigate();

    const [opened, setOpened] = useState(false)
    const theme = useMantineTheme();
    const store = useSnapshot(fileStore)

    return (
        <AppShell
            navbarOffsetBreakpoint="sm"
            styles={{
                main: {
                    background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                },
            }}
            navbar={<Navbar
                hidden={!opened}
                // HACK: there's some bug with the layout where their calc doesn't work, so this copies it and puts a -1px
                //  wich magically aligns it again...
                sx={{height: "calc(100vh - var(--mantine-header-height, 0rem) - var(--mantine-footer-height, 0rem)) - 1px"}}
                p="md"
                hiddenBreakpoint="sm"
                width={{base: 200, sm: 200, lg: 300}}
            >
                <Navbar.Section mt="xs">
                    <Group pb={"md"}>
                        <UINavLink label="Home" to="/" component={NavLink}
                                   icon={<IconHome/>}
                                   onClick={() => setOpened(false)}></UINavLink>
                        <UINavLink label="Today" to={`/files/${"TODO"}`} component={NavLink}
                                   icon={<IconClock/>}
                                   onClick={() => setOpened(false)}></UINavLink>
                        <UINavLink label="Memory" to="/memory" component={NavLink}
                                   icon={<IconBrain/>}
                                   onClick={() => setOpened(false)}></UINavLink>
                    </Group>
                    <Divider/>
                </Navbar.Section>
                <Navbar.Section grow component={ScrollArea} mx={"-xs"} px={"xs"}>
                    <Group py="md">
                        <If when={store.rootDirHandle === null}>
                            <Button onClick={() => init()}>Open Files</Button>
                        </If>
                        <If when={!!store.filesAsTree}>
                            <TreeNode root={store.filesAsTree as DirNode}
                                      expanded={true}
                                      onClick={(n, actions) => {
                                          actions.toggleExpanded()
                                          setSelectedFile(n.path)
                                          if (n.kind === "file") {
                                              setOpened(false)
                                              navigate(`/files/${n.path}`)
                                          }
                                      }}
                                      selectedPaths={new Set([store.selectedFilePath])}
                            />
                        </If>
                    </Group>
                </Navbar.Section>
                <Navbar.Section>
                    <Divider/>
                    <Group>
                        <UINavLink label="Settings" to="/settings" component={NavLink}
                                   icon={<IconSettings/>}
                                   onClick={() => setOpened(false)}></UINavLink>
                    </Group>
                </Navbar.Section>

            </Navbar>}
            header={
                <Header height={{base: 50, md: 50}} p="md">
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
                        <Title order={1} align={"center"}>Oof</Title>
                    </div>
                </Header>
            }
            // footer={
            //     <Footer height={20}>
            //         <Box>Footer</Box>
            //     </Footer>
            // }
        >
            <Outlet/>
        </AppShell>
    )
}

export default App
