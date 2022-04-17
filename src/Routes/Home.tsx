import { useQuery } from 'react-query';
import styled from 'styled-components';
import { getMovies, IgetMoviesResult } from '../api';
import { makeImagePath } from '../utills';

function Home() {
  const { data, isLoading } = useQuery<IgetMoviesResult>(
    ['movies', 'nowPlaying'],
    getMovies
  );

  //
  return (
    <Cont>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || '')}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
        </>
      )}
    </Cont>
  );
}
export default Home;

const Title = styled.h2`
  font-size: 60px;
  margin-bottom: 20px;
`;
const Overview = styled.p`
  font-size: 25px;
  width: 60%;
`;

const Banner = styled.section<{ bgPhoto: string }>`
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(p) => p.bgPhoto});
  background-size: cover;
  color: ${(p) => p.theme.white.lighter};
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50px;
  color: ${(p) => p.theme.red};
`;

const Cont = styled.section``;
