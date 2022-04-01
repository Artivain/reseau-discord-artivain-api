# How to use

## How to use the API
**Base URL: https://api-rd.artivain.com/v1**

Some endpoints are public and so do not require a token. This way, everyone can use the API on their bot, website or anywhere else. This can also bring high load on the server if people abuse the API. To make the API stay open like this, please avoid spamming it.

All endpoints only accept the GET method. The only exception is the `/ping` endpoint, which allows all methods.

### Example request
`GET https://api-rd.artivain.com/v1/check?id=382869186042658818`

### Example response
```json
{
	"dbName": "Réseau Discord Artivain (official)",
	"apiVersion": "1.0.0",
	"action": "check",
	"id": "382869186042658818",
	"suspect": false,
	"blacklist": false,
	"status": 200
}
```

## Endpoints
| Endpoint | Is public ? | Permission required | Parameter(s) |
| --- | --- | --- | --- |
| [`/ping`](#ping) | ✅ | *none* | *none* |
| [`/check`](#check) | ✅ | *none* | `id` |
| [`/add-suspect`](#add-suspect) |  | suslist.add | `id`, `username`, `token` |
| [`/remove-suspect`](#remove-suspect) |  | suslist | `id`, `username`, `token` |
| [`/add-blacklist`](#add-blacklist) |  | blacklist.add | `id`, `username`, `token` |
| [`/remove-blacklist`](#remove-blacklist) |  | blacklist | `id`, `username`, `token` |

### /ping
This simple endpoint is useful for checking if the API is working.
If the API is online, it will always respond with `200 OK`.

**Example response:**
```json
{
	"dbName": "Réseau Discord Artivain (official)",
	"apiVersion": "1.0.0",
	"action": "ping",
	"online": true
}
```

### /check
| Parameter | Description |
| --- | --- |
| `id` | The Discord ID of the user to check |

Main endpoint of the API, allow to check suspect and blacklist status of a user. 

**Example request:**
<br>
`GET /check?id=382869186042658818`

**Example response:**
```json
{
	"dbName": "Réseau Discord Artivain (official)",
	"apiVersion": "1.0.0",
	"action": "check",
	"id": "382869186042658818",
	"suspect": {
		"addedBy": "Artivain",
		"since": 1648773144257
	},
	"blacklist": false,
	"status": 200
}
```

| Key | Description | Type |
| --- | --- | --- |
| `suspect`, `blacklist` | If the user is on the list see below for properties, else it is false. | boolean or object |
| `suspect.addedBy`, `blacklist.addedBy` | Username that added the user to the list. | string |
| `suspect.since`, `blacklist.since` | When the user was added to the list. | number |

### /add-suspect
| Parameter | Description |
| --- | --- |
| `id` | The Discord ID of the user to add to the suspect list |
| `username` | Your username |
| `token` | Your token to access the API |

**Required permission:** `suslist.add`

Add a user to the suspect list.

**Example request:**
<br>
`GET /add-suspect?id=382869186042658818&username=Artivain&token=abcdef123456`

**Example response:**
```json
{
	"dbName": "Réseau Discord Artivain (official)",
	"apiVersion": "1.0.0",
	"action": "add-suspect",
	"id": "382869186042658818",
	"auth": {
		"username": "Artivain",
		"token": "hidden"
	},
	"added": true,
	"suspect": {
		"addedBy": "Artivain",
		"since": 1648773144257
	},
	"status": 200
}
```

| Key | Description | Type |
| --- | --- | --- |
| `auth` | Confirmation of which user you logged in with | object |
| `added` | If the user has been added or not. | boolean |
| `suspect.addedBy` | Username that added the user to the list. | string |
| `suspect.since` | When the user was added to the list. | number |

### /remove-suspect
| Parameter | Description |
| --- | --- |
| `id` | The Discord ID of the user to remove from the suspect list |
| `username` | Your username |
| `token` | Your token to access the API |

**Required permission:** `suslist`

Remove a user from the suspect list.

**Example request:**
<br>
`GET /remove-suspect?id=382869186042658818&username=Artivain&token=abcdef123456`

**Example response:**
```json
{
	"dbName": "Réseau Discord Artivain (official)",
	"apiVersion": "1.0.0",
	"action": "remove-suspect",
	"id": "382869186042658818",
	"auth": {
		"username": "Artivain",
		"token": "hidden"
	},
	"removed": true,
	"status": 200
}
```

| Key | Description | Type |
| --- | --- | --- |
| `auth` | Confirmation of which user you logged in with | object |
| `removed` | If the user has been removed or not. | boolean |

### /add-blacklist
| Parameter | Description |
| --- | --- |
| `id` | The Discord ID of the user to add to the blacklist |
| `username` | Your username |
| `token` | Your token to access the API |

**Required permission:** `blacklist.add`

Add a user to the blacklist.

**Example request:**
<br>
`GET /add-blacklist?id=382869186042658818&username=Artivain&token=abcdef123456`

**Example response:**
```json
{
	"dbName": "Réseau Discord Artivain (official)",
	"apiVersion": "1.0.0",
	"action": "add-blacklist",
	"id": "382869186042658818",
	"auth": {
		"username": "Artivain",
		"token": "hidden"
	},
	"added": true,
	"blacklist": {
		"addedBy": "Artivain",
		"since": 1648773144257
	},
	"status": 200
}
```

| Key | Description | Type |
| --- | --- | --- |
| `auth` | Confirmation of which user you logged in with | object |
| `added` | If the user has been added or not. | boolean |
| `blacklist.addedBy` | Username that added the user to the list. | string |
| `blacklist.since` | When the user was added to the list. | number |

### /remove-blacklist
| Parameter | Description |
| --- | --- |
| `id` | The Discord ID of the user to remove from the blacklist |
| `username` | Your username |
| `token` | Your token to access the API |

**Required permission:** `blacklist`

Remove a user from the blacklist.

**Example request:**
<br>
`GET /remove-blacklist?id=382869186042658818&username=Artivain&token=abcdef123456`

**Example response:**
```json
{
	"dbName": "Réseau Discord Artivain (official)",
	"apiVersion": "1.0.0",
	"action": "remove-blacklist",
	"id": "382869186042658818",
	"auth": {
		"username": "Artivain",
		"token": "hidden"
	},
	"removed": true,
	"status": 200
}
```

| Key | Description | Type |
| --- | --- | --- |
| `auth` | Confirmation of which user you logged in with | object |
| `removed` | If the user has been removed or not. | boolean |