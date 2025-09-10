import { AUTH_URLS } from '@/constants';

export async function login(userName: string, password: string) {
  const res = await fetch(AUTH_URLS.LOGIN, {
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
