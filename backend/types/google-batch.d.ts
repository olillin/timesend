declare module 'google-batch' {
    import type { OAuth2Client } from "google-auth-library"
    import type { GaxiosPromise } from "gaxios"

    interface GoogleBatchInstance {
        setAuth: (auth: OAuth2Client) => this
        clear: () => this
        add: (calls: GaxiosPromise<any> | GaxiosPromise<any>[]) => this
        exec: <T>(callback: (error: Error | null, responses: any | null, errors: null | string[]) => T) => T
    }

    interface GoogleBatchConstructor {
        new(): GoogleBatchInstance
        require(moduleName: string): any
    }

    declare const GoogleBatch: GoogleBatchConstructor
    export default GoogleBatch
}