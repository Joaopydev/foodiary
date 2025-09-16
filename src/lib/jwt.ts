import { JwtPayload, sign, verify } from "jsonwebtoken"

export function signAcessTokenFor(userId: string) {
    const accessToken = sign(
        { sub: userId }, 
        process.env.JWT_SECRET_KEY!,
        { expiresIn: '3d' }
    )

    return accessToken
}

export function validateAccessToken(token: string) {
    try {
        /* always return JwtPayload */
        const { sub } = verify(token, process.env.JWT_SECRET_KEY!) as JwtPayload

        return sub ?? null
    } catch {
        return null
    }
}