import { hash, Options, verify } from "argon2";


const opts: Options = {
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
    version: 0x13,
    type: 1, 


}


export async function  hashPassword(password: string) {
    const result = await hash(password, opts);
    return result;
}
 

export async function verifyPassword(data :{hash: string, password: string}) {
    const { hash, password } = data;
    const result = await verify(hash, password);
    return result;
 }
 