import React from "react";
import {useSnapshot} from "valtio";
import {rootStore} from "../state/rootStore";
import {Box, Center, Container, Divider, Loader, Stack, Textarea, Title} from "@mantine/core";
import {For, If} from "../widgets/react-utils";
import {useAsync} from "react-use";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MemoryPage() {
    const s = useSnapshot(rootStore)
    const contents = useAsync(s.recentChronoNotesWithContent, [s.recentChronoNotes])

    return <Container>
        <If when={contents.loading}><Center><Loader size="xl"/></Center></If>
        <Stack>
            <For each={contents.value ?? []}>{(it) => (
                <Box key={it.path} style={{wordBreak: "break-word"}}>
                    <Title order={1}>{it.date.isToday() ? "Today" : it.date.fromNow()}</Title>
                    <Divider/>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{it.content}</ReactMarkdown>
                </Box>
            )}</For>
        </Stack>
        <Textarea mb={"xl"} autosize minRows={6}/>
    </Container>
}