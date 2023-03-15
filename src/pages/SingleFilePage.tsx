import {Center, Container, Group, Stack, Title} from "@mantine/core";

export default function SingleFilePage() {
    return (
        <Container fluid h={"100vh"}>
            <Center h={"75%"}>
                <Stack>
                    <Title order={1}>TODO</Title>
                    <Group>
                        TODO
                    </Group>
                </Stack>
            </Center>
        </Container>
    );
}