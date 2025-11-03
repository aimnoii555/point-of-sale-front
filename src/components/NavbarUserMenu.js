import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import config from "../config";
import Swal from "sweetalert2";
import Modal from "./Modal";
import axios from "axios";



export default function NavbarUserMenu() {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState()
    const [openModal, setOpenModal] = useState(false);

    const menuRef = useRef();
    const navigate = useNavigate();

    // ปิด dropdown เมื่อคลิกนอกเมนู
    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const handleLogout = () => {
        Swal.fire({
            title: 'LogOut',
            text: 'Are you sure to logout?',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonColor: 'red'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem(config.token_name);
                navigate("/login");
            }
        })

    };

    const handleEditProfile = async (e) => {

        try {
            await axios.get(config.path + "/member/info", config.headers()).then((res) => {
                if (res.data.status === true) {
                    setName(res.data.data.name)
                }
            })
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error'
            })
        }
    }

    const handleConfirmSaveProfile = async (e) => {
        e.preventDefault()
        try {
            await axios.put(config.path + '/member/update-profile', { name }, config.headers()).then((res) => {
                if (res.data.status === true) {
                    Swal.fire({
                        title: 'Success',
                        text: 'Update Successfully',
                        icon: 'success',
                        timer: 2000
                    })

                    setOpenModal(false)
                }
            })
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error'
            })
        }
    }

    return (
        <>
            <div className="relative" ref={menuRef}>
                {/* Avatar button */}
                <button
                    data-bs-toggle="modal"
                    data-bs-target="#modalEditProfile"
                    onClick={() => setOpen(!open)}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-neutral-100 to-neutral-300 text-neutral-900 grid place-items-center text-sm font-bold select-none hover:opacity-90"
                >
                    U
                </button>

                {/* Dropdown menu */}
                {open && (
                    <div className="absolute right-0 mt-2 w-48 rounded-xl border border-neutral-700 bg-neutral-900 shadow-lg ring-1 ring-black/5 overflow-hidden z-50">
                        <div className="px-4 py-2 border-b border-neutral-800">
                            <p className="text-sm font-semibold text-white">User Name</p>
                            <p className="text-xs text-neutral-400 truncate">
                                user@email.com
                            </p>
                        </div>

                        <div className="flex flex-col py-1">
                            <button className="text-start px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition" onClick={(e) => { setOpenModal(true); handleEditProfile() }}>Profile</button>
                            <Link
                                to="/settings"
                                className="px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition"
                                onClick={() => setOpen(false)}
                            >
                                Settings
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div >
            {/* Modal แก้ไขข้อมูลร้านค้า */}
            <Modal

                open={openModal}
                onClose={() => setOpenModal(false)}
                title="แก้ไขชื่อร้าน"
            >
                <form onSubmit={handleConfirmSaveProfile} className="space-y-4">


                    <div>
                        <label className="block text-sm mb-1">ชื่อร้าน</label>
                        <input
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-500"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-3">
                        <button
                            type="button"
                            onClick={() => setOpenModal(false)}
                            onChange={(e) => setName(e.target.value)}
                            className="px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-800"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-sm font-medium hover:opacity-90"
                        >
                            ยืนยัน
                        </button>
                    </div>
                </form>
            </Modal >


        </>
    );
}
