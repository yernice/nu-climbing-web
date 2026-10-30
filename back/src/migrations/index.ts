import * as migration_20261020_111853_initial from './20261020_111853_initial';
import * as migration_20261030_084119_about_page from './20261030_084119_about_page';

export const migrations = [
  {
    up: migration_20261020_111853_initial.up,
    down: migration_20261020_111853_initial.down,
    name: '20261020_111853_initial',
  },
  {
    up: migration_20261030_084119_about_page.up,
    down: migration_20261030_084119_about_page.down,
    name: '20261030_084119_about_page'
  },
];
