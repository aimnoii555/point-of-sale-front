import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import config from "../config";

const Login = () => {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        setLoading(true);

        try {
            const payload = { phone, password };
            const res = await axios.post(`${config.path}/member/signin`, payload);

            if (res.data.status === true) {
                Swal.fire({
                    title: "Login",
                    text: "Login Success",
                    icon: "success",
                });
                localStorage.setItem(config.token_name, res.data.token);
                navigate("/home");
            } else {
                Swal.fire({
                    title: "Login Failed",
                    text: res.data.message || "กรุณาลองใหม่อีกครั้ง",
                    icon: "error",
                });
            }
        } catch (error) {
            const statusCode = error.response?.status;
            const message =
                error.response?.data?.message || error.message || "Unexpected error";
            Swal.fire({
                title: statusCode === 401 ? "Unauthorized" : "Error",
                text: message,
                icon: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-100 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm rounded-2xl">
                    <div className="p-6 sm:p-8">
                        {/* Header */}
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-semibold mb-1">เข้าสู่ระบบ</h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                ยินดีต้อนรับกลับมา
                            </p>
                        </div>

                        <form noValidate onSubmit={handleSubmit} className="space-y-4">
                            {/* Phone */}
                            <div>
                                <label
                                    htmlFor="phone"
                                    className="block text-sm font-medium mb-1"
                                >
                                    โทรศัพท์
                                </label>
                                <input
                                    id="phone"
                                    type="tel"
                                    inputMode="tel"
                                    className="w-full rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-500"
                                    placeholder="Phone number"
                                    autoComplete="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.trim())}
                                />
                            </div>

                            {/* Password + toggle */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium mb-1"
                                >
                                    รหัสผ่าน
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPwd ? "text" : "password"}
                                        className="w-full rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-3 py-2 pr-20 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-500"
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        aria-pressed={showPwd}
                                        onClick={() => setShowPwd((v) => !v)}
                                        className="absolute bg-gray-900 hover:bg-fuchsia-500 inset-y-0 right-0 my-1 mr-1 px-3 rounded-lg text-sm border border-neutral-300 dark:border-dark-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                        tabIndex={-1}
                                    >
                                        {showPwd ? "ซ่อน" : "แสดง"}
                                    </button>
                                </div>
                            </div>


                            {/* Submit */}
                            <button
                                className="w-full inline-flex items-center justify-center rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-4 py-2.5 text-sm font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-neutral-500 disabled:opacity-70"
                                type="submit"
                                disabled={loading}
                            >
                                {loading && (
                                    <svg
                                        className="mr-2 h-4 w-4 animate-spin"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
                                        />
                                    </svg>
                                )}
                                เข้าสู่ระบบ
                            </button>

                            {/* Register */}
                            <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
                                <Link
                                    to="/"
                                    className="font-medium text-neutral-800 dark:text-white underline underline-offset-4"
                                >
                                    หน้าหลัก
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-xs text-neutral-500 dark:text-neutral-400 mt-3">
                    © {new Date().getFullYear()} Deekrub POS
                </div>
            </div>
        </div>
    );
};

export default Login;
