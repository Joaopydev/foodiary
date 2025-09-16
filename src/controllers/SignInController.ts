import { z } from "zod";
import { compare } from "bcryptjs";

import { HttpRequest, HttpResponse } from "../types/Http";
import { badRequest, ok, unauthorized } from "../utils/http";
import { eq } from "drizzle-orm";
import { usersTable } from "../db/schema";
import { db } from "../db";
import { signAcessTokenFor } from "../lib/jwt";

const schema = z.object({
    email: z.email(),
    password: z.string().min(8),
})

export class SignInController {
    static async handle({ body }: HttpRequest): Promise<HttpResponse> {
        const { success, error, data } = schema.safeParse(body)

        if (!success) {
            return badRequest({ errors: error.issues })
        }

        const user = await db.query.usersTable.findFirst({
            columns: {
                id: true,
                email: true,
                password: true,
            },
            where: eq(usersTable.email, data.email)
        })

        if (!user) {
            return unauthorized({ error: "Invalid credentials." })
        }

        const isValidPassword = await compare(data.password, user.password)

        if (!isValidPassword) {
            return unauthorized({ error: "Invalid credentials." })
        }

        const accessToken = signAcessTokenFor(user.id)

        return ok({ accessToken })
    }
}