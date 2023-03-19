import React, {PropsWithChildren, Suspense} from 'react'
import {Box, Container, Text, Title} from "@mantine/core";
import {derived, fileStore} from "../state/fileStore";
import {useSnapshot} from "valtio";

export function FileContents(): JSX.Element {
    const {selectedFileContent} = useSnapshot(derived)
    const {selectedFile} = useSnapshot(fileStore)
    return <Box>
        <Title>TODO: this page doesn't do much anymore... just remove it? Or transform it into a "todos" view</Title>
        <Title variant="gradient"
               gradient={{from: 'indigo', to: 'cyan', deg: 45}}
               w={"fit-content"}
               style={{overflowWrap: "break-word"}}
               order={2}
        >
            {selectedFile?.path}
        </Title>
        <Text style={{whiteSpace: "pre-wrap"}} size="lg">{selectedFileContent}</Text>
    </Box>
}

export function HomePage(props: PropsWithChildren): JSX.Element {
    const store = useSnapshot(fileStore)

    return (<>
        <Container>
            <Suspense fallback={"loading..."}>
                <FileContents/>
            </Suspense>
        </Container>
    </>)
}