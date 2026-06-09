import { API_BASE_URL } from "./apiConfig";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function wakeUpApi(
  maxTentativas = 25,
  intervaloMs = 5000,
): Promise<boolean> {
  for (let i = 0; i < maxTentativas; i++) {
    try {
      const response = await fetch(`${API_BASE_URL}/tours`);

      if (response.status === 200 || response.status === 401) {
        return true;
      }
    } catch {}

    await delay(intervaloMs);
  }

  return false;
}
