import Loader from './loader';

const defaultApiUrl = 'https://rss-news-api.onrender.com';

class AppLoader extends Loader {
    public constructor() {
        super(process.env.API_URL || defaultApiUrl, {
            apiKey: process.env.API_KEY || '',
        });
    }
}

export default AppLoader;
