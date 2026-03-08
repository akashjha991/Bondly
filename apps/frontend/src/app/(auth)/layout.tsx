export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <div className="w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex mb-12 flex-col">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent pb-4 text-center">
                    Bondly
                </h1>
                <p className="text-slate-500 text-center max-w-sm">
                    A private, exclusive space built just for the two of you.
                </p>
            </div>

            {children}
        </div>
    );
}
