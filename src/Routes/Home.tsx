import { AnimatePresence, motion, useViewportScroll } from 'framer-motion';
import { url } from 'inspector';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { PathMatch, useMatch, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getMovies, IgetMoviesResult } from '../api';
import { makeImagePath } from '../utills';

//Animation
const rowVars = {
  hidden: {
    x: window.outerWidth + 7,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 7,
  },
};

const BoxVars = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: { delay: 0.2, type: 'tween' },
  },
};

const infoVars = {
  hover: {
    opacity: 1,
    transition: { delay: 0.2, type: 'tween' },
  },
};

//
const offset = 6; //movies you want to show in one time

function Home() {
  //scroll
  const { scrollY } = useViewportScroll();
  //router
  const history = useNavigate();
  const bigMovieMatch: PathMatch<string> | null = useMatch('/movies/:movieId');

  const { data, isLoading } = useQuery<IgetMoviesResult>(
    ['movies', 'nowPlaying'],
    getMovies
  );
  //Slider
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      //빠르게 슬라이더 두번누를때 간격없애기 코드
      const totalMovies = data.results.length - 1; //첫번째 row는 이미 쓰고있기 때문에 -1
      const maxIndex = Math.floor(totalMovies / offset);
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const onBoxClicked = (movieId: number) => {
    history(`/movies/${movieId}`);
  };
  const onOverlayClicked = () => {
    history(`/`);
  };
  //
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find(
      (movie) => movie.id + '' === bigMovieMatch.params.movieId
    );
  console.log(clickedMovie);
  return (
    <Cont>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bg={makeImagePath(data?.results[0].backdrop_path || '')}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <button onClick={increaseIndex}>INCREASE INDEX</button>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVars}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: 'tween', duration: 1 }}
                key={index}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ''}
                      onClick={() => onBoxClicked(movie.id)}
                      key={movie.id}
                      bg={makeImagePath(movie.backdrop_path || '')}
                      variants={BoxVars}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: 'tween' }}
                    >
                      <Info variants={infoVars} transition={{ type: 'tween' }}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClicked}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <BigMovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={bigMovieMatch.params.movieId}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top,black,transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title} </BigTitle>
                      <BigOverView>{clickedMovie.overview}</BigOverView>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Cont>
  );
}
export default Home;

//Components
const BigCover = styled.div`
  background-size: cover;
  background-position: center center;
  width: 100%;
  height: 500px;
`;

const BigOverView = styled.p`
  padding-left: 20px;
  color: ${(p) => p.theme.white.darker};
  top: -30px;
  position: relative;
`;

const BigTitle = styled.h3`
  top: -60px;
  padding-left: 20px;
  position: relative;
  color: ${(p) => p.theme.white.lighter};
  font-size: 30px;
`;

const BigMovie = styled(motion.div)`
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(p) => p.theme.black.lighter};
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
`;

const Overlay = styled(motion.div)`
  opacity: 0;
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
`;

const Info = styled(motion.div)`
  position: absolute;
  width: 100%;
  bottom: 0;
  opacity: 0;
  padding: 10px;
  background-color: ${(p) => p.theme.black.lighter};
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Box = styled(motion.div)<{ bg: string }>`
  cursor: pointer;
  background-image: url('${(p) => p.bg}');
  background-size: cover;
  background-position: center center;
  height: 200px;
  color: ${(p) => p.theme.white.darker};
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Row = styled(motion.div)`
  position: relative;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 7px;
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

const Banner = styled.section<{ bg: string }>`
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url('${(p) => p.bg}');
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
