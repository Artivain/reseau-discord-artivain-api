/**
 * API for Réseau Discord Artivain
 * @version 1.0.1
 * @author Thomas Fournier <thomas@artivain.com>
 */

// KV names:
// BLACKLIST
// SUSLIST
// SECRETS

// Environment variables
// DISCORD_WEBHOOK

const apiName = "Réseau Discord Artivain (official)";
const apiVersion = "1.0.1";
const headers = {
	"content-type": "application/json;charset=UTF-8",
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET",
};
const kvParameters = {
	type: "json",
	cacheTtl: 600 // 10 minutes
};

addEventListener("fetch", event => {
	event.respondWith(handleRequest(event.request));
});

/**
 * Handle the request to make an API response
 * @param {Request} request
 * @returns {Response}
 */
async function handleRequest(request) {
	const requestURL = new URL(request.url);
	if (requestURL.pathname.split("/")[1] != "v1") return new Response("{}", { status: 400, headers });
	const action = requestURL.pathname.split("/")[2];
	const parameters = requestURL.searchParams;
	let status = 200;
	const response = {
		dbName: apiName,
		apiVersion,
		action
	};

	if (action == "ping") {
		response.online = true;
		return new Response(JSON.stringify(response), { headers });
	}

	if (request.method != "GET") return new Response("{}", { status: 405, headers });

	if (action == "check" && parameters.has("id")) {
		const id = parameters.get("id").trim();
		response.id = id;
		if (isValidId(id)) {
			const sus = await SUSLIST.get(id, kvParameters);
			const bl = await BLACKLIST.get(id, kvParameters);

			if (sus) {
				response.suspect = {
					addedBy: sus.addedBy,
					since: sus.since
				};
			} else response.suspect = false;

			if (bl) {
				response.blacklist = {
					addedBy: bl.addedBy,
					since: bl.since
				};
			} else response.blacklist = false;
		} else status = 400;
	} else if (action == "add-suspect" && parameters.has("id") && parameters.has("username") && parameters.has("token")) {
		const id = parameters.get("id").trim(),
			username = parameters.get("username"),
			token = parameters.get("token");

		response.id = id;
		response.auth = {
			username,
			token: "hidden"
		};

		if (isValidId(id) && username && token) {
			const user = await SECRETS.get(username, kvParameters);
			if (user && user.token == token) {
				if (user.perms.includes("suslist") || user.perms.includes("suslist.add")) {
					const alreadySus = await SUSLIST.get(id, kvParameters);
					if (alreadySus) {
						response.added = false;
						response.suspect = {
							addedBy: alreadySus.addedBy,
							since: alreadySus.since
						};
					} else {
						const since = Date.now();
						const newSus = await SUSLIST.put(id, JSON.stringify({
							addedBy: username,
							since
						}));

						if (typeof newSus == "undefined") {
							response.added = true;
							response.suspect = {
								addedBy: username,
								since
							};
						} else status = 500;
					}
				} else status = 403;
			} else status = 401;
		} else status = 400;
	} else if (action == "remove-suspect" && parameters.has("id") && parameters.has("username") && parameters.has("token")) {
		const id = parameters.get("id").trim(),
			username = parameters.get("username"),
			token = parameters.get("token");

		response.id = id;
		response.auth = {
			username,
			token: "hidden"
		};

		if (isValidId(id) && username && token) {
			const user = await SECRETS.get(username, kvParameters);
			if (user && user.token == token) {
				if (user.perms.includes("suslist")) {
					const suslistEntry = await SUSLIST.get(id, kvParameters);
					if (suslistEntry) {
						const removedSuslistEntry = await SUSLIST.delete(id);
						if (typeof removedSuslistEntry == "undefined") {
							response.removed = true;
						} else status = 500;
					} else status = 404;
				} else status = 403;
			} else status = 401;
		} else status = 400;
	} else if (action == "add-blacklist" && parameters.has("id") && parameters.has("username") && parameters.has("token")) {
		const id = parameters.get("id").trim(),
			username = parameters.get("username"),
			token = parameters.get("token");

		response.id = id;
		response.auth = {
			username,
			token: "hidden"
		};

		if (isValidId(id) && username && token) {
			const user = await SECRETS.get(username, kvParameters);
			if (user && user.token == token) {
				if (user.perms.includes("blacklist") || user.perms.includes("blacklist.add")) {
					const alreadyBlacklisted = await BLACKLIST.get(id, kvParameters);
					if (alreadyBlacklisted) {
						response.added = false;
						response.blacklist = {
							addedBy: alreadyBlacklisted.addedBy,
							since: alreadyBlacklisted.since
						};
					} else {
						const since = Date.now();
						const newBlacklistEntry = await BLACKLIST.put(id, JSON.stringify({
							addedBy: username,
							since
						}));

						if (typeof newBlacklistEntry == "undefined") {
							response.added = true;
							response.blacklist = {
								addedBy: username,
								since
							};
						} else status = 500;
					}
				} else status = 403;
			} else status = 401;
		} else status = 400;
	} else if (action == "remove-blacklist" && parameters.has("id") && parameters.has("username") && parameters.has("token")) {
		const id = parameters.get("id").trim(),
			username = parameters.get("username"),
			token = parameters.get("token");

		response.id = id;
		response.auth = {
			username,
			token: "hidden"
		};

		if (isValidId(id) && username && token) {
			const user = await SECRETS.get(username, kvParameters);
			if (user && user.token == token) {
				if (user.perms.includes("blacklist")) {
					const blacklistEntry = await BLACKLIST.get(id, kvParameters);
					if (blacklistEntry) {
						const removedBlacklistEntry = await BLACKLIST.delete(id);
						if (typeof removedBlacklistEntry == "undefined") {
							response.removed = true;
						} else status = 500;
					} else status = 404;
				} else status = 403;
			} else status = 401;
		} else status = 400;
	} else {
		status = 400; // Bad request
	}

	response.status = status;
	return new Response(JSON.stringify(response), {
		status,
		headers
	});
};

/**
 * Check if a string is a valid Discord ID
 * @param {string} id - String to verify
 * @returns {boolean}
 */
function isValidId(id) {
	if (isNaN(id) || id.length < 18) return false;
	return true;
};