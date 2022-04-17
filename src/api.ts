// const API_KEY = process.env.API_KEY;
const API_KEY = '2807dd1eae5159e09bddd2e2c2c9aa43';
const BASE_PATH = 'https://api.themoviedb.org/3';

export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (res) => res.json()
  );
}
