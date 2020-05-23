import {createApp} from './app';
import config from './config/config';

process.on('uncaughtException', e => {
    console.log(e);
    process.exit(1);
});

process.on('unhandledRejection', e => {
    console.log(e);
    process.exit(1);
});

createApp(config).then(server => {
    server.listen(config.port, () =>
        console.log(`Listening on port ${config.port}...`),
    );
});

