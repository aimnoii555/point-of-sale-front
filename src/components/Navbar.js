import { useEffect } from "react";
import NavbarUserMenu from "./NavbarUserMenu";

export const Navbar = (props) => {
    useEffect(() => {
        const html = document.documentElement;
        if (props.dark) html.classList.add("dark");
        else html.classList.remove("dark");
    }, [props.dark]);

    return (
        <header className="sticky top-0 z-20 bg-neutral-900/80 backdrop-blur border-b border-neutral-800">
            <div className="max-w-screen-2xl mx-auto px-4 h-14 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button
                        onClick={props.onMenu}
                        className="lg:hidden p-2 rounded-lg hover:bg-neutral-800"
                        aria-label="open sidebar"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        >
                            <path d="M3 6h18M3 12h18M3 18h18" />
                        </svg>
                    </button>
                    <p className="font-semibold">แผงควบคุม</p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <input
                            className="bg-neutral-800 border border-neutral-700 rounded-xl pl-9 pr-3 py-1.5 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-600"
                            placeholder="ค้นหา..."
                        />
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400">
                            <svg
                                viewBox="0 0 24 24"
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            >
                                <path d="M21 21l-4.3-4.3M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" />
                            </svg>
                        </span>
                    </div>

                    <button
                        onClick={() => props.setDark((v) => !v)}
                        className="p-2 rounded-lg hover:bg-neutral-800"
                        aria-label="toggle theme"
                    >
                        {props.dark ? (
                            <svg
                                viewBox="0 0 24 24"
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            >
                                <path d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.36 6.36-1.42-1.42M7.05 7.05 5.64 5.64m12.02 0-1.41 1.41M7.05 16.95l-1.41 1.41" />
                            </svg>
                        ) : (
                            <svg
                                viewBox="0 0 24 24"
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            >
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
                            </svg>
                        )}
                    </button>

                    <button
                        className="p-2 rounded-lg hover:bg-neutral-800"
                        aria-label="notifications"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        >
                            <path d="M6 8a6 6 0 1 1 12 0c0 7 3 5 3 9H3c0-4 3-2 3-9Zm6 13a2.5 2.5 0 0 1-2.5-2.5h5A2.5 2.5 0 0 1 12 21Z" />
                        </svg>
                    </button>

                    <NavbarUserMenu />
                </div>
            </div>
        </header>
    );
};
