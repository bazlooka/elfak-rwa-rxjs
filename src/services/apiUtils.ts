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
  console.log('FETCHING', nickname);

  try {
    const response = await fetchFromApi<IPlayerProfile[]>(
      '/players?nickname=' + nickname,
    );
    if (response.length === 0) {
      throw new Error(`Player [${nickname}] not found!`);
    }
    console.log('FETCH', response[0]);

    return response[0];
  } catch (e) {
    console.error('Error fetching profile: ' + e);
    return {
      id: 0,
      nickname: nickname,
      highscore: 0,
      electrons: 0,
    };
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

  console.log(method, route, player);

  return fetchFromApi<IPlayerProfile>(route, {
    method,
    body: JSON.stringify(player),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export { fetchFromApi, fetchPlayerProfile, putPlayerProfile };
