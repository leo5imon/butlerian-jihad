# Butlerian Jihad

### Data protocol for authentificating real human creation, connected to a DataDAO for private model training.

## Introduction

The Butlerian Jihad is the term used for the crusades against the machines - AI - in the Dune universe. We've been bombed from AI Generated content in the past years, and it looks like there are only two solutions against that : you either consider the content before Gen AI the only one worth something - or you try to give artists a way to create fair models based on their works.

## Features

- TLS Notary extension focused on Instagram account retrieval.
- DataDAO for private model training.

## Preview

![Preview](https://imgur.com/a/MDdo69t)

## Installation

```
git clone https://github.com/butlerianjihad/butlerian_jihad.git
cd butlerian_jihad
npm install
npm run dev
```

Add your Lighthouse API key by copying the .env.example.

Build the Instagram plugin:

```sh
npm i
npm run build
```

This will output the wasm binary in `dist/index.wasm`.

### Running the Instagram Plugin Example

1. Build the `instagram_profile` plugin as explained above.
2. Build and install the `tlsn-extension` as documented in the [main README.md](../README.md).
3. [Run a local notary server](https://github.com/tlsnotary/tlsn/blob/main/notary-server/README.md), ensuring `TLS` is disabled in the [config file](https://github.com/tlsnotary/tlsn/blob/main/notary-server/config/config.yaml#L18).
4. Install the plugin: Click the **Add a Plugin (+)** button and select the `index.wasm` file you built in step 1. A **Instagram Profile** button should then appear below the default buttons.
5. Click the **Instagram Profile** button. This action opens the Instagram webpage along with a TLSNotary sidebar.
6. Follow the steps in the TLSNotary sidebar.
7. Access the TLSNotary results by clicking the **History** button in the TLSNotary extension.

## Contribution

_Contributions are welcome!_
If you would like to contribute to Magi, please follow these steps:

- Fork the repository.
- Create a new branch for your feature or bug fix.
- Make your changes and commit them.
- Push your changes to your forked repository.
- Submit a pull request to the main repository.