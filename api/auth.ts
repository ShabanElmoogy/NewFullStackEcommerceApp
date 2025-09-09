const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function login(userName: string, password: string) {
  const res = await fetch(`${API_URL}/api/v1/Auth/Login`, {
    method: 'POST',
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userName,
      password
    })
  });

  const data = await res.json();

  // optional: handle response
  if (!res.ok) {
    throw new Error(`Login failed: ${res.status}`);
  }

  return data; // return parsed response
}
