import { API_BASE } from "@/constants/api.ts";

export async function loginFetcher(
	_: string,
	{ arg }: { arg: { email: string; password: string } },
) {
	const res = await fetch(`${API_BASE}/auth/sign_in`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(arg),
	});
	if (!res.ok) {
		throw new Error("Login failed");
	}

	const uid = res.headers.get("uid");
	const client = res.headers.get("client");
	const accessToken = res.headers.get("access-token");

	if (!uid || !client || !accessToken) {
		throw new Error("Invalid response");
	}

	return { uid, client, accessToken };
}
