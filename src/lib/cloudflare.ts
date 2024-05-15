import { S3Client } from "@aws-sdk/client-s3"
import { env } from '../env'

// Criação a instância de conexão para o Cloudflare
export const r2 = new S3Client({ 
    region: 'auto',
    endpoint: env.CLOUDFLARE_ENDPOINT,
    credentials: {
        accessKeyId: env.CLOUDFLARE_ACESS_KEY_ID,
        secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY,
    },
})