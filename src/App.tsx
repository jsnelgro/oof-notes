import React, {Suspense} from 'react'
import './App.css'
import {useSnapshot} from "valtio";
import {derived, initApp, setSelectedFile, state} from "./store";

function FileContents(): JSX.Element {
    const {selectedFile, selectedFileContent} = useSnapshot(derived)
    return <div className="fileContents"><h3>{selectedFile?.path}</h3>
        <pre>{selectedFileContent}</pre>
    </div>
}

const If: React.FunctionComponent<React.PropsWithChildren & {
    true: boolean
}> = (props) => {
    return <>{props.true ? props.children : null}</>
}

function App() {
    const store = useSnapshot(state)
    const {selectedFile} = useSnapshot(derived)

    return (
        <div className="App">
            <h1>Oof Notes</h1>
            <p>Loading State: {store.loadingState}</p>
            <p>{`Selected File: ${JSON.stringify(selectedFile)}`}</p>
            <div className="row">
                <div className="col fileTree">
                    <If true={store.rootDirHandle === null}>
                        <button onClick={() => initApp()}>Open Files</button>
                    </If>
                    <ul>
                        {Object.keys(store.files).map(path => (
                            <li key={path}>
                                <button
                                    onClick={() => setSelectedFile(path)}>{path}</button>
                            </li>
                        ))}
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
