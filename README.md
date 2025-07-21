# TimeSend

TimeSend is a website to send calendar events through a link.

## Usage

*W.I.P.*

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
