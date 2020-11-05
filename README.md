# API Project V2

# Project Requirements

- The API should be self documenting
  - Document new tables and fields on apiary
- The API should be to be generated dynamically
- The API should be able to run on an serverless archieture
- The API should support webhooks
- Bespoke logic should be injectable at any stage
- The API should provide metadata with all the tables and fields and their types

# Learning Requirements

- To be implemented with TDD in mind
- Improve understanding of the .vscode directory (Purpose? Benefits?)
- Medium Article on how to setup SonarQube for MacOS/Windows

# Local Development Setup

- Need to have a <b>local.settings.json</b> file in the following format
  ```json
  {
    "IsEncrypted": false,
    "Values": {
      "AzureWebJobsStorage": "UseDevelopmentStorage=true",
      "FUNCTIONS_WORKER_RUNTIME": "node",
      "FUNCTIONS_EXTENSION_VERSION": "~2",
      "WEBSITE_NODE_DEFAULT_VERSION": "10.14.1",
      "AzureMSSQLEndpoint": "[ENDPOINT]",
      "AzureMSSQLUser": "[USER]",
      "AzureMSSQLPassword": "[PASSWORD]",
      "AzureMSSQLDB": "[DB]",
      "SchemaDirectory": "[PATH_TO_PROJECT]/@api/src/assets/schema/"
    },
    "host": {
      "LocalHttpPort": 7071,
      "Cors": "*"
    }
  }
  ```

# TODOs

- [x] - Sanitize values
- [x] - Improve error handling
- [x] - Use Entity & Entity Field tables to generate schema and interfaces
- [x] - Use Entity Relationship tables to generate schema with foreign key relationships
- [ ] - Integrate with REDIS
- [x] - Be able to query data using $select, $filter
- [x] - Artiect a way to inject logic based on REQUEST
- [x] - Unit tests with 99%+ coverage
- [x] - Support composite primary keys
- [x] - Integrate Sonarqube into project
- [x] - Dynamic Class loading
  - [x] - Use a dictionary of object to class and then do new dictionary[entity]()

# Dev - TODOs

- [ ] - Get entity information before create/update/delete and pass it in
- [ ] - Split Generic into SQL|Cosmos entities; both should extend a base entity
- [ ] - Fix path issue such that at build it replaces with absolute path
- [ ] - Upgrade to latest TypeScript
- [ ] - Split generators into own folders; if tests; folder -> index + test or move tests into seperate folder
- [ ] - Make SQL Generator simpler; have select in a different generator
- [ ] - Create cosmos connection class
- [ ] - Refactor SQL connection class
- [ ] - Create static classes for things like application insights to just be used wherever
- [ ] - Update mixins with latest code from Lordly
- [ ] - Metadata should only generate interfaces when working locally or post content to an endpoint which will create it into a package and publish a new version
- [ ] - Support core vs non-core tables
- [ ] - Create method to get structure hash of database in SQL
- [ ] - Figure out which methods could be made static for reuse and reduce memory footprint
- [ ] - Cosmos based schema - Maybe?

# Notes

## API

- Composite primary keys are handled via hyphens
  - Updating the an composite entity; you would send a PATCH request to `https://api/v2/CompositeEntity/3-1` to update the entity with the first Id of 3 and second Id of 1

## SonarQube

## Pre-Requisites
