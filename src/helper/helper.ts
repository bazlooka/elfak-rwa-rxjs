import { API_URL } from 'config';

const fetchFromApi = async <T>(
  path: string,
  requestInit?: RequestInit,
): Promise<T> => {
  const res = await fetch(API_URL + path, requestInit);
  if (!res.ok) {
    throw new Error('An error occured while fetching: ' + res.status);
  }
  return res.json() as Promise<T>;
};

export { fetchFromApi };
