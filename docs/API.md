# API Documentation

The PoC Demo API provides RESTful access to the data stored in the PoC Demo.

There is currently no authentication or authorization.

## Entities

### Organization

#### `GET` `/organizations/`

Returns a list of all organizations.

#### `POST` `/organizations/`

Creates a new organization object.

#### `GET` `/organizations/{EIN}`

Returns a single organization.

#### `POST` `/organizations/{EIN}`

Updates an existing organization object.

### Proposals

#### `GET` `/proposals/`

Returns a list of all proposals.

Can optionally accept a `s` query parameter which defines a search term.

#### `POST` `/proposals/`

Creates a new proposal object.

#### `GET` `/proposals/{ID}`

Returns a single proposal.

#### `POST` `/proposals/{ID}`

Updates an existing proposal object.

