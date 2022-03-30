/**
 * API for Réseau Discord Artivain
 * @version 1.0.0
 * @author Thomas Fournier <thomas@artivain.com>
 */

// KV names:
// BLACKLIST
// SUSLIST
// SECRETS

// Environment variables
// DISCORD_WEBHOOK

const apiVersion = "1.0.0";
const headers = {
	"content-type": "application/json;charset=UTF-8",
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET",
};
const kvParameters = {
	type: "json",
	cacheTtl: 600 // 10 minutes
};
const address = "https://api-rd.artivain.com/";

addEventListener("fetch", event => {
	event.respondWith(handleRequest(event.request));
});

/**
 * Handle the request to make an API response
 * @param {Request} request
 * @returns {Response}
 */
async function handleRequest(request) {
	if (request.method != "GET") return new Response("{}", { status: 405, headers });
	const requestURL = new URL(request.url);
	if (requestURL.pathname.split("/")[1] != "v1") return new Response("{}", { status: 400, headers });
	const action = requestURL.pathname.split("/")[2];
	const parameters = requestURL.searchParams;
	let status = 200;
	const response = {
		apiVersion,
		action
	};

	if (action == "check" && parameters.has("id")) {
		const id = parameters.get("id");
		response.id = id;
		if (isValidId(id)) {
			const sus = await SUSLIST.get(id, kvParameters);
			const bl = await BLACKLIST.get(id, kvParameters);

			if (sus) {
				response.suspect = {
					addedBy: sus.addedBy,
					since: sus.since
				};
			} else response.sus = false;

			if (bl) {
				response.blacklist = {
					addedBy: bl.addedBy,
					since: bl.since
				};
			} else response.blacklist = false;
		} else status = 400;
	} else if (action == "add-suspect" && parameters.has("id") && parameters.has("username") && parameters.has("token")) {
		const id = parameters.get("id"),
			username = parameters.get("username"),
			token = parameters.get("token");

		response.id = id;
		response.auth = {
			username,
			token: "hidden"
		};

		if (isValidId(id)) {
			const user = await SECRETS.get(username, kvParameters);
			if (user && user.token == token) {
				if (user.perms.includes("suslist") || user.perms.includes("suslist-add")) {
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