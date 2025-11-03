export const StatCard = (props) => (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
        <p className="text-sm text-neutral-400">{props.title}</p>
        <div className="mt-2 flex items-baseline gap-2">
            <p className="text-2xl font-semibold">{props.value}</p>
            <span
                className={`text-xs px-2 py-0.5 rounded-lg ${props.delta.startsWith("+")
                    ? "bg-emerald-500/15 text-emerald-300"
                    : "bg-rose-500/15 text-rose-300"
                    }`}
            >
                {props.delta}
            </span>
        </div>
    </div>
);
