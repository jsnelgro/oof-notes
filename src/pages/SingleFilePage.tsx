import React from "react";
import {Center, Container, Group, Stack, Text, Title} from "@mantine/core";
import {ActionFunction, Form, redirect, useLoaderData} from "react-router-dom";
import {wait} from "../state/services/utils";

// TODO: rm me. This is just an example of how to use react router's Form stuff... it's... ok.
export const submitAction: ActionFunction = async (args) => {
    await wait(200)
    const fd = await args.request.formData()
    console.log("submitted form data", fd)
    return redirect(`/`)
}
export default function SingleFilePage() {
    const routeData = useLoaderData() as { filepath: string } | undefined
    return (
        <Container fluid h={"100vh"}>
            <Center h={"75%"}>
                <Stack>
                    <Title order={1}>{routeData?.filepath ?? `idk... ${routeData}`}</Title>
                    <Group>
                        <Text>TODO: load up dis content boi</Text>
                        <Form method="post">
                            <button type="submit">Submit Page</button>
                        </Form>
                    </Group>
                </Stack>
            </Center>
        </Container>
    );
}