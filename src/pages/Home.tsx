import React, {PropsWithChildren, Suspense} from 'react'
import {Box, Container, Text, Title} from "@mantine/core";
import {useSnapshot} from "valtio";
import {state} from "../state/fileStore";

export function FileContents(): JSX.Element {
    // const {selectedFileContent} = useSnapshot(state.derived)
    const {selectedFile, derived} = useSnapshot(state)
    return <Box>
        <Title variant="gradient"
               gradient={{from: 'indigo', to: 'cyan', deg: 45}}
               w={"fit-content"}
               style={{overflowWrap: "break-word"}}
               order={2}
        >
            {selectedFile?.path}
        </Title>
        <Text style={{whiteSpace: "pre-wrap"}} size="lg">{derived.selectedFileContent}</Text>
    </Box>
}

export function HomePage(props: PropsWithChildren): JSX.Element {
    const store = useSnapshot(state)

    return (<>
        <Container>
            <Suspense fallback={"loading..."}>
                <FileContents/>
            </Suspense>
        </Container>
    </>)
}