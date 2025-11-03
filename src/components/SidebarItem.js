import { Link } from "react-router-dom";

export const SidebarItem = (props) => (
    <Link
        to={`${props.url}`}
        // key={props.key}
        className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl transition hover:bg-neutral-800/80 text-sm ${props.active ? "bg-neutral-800 ring-1 ring-neutral-700" : ""
            }`}
    >
        <span className="inline-flex w-5 h-5" aria-hidden>
            {props.icon}
        </span>
        <span>{props.label}</span>
    </Link>
);
