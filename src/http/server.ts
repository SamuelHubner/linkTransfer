import { z } from 'zod'
import { env } from '../env'
import fastify from "fastify";
import { randomUUID } from 'crypto'
import { r2 } from '../lib/cloudflare'
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { PrismaClient } from '@prisma/client';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const server = fastify();
// Conexão com o banco de dados
const prisma = new PrismaClient();

server.post("/uploads", async (request) => {
  const uploadBodySchema = z.object({
    name: z.string().min(1),
    contentType: z.string().regex(/\w+\/[-+.\w]+/),
  })

  const { name, contentType } = uploadBodySchema.parse(request.body)

  // Evitar que caso o usuario suba dois arquivos com o mesmo nome, um sobrescreva o outro
  const fileKey = randomUUID().concat('-').concat(name)

  const signedUrl = await getSignedUrl(
    r2,
    new PutObjectCommand({
      Bucket: env.BUCKET_NAME,
      Key: fileKey,
      ContentType: contentType,
    }),
    { expiresIn: 600 },
  );

  // Salvar o arquivo no banco de dados
  const file = await prisma.file.create({
    data: {
      name,
      contentType,
      key: fileKey
    }
  })

  return { signedUrl, fileId: file.id };
});

server.get("/uploads/:id", async (request) => {
  const getFileParamsSchema = z.object({
    id: z.string().cuid(),
  })

  const { id } = getFileParamsSchema.parse(request.params)
  const file = await prisma.file.findUniqueOrThrow({
    where: {
      id 
    }
  })

  const signedUrl = await getSignedUrl(
    r2,
    new GetObjectCommand({
      Bucket: env.BUCKET_NAME,
      Key: file.key
    }),
    { expiresIn: 300 },
  );

  return { signedUrl };
});

server.listen({
    port: 3333,
    host: '0.0.0.0',
}).then(() => {
    console.log('👻 Server started');
});