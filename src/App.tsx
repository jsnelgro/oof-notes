import React, {Suspense, useState} from 'react'
import './App.css'
import {useSnapshot} from "valtio";
import {derived, DirNode, initApp, setSelectedFile, state} from "./state/store";
import {
    ActionIcon,
    AppShell,
    Burger,
    Button,
    Header,
    MediaQuery,
    Navbar,
    Text,
    useMantineColorScheme,
    useMantineTheme
} from "@mantine/core";
import {IconMoonStars, IconSun} from "@tabler/icons-react";
import {TreeNode} from "./widgets/TreeNode";
import {If} from "./widgets/react-utils";

function FileContents(): JSX.Element {
    const {selectedFileContent} = useSnapshot(derived)
    const {selectedFile} = useSnapshot(state)
    return <div className="fileContents"><h3>{selectedFile?.path}</h3>
        <pre>{selectedFileContent}</pre>
    </div>
}

function App() {
    const store = useSnapshot(state)
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
                <Text>Application navbar</Text>
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
                        <Text size="lg">Oof Notes</Text>
                        <ActionIcon variant="default" onClick={() => toggleColorScheme()} size={30}>
                            {colorScheme === 'dark' ? <IconSun size="1rem"/> : <IconMoonStars size="1rem"/>}
                        </ActionIcon>
                    </div>
                </Header>
            }
        >
            <Text>Loading State: {store.loadingState}</Text>
            <Text>{`Selected File: ${JSON.stringify(store.selectedFile)}`}</Text>
            <div>
                <div>
                    <If when={store.rootDirHandle === null}>
                        <Button onClick={() => initApp()}>Open Files</Button>
                    </If>
                    <If when={!!store.filesAsTree}>
                        {/*<JSONTree data={store} />*/}
                        <TreeNode root={store.filesAsTree as DirNode}
                                  expanded={true}
                                  onClick={(n, actions) => {
                                      actions.toggleExpanded()
                                      setSelectedFile(n.path)
                                  }}
                                  selectedPaths={new Set([store.selectedFilePath])}
                        />
                    </If>
                </div>
                <div>
                    <Suspense fallback={"loading..."}>
                        <FileContents/>
                    </Suspense>
                </div>
            </div>
        </AppShell>
    )
}

export default App
