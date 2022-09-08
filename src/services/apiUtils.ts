import { API_URL } from 'config';
import { IPlayerProfile } from 'interfaces/IPlayerProfile';

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

const fetchPlayerProfile = async (
  nickname: string,
): Promise<IPlayerProfile> => {
  return fetchFromApi<IPlayerProfile>('/players?nickname=' + nickname);
};

const postPlayerProfile = (player: IPlayerProfile): void => {
  
};

export { fetchFromApi, fetchPlayerProfile };
