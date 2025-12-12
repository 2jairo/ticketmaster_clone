import axios from "axios";

const lmInstance = axios.create({
    baseURL: 'http://127.0.0.1:1234'
})

interface getEmbeddingsResponse {
    object: string
    model: string
    usage: {
        prompt_tokens: number
        total_tokens: number
    }
    data: {
        object: 'embedding'
        embedding: number[]
    }[]
}

const getEmbeddings = async (input: string) => {
    const resp = await lmInstance.post<getEmbeddingsResponse>('/v1/embeddings', {
        model: process.env.LMSTUDIO_EMBEDDING_MODEL!,
        input
    })
    return resp.data.data[0].embedding
}

export const llmStudio = {
    instance: lmInstance,
    getEmbeddings
}


