import React from "react";
import {useSnapshot} from "valtio";
import {rootStore} from "../state/rootStore";
import {Box, Container, Divider, Stack, Title} from "@mantine/core";
import {For, If} from "../widgets/react-utils";
import {useAsync} from "react-use";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MemoryPage() {
    const s = useSnapshot(rootStore)
    const contents = useAsync(s.recentChronoNotesContent, [s.recentChronoNotes])
    return <Container>
        <If when={contents.loading}>loading...</If>
        <Stack>
            <For each={contents.value ?? []}>{(it, i) => (
                <Box>
                    <Title order={1}>{s.recentChronoNotes[i].name}</Title>
                    <Divider/>
                    <ReactMarkdown remarkPlugins={[remarkGfm]} key={it}>{it}</ReactMarkdown>
                </Box>
            )}</For>
        </Stack>
    </Container>
}