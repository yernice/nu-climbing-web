import * as migration_20261020_111853_initial from './20261020_111853_initial';

export const migrations = [
  {
    up: migration_20261020_111853_initial.up,
    down: migration_20261020_111853_initial.down,
    name: '20261020_111853_initial'
  },
];
