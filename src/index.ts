import {createApp} from './app';
import config from './config/config';
import {ErrorHandler} from "./middleware/errorHandler";

process.on('uncaughtException', e => {
    ErrorHandler.captureException(e);
    process.exit(1);
});

process.on('unhandledRejection', e => {
    ErrorHandler.captureException(new Error("unhandledRejection " + e));
    process.exit(1);
});

createApp(config).then(server => {
    server.listen(config.port, () =>
        ErrorHandler.captureMessage(`Listening on port ${config.port}...`),
    );
});

