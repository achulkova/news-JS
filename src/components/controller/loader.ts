import { isApiErrorResponse } from '../../types/api';
import type { RequestOptions, ResponseCallback, ResponseValidator } from '../../types/api';

class Loader {
    private readonly baseLink: string;
    private readonly options: Readonly<Record<string, string>>;

    public constructor(baseLink: string, options: Readonly<Record<string, string>>) {
        this.baseLink = baseLink;
        this.options = options;
    }

    public getResp<T>(request: RequestOptions, callback: ResponseCallback<T>, validate: ResponseValidator<T>): void {
        this.setStatus(request.endpoint === 'sources' ? 'Loading news sources…' : 'Loading stories…', 'loading');
        void this.load<T>('GET', request.endpoint, callback, validate, request.options);
    }

    protected async load<T>(
        method: 'GET',
        endpoint: RequestOptions['endpoint'],
        callback: ResponseCallback<T>,
        validate: ResponseValidator<T>,
        options: Readonly<Record<string, string>> = {}
    ): Promise<void> {
        try {
            const response = await fetch(this.makeUrl(options, endpoint), { method });
            this.errorHandler(response);
            const data: unknown = await response.json();
            if (isApiErrorResponse(data)) {
                throw new Error(data.message || 'API request failed');
            }
            if (!validate(data)) {
                throw new Error('The API returned an invalid response structure');
            }
            callback(data);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unable to load news';
            this.setStatus(message, 'error');
        }
    }

    private errorHandler(response: Response): void {
        if (!response.ok) {
            throw new Error(`Request failed (${response.status}): ${response.statusText || 'Unknown error'}`);
        }
    }

    private makeUrl(options: Readonly<Record<string, string>>, endpoint: string): string {
        const urlOptions = { ...this.options, ...options };
        const params = new URLSearchParams();
        Object.entries(urlOptions).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            }
        });
        return `${this.baseLink.replace(/\/$/, '')}/${endpoint}?${params.toString()}`;
    }

    private setStatus(message: string, state: 'loading' | 'error'): void {
        const status = document.querySelector<HTMLElement>('.app-status');
        if (status) {
            status.textContent = message;
            status.className = `app-status app-status--${state}`;
        }
    }
}

export default Loader;
