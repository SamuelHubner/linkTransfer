// Arquivo para definir o schema de validação do arquivo .env, para que possamos garantir que as variáveis de ambiente estão corretas.
import { z } from 'zod'

const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    CLOUDFLARE_ENDPOINT: z.string().url(),
    CLOUDFLARE_ACESS_KEY_ID: z.string(),
    CLOUDFLARE_SECRET_ACCESS_KEY: z.string(),
    BUCKET_NAME: z.string()
})

export const env = envSchema.parse(process.env)