import React from "react";
import {ActionIcon, Container, createStyles, NumberInput, TextInput, Title, useMantineColorScheme} from "@mantine/core";
import {IconMoonStars, IconSun} from "@tabler/icons-react";
import {useSnapshot} from "valtio";
import * as SettingsStore from "../state/settingsStore";
import {settingsStore} from "../state/settingsStore";
import {bind} from "../widgets/react-utils";

// NOTE: I don't love it but this is how you style things... really miss Vue's simple scoped style tag
const useStyles = createStyles((theme) => {
    const {green, red, blue} = theme.colors;

    return {
        root: {
            //     background: red[5],
            //     color: "red",
            //     "& > h1": {
            //         color: green[2],
            //     },
            //     "& .my-eye": {
            //         color: blue[2]
            //     }
        }
    }
})

export function SettingsPage() {
    const {colorScheme, toggleColorScheme} = useMantineColorScheme();
    const s = useSnapshot(SettingsStore.settingsStore)
    const styles = useStyles()

    return (
        <Container className={styles.classes.root}>
            <Title order={1}>Settings</Title>
            <TextInput
                label={"Daily Notes Directory"}
                {...bind(s.chronoNotesDirectory, SettingsStore.setChronoNotesDirectory)}
            />
            <TextInput
                label={"Daily Note Filename Pattern"}
                {...bind(s.dailyNotePattern, SettingsStore.setDailyNotePattern)}
            />
            <TextInput
                label={"Daily Note Filetype"}
                {...bind(s.fileType, (t) => settingsStore.fileType = t)}
            />
            <NumberInput
                label="Lookback Days"
                value={settingsStore.rollingViewLookbackDays}
                onChange={v => {
                    // TODO: something buggy with this number input
                    if (v !== "") {
                        settingsStore.rollingViewLookbackDays = v
                    }
                }}
            />
            <ActionIcon variant="default" onClick={() => toggleColorScheme()} size={30}>
                {colorScheme === 'dark' ? <IconSun size="1rem"/> : <IconMoonStars size="1rem"/>}
            </ActionIcon>
        </Container>
    )
}
