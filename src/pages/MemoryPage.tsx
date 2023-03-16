import React from "react";
import {useSnapshot} from "valtio";
import {rootStore} from "../state/rootStore";
import {Container, List} from "@mantine/core";
import {For} from "../widgets/react-utils";
import {FSNode} from "../state/fileStore";

export function MemoryPage() {
    const s = useSnapshot(rootStore)
    return <Container>
        <List>
            <For each={s.recentChronoNotes as FSNode[]}>
                {(it) => <List.Item>{it.name}</List.Item>}
            </For>
        </List>
    </Container>
}