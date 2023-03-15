import React, {PropsWithChildren, Suspense} from 'react'
import {Button, Text} from "@mantine/core";
import {If} from "../widgets/react-utils";
import {derived, DirNode, initApp, setSelectedFile, state} from "../state/store";
import {TreeNode} from "../widgets/TreeNode";
import {useSnapshot} from "valtio";

export function FileContents(): JSX.Element {
    const {selectedFileContent} = useSnapshot(derived)
    const {selectedFile} = useSnapshot(state)
    return <div className="fileContents"><h3>{selectedFile?.path}</h3>
        <pre>{selectedFileContent}</pre>
    </div>
}

export function HomePage(props: PropsWithChildren): JSX.Element {
    const store = useSnapshot(state)

    return (<>
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
    </>)
}