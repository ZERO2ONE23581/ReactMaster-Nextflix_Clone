import { useQuery } from 'react-query';
import styled from 'styled-components';
import { getMovies } from '../api';

function Home() {
  const { data, isLoading } = useQuery(['movies', 'nowPlaying'], getMovies);
  console.log(data, isLoading);

  //
  return (
    <Cont>
      <h1>Home</h1>
    </Cont>
  );
}
export default Home;

const Cont = styled.section`
  background-color: ${(props) => props.theme.white.darker};
  height: 200vh;
`;
