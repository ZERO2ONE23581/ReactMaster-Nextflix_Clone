import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { getMovies, IgetMoviesResult } from '../api';
import { makeImagePath } from '../utills';

const rowVars = {
  hidden: {
    x: window.outerWidth,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth,
  },
};

function Home() {
  const { data, isLoading } = useQuery<IgetMoviesResult>(
    ['movies', 'nowPlaying'],
    getMovies
  );
  //Slider
  const [index, setIndex] = useState(0);
  const increaseIndex = () => {
    setIndex((prev) => prev + 1);
  };
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
          <button onClick={increaseIndex}>INCREASE INDEX</button>
          <Slider>
            <AnimatePresence>
              <Row
                variants={rowVars}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: 'tween', duration: 1 }}
                key={index}
              >
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Box key={i}>{i}</Box>
                ))}
              </Row>
            </AnimatePresence>
          </Slider>
        </>
      )}
    </Cont>
  );
}
export default Home;
const Box = styled(motion.div)`
  position: relative;
  //
  background-color: white;
  height: 200px;
  font-size: 60px;
  color: red;
`;

const Row = styled(motion.div)`
  position: absolute;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
`;

const Slider = styled.div`
  top: -100px;
`;

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
