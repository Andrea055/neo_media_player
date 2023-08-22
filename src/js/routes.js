
import HomePage from '../pages/home.svelte';
import PlayerPage from '../pages/player.svelte';
import GroupsPage from '../pages/groups.svelte';
// import MediaPlayerPage from '../pages/media_player.svelte';
import NotFoundPage from '../pages/404.svelte';

var routes = [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/player',
    component: PlayerPage
  },
  {
    path: '/groups',
    component: GroupsPage
  },
  // {
  //   path: '/media_player/',
  //   component: MediaPlayerPage
  // },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;
