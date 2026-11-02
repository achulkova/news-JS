import Loader from './loader';

const defaultApiUrl = 'https://rss-news-api.onrender.com/mocks';

class AppLoader extends Loader {
    public constructor() {
        const configuredApiUrl = process.env.API_URL;
        const apiUrl = configuredApiUrl && configuredApiUrl !== 'MISSING_ENV_VAR' ? configuredApiUrl : defaultApiUrl;
        super(apiUrl, {});
    }
}

export default AppLoader;
