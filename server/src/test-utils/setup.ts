import {createTestDBConnection} from './createTestDBConnection';

// eslint-disable-next-line no-process-exit
createTestDBConnection(true).then(() => process.exit());
