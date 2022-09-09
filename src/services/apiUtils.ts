import { API_URL } from 'config';
import { IPlayerProfile } from 'interfaces';

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
  try {
    const response = await fetchFromApi<IPlayerProfile[]>(
      '/players?nickname=' + nickname,
    );
    if (response.length === 0) {
      throw new Error(`Player [${nickname}] not found!`);
    }
    return response[0];
  } catch (e) {
    console.error('Error while fetching profile: ', e);
    return {
      id: 0,
      nickname: nickname,
      highscore: 0,
      electrons: 0,
    };
  }
};

const fetchLeaderboard = async (): Promise<IPlayerProfile[]> => {
  try {
    const response = await fetchFromApi<IPlayerProfile[]>(
      '/players?_sort=highscore&_order=desc&_limit=10',
    );
    return response;
  } catch (e) {
    console.error('Error while fetching leaderborad: ', e);
    return [];
  }
};

const putPlayerProfile = (player: IPlayerProfile): Promise<IPlayerProfile> => {
  let method: string;
  let route: string;

  if (player.id !== 0) {
    method = 'PUT';
    route = `/players/${player.id}`;
  } else {
    method = 'POST';
    route = `/players`;
  }

  return fetchFromApi<IPlayerProfile>(route, {
    method,
    body: JSON.stringify(player),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export { fetchFromApi, fetchPlayerProfile, fetchLeaderboard, putPlayerProfile };
