import * as migration_20261016_174801_initial from './20261016_174801_initial';

export const migrations = [
  {
    up: migration_20261016_174801_initial.up,
    down: migration_20261016_174801_initial.down,
    name: '20261016_174801_initial'
  },
];
