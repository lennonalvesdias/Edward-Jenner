import { Address, List, Map, Phones, Profile, UserProfile } from '../../../pages';
import { resolveAddresses, resolveList, resolvePhones } from './resolvers';
import { userIsLogged } from './guards';

const routes = [
  {
    path: '',
    page: List,
    resolve: resolveList,
    guard: userIsLogged,
  },
  {
    path: 'list',
    page: List,
    resolve: resolveList,
    guard: userIsLogged,
  },
  {
    path: 'profile',
    page: Profile,
    guard: userIsLogged,
  },
  {
    path: 'map',
    page: Map,
    guard: userIsLogged,
  },
  {
    path: 'profile-user',
    page: UserProfile,
    guard: userIsLogged,
  },
  {
    path: 'profile-phones',
    page: Phones,
    resolve: resolvePhones,
    guard: userIsLogged,
  },
  {
    path: 'profile-address',
    page: Address,
    resolve: resolveAddresses,
    guard: userIsLogged,
  },
  {
    path: '**',
    page: 'index.html#login',
  },
];

export { routes };
