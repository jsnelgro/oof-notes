import React from "react";
import {useSnapshot} from "valtio";
import {rootStore} from "../state/rootStore";
import {Box, Container, Divider, Loader, Stack, Textarea, Title} from "@mantine/core";
import {For, If} from "../widgets/react-utils";
import {useAsync} from "react-use";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";

// TODO: should figure out if this is global or what... I don't love this lib...
import dayjs from "dayjs";

dayjs.extend(relativeTime);
dayjs.extend(isToday);

export function MemoryPage() {
    const s = useSnapshot(rootStore)
    const contents = useAsync(s.recentChronoNotesWithContent, [s.recentChronoNotes])
    return <Container>
        <If when={contents.loading}><Loader size="xl"/></If>
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