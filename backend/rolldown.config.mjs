import { defineConfig } from 'rolldown'

export default defineConfig({
    input: 'dist/backend/src/app.js',
    tsconfig: 'backend/tsconfig.json',
    platform: 'node',
    output: {
        dir: 'bundle',
    },
})
