import {Application} from './Application';

Application.startup().catch(err => console.log(err));

process.once('SIGUSR2', () => {
  process.kill(process.pid, 'SIGUSR2');
});
