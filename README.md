# Uploader

Allows to upload files to the server.

All types of files can be uploaded, so it may be dangerous to leave a port open for a long time or in an open network.

## Usage in command line

`index.js [OPTIONS] ACTION`

### Options:

`--port`, `-p`: port where the server listens (default: 3004)

`--upload-folder`, `-u`: folder where the uploaded files are stored (fault: Downloads)

`--max-file-size`: maximum size in bytes of files that can be uploaded. Can also be written with format "1k", "1m"...

### Actions

`npm start` : Start server with no options

`npm run build` : Build Javascript bundle

`npm test` : Run unit tests
