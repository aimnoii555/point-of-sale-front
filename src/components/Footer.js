import { Link } from "react-router-dom";

export const Footer = () => (
    <footer className="mt-auto border-t border-neutral-800 bg-neutral-900/60">
        <div className="max-w-screen-2xl mx-auto px-4 py-4 text-sm text-neutral-400 flex items-center justify-between">
            <span>© {new Date().getFullYear()} Your Company</span>
            <span className="space-x-3">
                <Link className="hover:text-neutral-200" href="#">
                    Privacy
                </Link>
                <Link className="hover:text-neutral-200" href="#">
                    Terms
                </Link>
                <Link className="hover:text-neutral-200" href="#">
                    Support
                </Link>
            </span>
        </div>
    </footer>
);

