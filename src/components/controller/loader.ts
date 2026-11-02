import type { RequestOptions, ResponseCallback } from '../../types/api';

class Loader {
    private readonly baseLink: string;
    private readonly options: Readonly<Record<string, string>>;

    public constructor(baseLink: string, options: Readonly<Record<string, string>>) {
        this.baseLink = baseLink;
        this.options = options;
    }

    public getResp<T>(request: RequestOptions, callback: ResponseCallback<T>): void {
        void this.load<T>('GET', request.endpoint, callback, request.options);
    }

    protected async load<T>(
        method: 'GET',
        endpoint: RequestOptions['endpoint'],
        callback: ResponseCallback<T>,
        options: Readonly<Record<string, string>> = {}
    ): Promise<void> {
        try {
            const response = await fetch(this.makeUrl(options, endpoint), { method });
            this.errorHandler(response);
            const data: unknown = await response.json();
            if (!this.isApiResponse(data)) {
                throw new Error('The API returned an invalid response');
            }
            callback(data as T);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unable to load news';
            this.showError(message);
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

    private showError(message: string): void {
        const status = document.querySelector<HTMLElement>('.app-status');
        if (status) {
            status.textContent = message;
            status.className = 'app-status app-status--error';
        }
    }

    private isApiResponse(value: unknown): value is { readonly status: 'ok' | 'error'; readonly message?: string } {
        if (typeof value !== 'object' || value === null || !('status' in value)) {
            return false;
        }
        const status = value.status;
        if (status === 'error') {
            throw new Error(
                'message' in value && typeof value.message === 'string' ? value.message : 'API request failed'
            );
        }
        return status === 'ok';
    }
}

export default Loader;
