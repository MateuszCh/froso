import froso from './';
import { IFrosoConfig } from './Froso';

const config: IFrosoConfig = {
    mongoDb: 'geosilesia',
    mongoOptions: { useNewUrlParser: true },
    mongoURI: 'mongodb://localhost/',
    port: 3000,
};

froso.init(config).then(() => {
    console.log(`Froso listening on port ${config.port}`);
});
