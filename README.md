# OpenDEX UI

A graphical user interface for interacting with an [opendex-docker](https://github.com/opendexnetwork/opendex-docker) environment.

## Development

### Requirements

- Node v12.1.0+
- Yarn

### Install dependencies

`yarn`

### Start in development mode

- Make a copy of `.env.example` and name it `.env`.
- Set a value for `REACT_APP_API_URL` to match with the url you have an [opendex-docker-api](https://github.com/opendexnetwork/opendex-docker-api) accessible.
- `yarn start`
- If the connection between the UI and [opendex-docker-api](https://github.com/opendexnetwork/opendex-docker-api) cannot be established, try navigating to the `REACT_APP_API_URL` via the browser and accepting its certificate.

### Tests

`yarn test`

### Lint

`yarn lint`
