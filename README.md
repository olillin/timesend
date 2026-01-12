# TimeSend

TimeSend is a website to send calendar events through a link.

## Usage

Below is an example function in TypeScript which creates a TimeSend URL from a [iamcal](https://https://www.npmjs.com/package/iamcal) calendar.

```typescript
/**
 * Upload a calendar to TimeSend and get the URL.
 * 
 * @returns the URL returned from TimeSend.
 */
export async function createUrl(calendar: Calendar, timeSendUrl: string = 'https://timesend.olillin.com'): Promise<string> {
    const uploadPath = '/api/upload'
    const requestUrl = timeSendUrl + uploadPath

    const body = calendar.serialize()

    const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/calendar'
        },
        body,
    })

    if (!response.ok) {
        throw new Error(`Something went wrong when trying to POST to ${requestUrl}`)
    }

    const responseBody = await response.json()
    const returnedUrl = responseBody.url

    return returnedUrl
}
```

## Hosting the server

TimeSend is free for anyone to self host, here is how:

1. Clone the repository

    ```console
    git clone <https://github.com/olillin/timesend>
    ```

2. Build the server

    ```console
    npm run build
    ```

3. Start the server

    ```console
    npm run start
    ```

### Configuration

The TimeSend server is configured using environment variables. To configure,
set the environment before starting the server or create a
[.env file](https://johncaleb.hashnode.dev/understanding-the-env-file) in the
root of the project (in the same folder as the file `package.json`).

Below are the available variables that can be configured:

| Name | Description                            | Type | Required | Default |
|------|----------------------------------------|------|----------|---------|
| PORT | Which port the server should listen on | int  | no       | 8080    |
