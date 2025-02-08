import { createClient } from "next-sanity";

const client = createClient({
    projectId: "en8led0l",
    dataset: "production",
    useCdn: true,
    apiVersion: "2023-10-10",
})

export async function SanityFetch({query, params = {}}: {query: string, params?: any}) {
    return await client.fetch(query, params)
}