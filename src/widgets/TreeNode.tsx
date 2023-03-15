import React, {SyntheticEvent, useState} from "react";
import {DirNode, FSNode} from "../state/store";
import {Box, List, Stack, useMantineTheme} from "@mantine/core";
import {For, If} from "./react-utils";

type FileTreeNodeActions = { toggleExpanded: () => void }
export const TreeNode: React.FunctionComponent<{ root: FSNode, expanded?: boolean, onClick: (it: FSNode, actions: FileTreeNodeActions) => void, selectedPaths: Set<string> }> = (props) => {
    const {root, onClick, selectedPaths} = props
    const theme = useMantineTheme()
    const [expanded, setExpanded] = useState(props.expanded ?? false)
    const doClick = (ev: SyntheticEvent, n: FSNode) => {
        ev.preventDefault()
        ev.stopPropagation()
        onClick(n, {toggleExpanded: () => setExpanded(!expanded)})
    }
    return (
        <Box key={root.path}
             style={{cursor: "pointer"}}
             onClick={(e) => doClick(e, root)}>
            <Stack style={{textDecoration: selectedPaths.has(root.path) ? "underline" : "none"}}>
                {root.name}
            </Stack>
            <If when={root.kind === "directory" && expanded}>
                <List listStyleType="none" withPadding style={{borderLeft: `2px solid ${theme.colors.gray[2]}`}}>
                    <For each={(root as DirNode).children ?? []}>
                        {it => <List.Item key={it.path}>
                            <TreeNode root={it} onClick={onClick} selectedPaths={selectedPaths}/>
                        </List.Item>}
                    </For>
                </List>
            </If>
        </Box>
    )
}