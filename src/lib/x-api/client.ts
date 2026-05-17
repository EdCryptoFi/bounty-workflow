export interface XUserInfo {
  data: {
    id: string;
    name: string;
    username: string;
    profile_image_url?: string;
  };
}

export interface TweetResponse {
  data: {
    id: string;
    text: string;
  };
}

export async function getXUserInfo(accessToken: string): Promise<XUserInfo> {
  const res = await fetch(
    "https://api.twitter.com/2/users/me?user.fields=profile_image_url",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Falha ao buscar usuário X: ${res.status} ${err}`);
  }
  return res.json();
}

export async function postTweet(
  accessToken: string,
  text: string,
): Promise<TweetResponse> {
  const res = await fetch("https://api.twitter.com/2/tweets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Falha ao publicar tweet: ${res.status} ${err}`);
  }
  return res.json();
}
