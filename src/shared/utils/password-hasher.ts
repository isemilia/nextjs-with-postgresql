import crypto from "crypto";

export const hashPassword = (password: string, salt: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        crypto.scrypt(password.normalize(), salt, 64, (error, hashed) => {
            if (error) {
                reject()
            }
            resolve(hashed.toString('hex').normalize())
        })
    })
}

export const generateSalt = () => {
    return crypto.randomBytes(16).toString('hex').normalize()
}

export const comparePasswords = async (
    password: string,
    salt: string,
    hashedPassword: string
) => {
    const hashedUserInput = await hashPassword(password, salt);

    return crypto.timingSafeEqual(
        Buffer.from(hashedUserInput, 'hex'),
        Buffer.from(hashedPassword, 'hex')
    );
}