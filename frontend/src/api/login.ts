export async function loginFetcher(url: string, { arg }: { arg: { email: string; password: string } }) {
  const res = await fetch(url, {
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
