import React from "react";
import {Box, Center, Container, Divider, Loader, Title} from "@mantine/core";
import {ActionFunction, redirect, useLoaderData} from "react-router-dom";
import {wait} from "../utils";
import {fetchFileContentByPath} from "../state/fileStore";
import {useAsync} from "react-use";
import {If} from "../widgets/react-utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// TODO: rm me. This is just an example of how to use react router's Form stuff... it's... ok.
export const submitAction: ActionFunction = async (args) => {
    await wait(200)
    const fd = await args.request.formData()
    console.log("submitted form data", fd)
    return redirect(`/`)
}
export default function SingleFilePage() {
    const routeData = useLoaderData() as { filepath: string } | undefined
    const content = useAsync(
        async () => await routeData?.filepath?.let(fetchFileContentByPath) ?? undefined,
        [routeData?.filepath]
    )
    return (
        <Container fluid>
            <If when={content.loading}><Center><Loader size="xl"/></Center></If>
            <Box style={{wordBreak: "break-word"}}>
                <Title order={1}>{routeData?.filepath}</Title>
                <Divider/>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content.value ?? ""}</ReactMarkdown>
            </Box>
        </Container>
    );
}