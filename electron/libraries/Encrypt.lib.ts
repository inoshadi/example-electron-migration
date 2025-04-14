import crypto from 'node:crypto'

// reference: https://stackoverflow.com/a/6953606
export default class EncryptLib {
    public ivsep: string = ':'
    protected algorithm: string = 'aes-256-cbc'

    protected scryptSync = (key: string, salt: string) => {
        return crypto.scryptSync(key, salt, 32)
    }

    protected generateIv = () => {
        return crypto.randomBytes(16)
    }
    /**
     * [ivhex, text]
     */
    protected parseText = (text: string): any => {
        return text.split(this.ivsep)
    }

    protected getCipher = (keySynced: any, iv: any) => {
        return crypto.createCipheriv(this.algorithm, keySynced, iv)
    }

    protected getDecipher = (keySynced: any, iv: any) => {
        return crypto.createDecipheriv(this.algorithm, keySynced, iv)
    }

    public encrypt = (text: string, key: string): string => {
        const iv = this.generateIv()
        const ivhex = iv.toString('hex')
        let result: string = ivhex + this.ivsep
        const keySynced = this.scryptSync(key, ivhex)
        const cipher = this.getCipher(keySynced, iv)
        const encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex')
        return result + encrypted
    }

    public decrypt = (encrypted: string, key: string) => {
        const [ivhex, text] = this.parseText(encrypted)
        const iv = Buffer.from(ivhex, 'hex')
        const keySynced = this.scryptSync(key, ivhex)
        const decipher = this.getDecipher(keySynced, iv)
        return decipher.update(text, 'hex', 'utf8') + decipher.final('utf8')
    }
}