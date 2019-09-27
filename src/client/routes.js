import HomePage from './pages/home.vue';
import BingoPage from './pages/bingo.vue';
import PuzzlePage from './pages/puzzle.vue';

export default [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/puzzle/',
    component: PuzzlePage,
  },
  {
    path: '/bingo/',
    component: BingoPage,
  },
  {
    path: '(.*)',
    component: HomePage,
  },
];
