import Home from './Home/Home';
import DetailedPost from './DetailedPost/DetailedPost';
import UserProfile from './UserProfile/UserProfile';
import NotFound from './NotFound/NotFound';
import PostVotes from './PostVotes/PostVotes';
import SearchResults from './SearchResults/SearchResults';
import NewDeal from './NewDeal/NewDeal';
import EditPost from './EditPost/EditPost';

const routes = [
  {
    path: '/',
    component: Home,
    exact: true,
    protected: false
  },
  {
    path: '/users/:username',
    component: UserProfile,
    exact: true,
    protected: false
  },
  {
    path: '/posts/search',
    component: SearchResults,
    exact: true,
    protected: false
  },
  {
    path: '/posts/submit',
    component: NewDeal,
    exact: true,
    protected: true
  },
  {
    path: '/posts/:id',
    component: DetailedPost,
    exact: true,
    protected: false
  },
  {
    path: '/posts/:id/edit',
    component: EditPost,
    exact: true,
    protected: true
  },
  {
    path: '/posts/:id/votes',
    component: PostVotes,
    exact: true,
    protected: true
  },
  {
    path: '*',
    component: NotFound,
    exact: true,
    protected: false
  },
];

export default routes;