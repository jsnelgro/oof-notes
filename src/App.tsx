import React, {ReactNode, Suspense, useState} from 'react'
import './App.css'
import {useSnapshot} from "valtio";
import {derived, initApp, setSelectedFile, state} from "./store";
import {
    ActionIcon,
    AppShell, Box,
    Burger,
    Button,
    Col, Group,
    Header,
    List,
    MediaQuery,
    Navbar,
    Text, useMantineColorScheme,
    useMantineTheme
} from "@mantine/core";
import {ListItem} from "@mantine/core/lib/List/ListItem/ListItem";
import {IconMoonStars, IconSun} from "@tabler/icons-react";

function FileContents(): JSX.Element {
    const {selectedFileContent} = useSnapshot(derived)
    const {selectedFile} = useSnapshot(state)
    return <div className="fileContents"><h3>{selectedFile?.path}</h3>
        <pre>{selectedFileContent}</pre>
    </div>
}

const Show: React.FunctionComponent<React.PropsWithChildren & {
    when: boolean
}> = (props) => {
    return <>{props.when ? props.children : null}</>
}

const For = <T extends any>(props: { each: T[], children: (it: T) => ReactNode | undefined }) => <>
    {props.each.map(it => {
        return props.children(it)
    })}
</>;

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
                    <Show when={store.rootDirHandle === null}>
                        <Button onClick={() => initApp()}>Open Files</Button>
                    </Show>
                    <List>
                        <For each={Object.keys(store.files)}>{((path) => (
                            <List.Item key={path}>
                                <Button onClick={() => setSelectedFile(path)}>{path}</Button>
                            </List.Item>))}
                        </For>
                    </List>
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
