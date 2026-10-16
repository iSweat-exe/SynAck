import * as migration_20261016_174801_initial from './20261016_174801_initial';
import * as migration_20261016_193601_sso_users from './20261016_193601_sso_users';

export const migrations = [
  {
    up: migration_20261016_174801_initial.up,
    down: migration_20261016_174801_initial.down,
    name: '20261016_174801_initial',
  },
  {
    up: migration_20261016_193601_sso_users.up,
    down: migration_20261016_193601_sso_users.down,
    name: '20261016_193601_sso_users'
  },
];
