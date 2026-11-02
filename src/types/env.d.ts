declare const process: {
    readonly env: Readonly<Record<string, string | undefined>>;
};

declare module '*.css';
declare module '*.svg' {
    const source: string;
    export default source;
}
