export const Table = () => (
    <div className="rounded-2xl border border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
                <thead className="bg-neutral-800/60 text-neutral-300">
                    <tr>
                        <th className="text-left px-4 py-2">คำสั่งซื้อ</th>
                        <th className="text-left px-4 py-2">ชื่อลูกค้า</th>
                        <th className="text-left px-4 py-2">ยอดรวม</th>
                        <th className="text-left px-4 py-2">สถานะ</th>
                    </tr>
                </thead>
                <tbody>
                    {[
                        {
                            id: "#1001",
                            name: "สมชาย",
                            total: "฿1,250",
                            status: "ชำระแล้ว",
                        },
                        {
                            id: "#1002",
                            name: "สายไหม",
                            total: "฿3,480",
                            status: "รอชำระ",
                        },
                        {
                            id: "#1003",
                            name: "พรทิพย์",
                            total: "฿2,199",
                            status: "ส่งแล้ว",
                        },
                        {
                            id: "#1004",
                            name: "อนวัต",
                            total: "฿899",
                            status: "ยกเลิก",
                        },
                    ].map((r) => (
                        <tr
                            key={r.id}
                            className="border-t border-neutral-800/80 hover:bg-neutral-900/60"
                        >
                            <td className="px-4 py-2">{r.id}</td>
                            <td className="px-4 py-2">{r.name}</td>
                            <td className="px-4 py-2">{r.total}</td>
                            <td className="px-4 py-2">
                                <span
                                    className={`text-xs px-2 py-0.5 rounded-lg border ${r.status === "ชำระแล้ว"
                                        ? "border-emerald-600 text-emerald-300"
                                        : r.status === "ส่งแล้ว"
                                            ? "border-sky-600 text-sky-300"
                                            : r.status === "รอชำระ"
                                                ? "border-amber-600 text-amber-300"
                                                : "border-rose-600 text-rose-300"
                                        }`}
                                >
                                    {r.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);
