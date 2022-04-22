# Comment utiliser

## Comment utiliser l'API
**URL de base: https://api-rd.artivain.com/v1**

Certains endpoints sont publics et ne requirent pas de token. De cette manière, tout le monde peut utiliser l'API sur leur bot, site Web ou n'importe où. Ça peut aussi apporter une grande charge sur le serveur si les utilisateurs abusent de l'API. Pour nous aider à garder l'API public, merci d'éviter de le spam.

All endpoints only accept the GET method. The only exception is the `/ping` endpoint, which allows all methods.

Tous les endpoints n'acceptent que la méthode GET. La seule exception est `/ping`, qui accepte toutes les méthodes.

### Exemple de requête
`GET https://api-rd.artivain.com/v1/check?id=382869186042658818`

### Exemple de réponse
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
| Endpoint | Est public ? | Permission requise | Paramètre(s) |
| --- | --- | --- | --- |
| [`/ping`](#ping) | ✅ | *aucune* | *aucun* |
| [`/check`](#check) | ✅ | *aucune* | `id` |
| [`/add-suspect`](#add-suspect) |  | suslist.add | `id`, `username`, `token` |
| [`/remove-suspect`](#remove-suspect) |  | suslist | `id`, `username`, `token` |
| [`/add-blacklist`](#add-blacklist) |  | blacklist.add | `id`, `username`, `token` |
| [`/remove-blacklist`](#remove-blacklist) |  | blacklist | `id`, `username`, `token` |

### /ping
Ce enpoint simple est utile pour vérifier si l'API est fonctionnel.
S'il l'est, la réponse sera toujours `200 OK`.

**Exemple de réponse:**
```json
{
	"dbName": "Réseau Discord Artivain (official)",
	"apiVersion": "1.0.0",
	"action": "ping",
	"online": true
}
```

### /check
| Paramètre | Description |
| --- | --- |
| `id` | Le ID Discord de l'utilisateur à vérifier |

Enpoint principal de l'API, permet de vérifier si un utilisateur est sur une liste.

**Exemple de requête:**
<br>
`GET /check?id=382869186042658818`

**Exemple de réponse:**
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

| Nom | Description | Type |
| --- | --- | --- |
| `suspect`, `blacklist` | Si l'utilisateur est sur la liste, voir ci-dessous pour les propriétés, sinon est `false`. | boolean ou object |
| `suspect.addedBy`, `blacklist.addedBy` | Utilisateur qui a ajouté le ID sur la liste | string |
| `suspect.since`, `blacklist.since` | Quand le ID a été ajouté sur la liste. | number |

### /add-suspect
| Paramètre | Description |
| --- | --- |
| `id` | Le ID Discord de l'utilisateur à ajouter à la liste |
| `username` | Votre nom d'utilisateur |
| `token` | Votre token d'accès à l'API |

**Permission requise:** `suslist.add`

Ajouter un utilisateur à la liste des suspects.

**Exemple de requête:**
<br>
`GET /add-suspect?id=382869186042658818&username=Artivain&token=abcdef123456`

**Exemple de réponse:**
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

| Nom | Description | Type |
| --- | --- | --- |
| `auth` | Confirmation de l'utilisateur avec qui vous avez fait la requête. | object |
| `added` | Si l'utilisateur a été ajouté. | boolean |
| `suspect.addedBy` | Utilisateur qui a ajouté le ID à la liste. | string |
| `suspect.since` | Quand le ID a été ajouté à la liste. | number |

### /remove-suspect
| Paramètre | Description |
| --- | --- |
| `id` | Le ID Discord à retirer de la liste des suspects |
| `username` | Votre nom d'utilisateur |
| `token` | Votre token d'accès à l'API |

**Permission requise:** `suslist`

Retire un utilisateur de la liste des suspects.

**Exemple de requête:**
<br>
`GET /remove-suspect?id=382869186042658818&username=Artivain&token=abcdef123456`

**Exemple de réponse:**
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

| Nom | Description | Type |
| --- | --- | --- |
| `auth` | Confirmation de l'utilisateur avec qui vous avez fait la requête. | object |
| `removed` | Si l'utilisateur a été retiré ou non. | boolean |

### /add-blacklist
| Paramètre | Description |
| --- | --- |
| `id` | ID Discord à ajouter à la blacklist |
| `username` | Votre nom d'utilisateur |
| `token` | Votre token d'accès à l'API |

**Permission requise:** `blacklist.add`

Ajoute un utilisateur à la blacklist.

**Exemple de requête:**
<br>
`GET /add-blacklist?id=382869186042658818&username=Artivain&token=abcdef123456`

**Exemple de réponse:**
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

| Nom | Description | Type |
| --- | --- | --- |
| `auth` | Confirmation de l'utilisateur avec qui vous avez fait la requête. | object |
| `added` | Si le ID a été ajouté ou non. | boolean |
| `blacklist.addedBy` | Utilisateur qui a ajouté le ID à la liste. | string |
| `blacklist.since` | Quand le ID a été ajouté à la liste. | number |

### /remove-blacklist
| Paramètre | Description |
| --- | --- |
| `id` | Le ID Discord à retirer de la blacklist |
| `username` | Votre nom d'utilisateur |
| `token` | Votre token d'accès à l'API |

**Permission requise:** `blacklist`

Retire un utilisateur de la blacklist.

**Exemple de requête:**
<br>
`GET /remove-blacklist?id=382869186042658818&username=Artivain&token=abcdef123456`

**Exemple de réponse:**
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

| Nom | Description | Type |
| --- | --- | --- |
| `auth` | Confirmation de l'utilisateur avec qui vous avez fait la requête. | object |
| `removed` | Si l'utilisateur a été retiré ou non. | boolean |