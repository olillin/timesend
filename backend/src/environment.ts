import { randomBytes } from "crypto"

export interface EnvironmentVariables {
    PORT?: number
    SECRET?: string
}

// Remove 'optional' attributes from a type's properties
export type Concrete<Type> = {
    [Property in keyof Type]-?: Type[Property]
}

export const DEFAULT_ENVIRONMENT: Concrete<EnvironmentVariables> = {
    PORT: 8080,
    SECRET: randomBytes(64).toString('base64')
}

export const ENVIRONMENT: Concrete<EnvironmentVariables> = Object.assign(Object.assign({}, DEFAULT_ENVIRONMENT), process.env as EnvironmentVariables)
