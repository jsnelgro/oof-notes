import React, {ReactNode, Suspense} from 'react'
import './App.css'
import {useSnapshot} from "valtio";
import {derived, initApp, setSelectedFile, state} from "./store";

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

    return (
        <div className="App">
            <h1>Oof Notes</h1>
            <p>Loading State: {store.loadingState}</p>
            <p>{`Selected File: ${JSON.stringify(store.selectedFile)}`}</p>
            <div className="row">
                <div className="col fileTree">
                    <Show when={store.rootDirHandle === null}>
                        <button onClick={() => initApp()}>Open Files</button>
                    </Show>
                    <ul>
                        <For each={Object.keys(store.files)}>{((path) => (
                            <li key={path}>
                                <button onClick={() => setSelectedFile(path)}>{path}</button>
                            </li>))}
                        </For>
                    </ul>
                </div>
                <div className="col">
                    <Suspense fallback={"loading..."}>
                        <FileContents/>
                    </Suspense>
                </div>
            </div>
        </div>
    )
}

export default App
