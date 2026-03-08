declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
            };
        }
    }
}
export {};
//# sourceMappingURL=index.d.ts.map