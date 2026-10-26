import fastify from 'fastify'
import { env } from "./shared/env/environments.js"
import { connection } from "./config/database.js"

import { randomUUID } from 'node:crypto'
const app = fastify()

app.get('/users', async (request, reply) => {
    const users = await connection('users').select('*')
    return users
})

app.post('/users', async (request, reply) => {
    const { name, email, password } = request.body as
        {
            name: string,
            email: string,
            password: string
        }
    const user = { id: randomUUID(), name, email, password }
    await connection('users').insert(user)
    return reply.status(201).send(user)
})

app.get('/users/:id', async (request, reply) => {     
    const { id } = request.params as { id: string }     
    const user = await connection('users').where({ id }).first()
    if (!user) {         return reply.status(404).send({ message: 'Usuário não encontrado' })     
    }     
    return user 
})

app.put('/users/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const { name, email, password } = request.body as { name: string, email: string, password: string }

    const updated = await connection('users').where({ id }).update({ name, email, password })

    if (updated === 0) {
        return reply.status(404).send({ message: 'Usuário não encontrado' })
    }

    const user = await connection('users').where({ id }).first()
    return user
})

app.delete('/users/:id', async (request, reply) => {
    const { id } = request.params as { id: string }

    const deleted = await connection('users').where({ id }).delete()

    if (deleted === 0) {
        return reply.status(404).send({ message: 'Usuário não encontrado' })
    }

    return reply.status(204).send()
})

app.listen({ port: env.PORT }).then(() => {
    console.log(env)
    console.log('Rodando na porta:' + process.env.PORT)
})