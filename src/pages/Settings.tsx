import React from "react";
import {ActionIcon, Container, createStyles, Input, Text, Title, useMantineColorScheme} from "@mantine/core";
import {IconMoonStars, IconSun} from "@tabler/icons-react";
import {useSnapshot} from "valtio";
import settings from "../state/settingsStore";
import {bind} from "../widgets/react-utils";

// NOTE: I don't love it but this is how you style things... really miss Vue's simple scoped style tag
const useStyles = createStyles((theme) => {
    const {green, red, blue} = theme.colors;

    return {
        root: {
            background: red[5],
            color: "red",
            "& > h1": {
                color: green[2],
            },
            "& .my-eye": {
                color: blue[2]
            }
        }
    }
})

export function SettingsPage() {
    const {colorScheme, toggleColorScheme} = useMantineColorScheme();
    const s = useSnapshot(settings)
    const styles = useStyles()

    return (
        <Container className={styles.classes.root}>
            <Title order={1}>Settings</Title>
            {/*<TextInput value={}/>*/}
            <Text>TODO: make a <i className="my-eye">settings page...</i></Text>
            <Input {...bind(s.notesDirectory, s.setNotesDirectory)} />
            <ActionIcon variant="default" onClick={() => toggleColorScheme()} size={30}>
                {colorScheme === 'dark' ? <IconSun size="1rem"/> : <IconMoonStars size="1rem"/>}
            </ActionIcon>
        </Container>
    )
}
