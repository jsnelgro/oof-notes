import React from "react";
import {Link, useRouteError} from "react-router-dom";
import {Center, Container, Group, Stack, Text, Title} from "@mantine/core";

export default function ErrorPage() {
    const error = useRouteError() as any;
    console.error(error);

    return (
        <Container fluid h={"100vh"}>
            <Center h={"75%"}>
                <Stack>
                    <Title order={1}>Oops!</Title>
                    <Group>
                        <Text>Sorry, an unexpected error has occurred.</Text>
                        <Text><i>{error.statusText || error.message}</i></Text>
                    </Group>
                    <Link to={`/`}>Return home</Link>
                </Stack>
            </Center>
        </Container>
    );
}