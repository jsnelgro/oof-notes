import React, {ReactNode, Suspense, SyntheticEvent, useState} from 'react'
import './App.css'
import {useSnapshot} from "valtio";
import {derived, DirNode, FSNode, initApp, setSelectedFile, state} from "./store";
import {
    ActionIcon,
    AppShell, Box,
    Burger,
    Button,
    Col, Group,
    Header,
    List,
    MediaQuery,
    Navbar, Stack,
    Text, UnstyledButton, useMantineColorScheme,
    useMantineTheme
} from "@mantine/core";
import {IconMoonStars, IconSun} from "@tabler/icons-react";
import {JSONTree} from "react-json-tree";

function FileContents(): JSX.Element {
    const {selectedFileContent} = useSnapshot(derived)
    const {selectedFile} = useSnapshot(state)
    return <div className="fileContents"><h3>{selectedFile?.path}</h3>
        <pre>{selectedFileContent}</pre>
    </div>
}

const If: React.FunctionComponent<React.PropsWithChildren & {
    when: boolean
}> = (props) => {
    return <>{props.when ? props.children : null}</>
}

const For = <T extends any>(props: { each: T[], children: (it: T) => ReactNode | undefined }) => <>
    {props.each.map(it => {
        return props.children(it)
    })}
</>;

type FileTreeNodeActions = { toggleExpanded: () => void }
const TreeNode: React.FunctionComponent<{ root: FSNode, expanded?: boolean, onClick: (it: FSNode, actions: FileTreeNodeActions) => void, selectedPath: string }> = (props) => {
    const {root, onClick, selectedPath} = props
    const theme = useMantineTheme()
    const [expanded, setExpanded] = useState(props.expanded ?? false)
    const doClick = (ev: SyntheticEvent, n: FSNode) => {
        ev.preventDefault()
        ev.stopPropagation()
        onClick(n, {toggleExpanded: () => setExpanded(!expanded)})
    }
    return (
        <Box key={root.path}
             style={{cursor: "pointer"}}
             onClick={(e) => doClick(e, root)}>
            <Stack style={{textDecoration: root.path === selectedPath ? "underline" : "none"}}>
                {root.name}
            </Stack>
            <If when={root.kind === "directory" && expanded}>
                <List listStyleType="none" withPadding style={{borderLeft: `2px solid ${theme.colors.gray[2]}`}}>
                    <For each={(root as DirNode).children ?? []}>
                        {it => <List.Item key={it.path}>
                            <TreeNode root={it} onClick={onClick} selectedPath={selectedPath}/>
                        </List.Item>}
                    </For>
                </List>
            </If>
        </Box>
    )
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
                                  selectedPath={store.selectedFilePath}
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
