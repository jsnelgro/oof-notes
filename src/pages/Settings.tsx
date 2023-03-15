import React from "react";
import {ActionIcon, Container, Text, Title, useMantineColorScheme} from "@mantine/core";
import {IconMoonStars, IconSun} from "@tabler/icons-react";

export function SettingsPage() {
    const {colorScheme, toggleColorScheme} = useMantineColorScheme();
    return (
        <Container>
            <Title order={1}>Settings</Title>
            <Text>TODO: make a settings page...</Text>
            <ActionIcon variant="default" onClick={() => toggleColorScheme()} size={30}>
                {colorScheme === 'dark' ? <IconSun size="1rem"/> : <IconMoonStars size="1rem"/>}
            </ActionIcon>
        </Container>
    )
}
