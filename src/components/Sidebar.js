import { useEffect, useState } from "react";
import { SidebarItem } from "./SidebarItem";
import axios from "axios";
import Swal from "sweetalert2";
import config from "../config";
import ResponseError from "../utils/ResponseError";
import Modal from "./Modal";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import useBearProvider from "../provider/useBillStore";


export const Sidebar = ({ open, onClose, current, setCurrent }) => {
    const [member, setMember] = useState();
    const [packageName, setPackageName] = useState()
    const [billAmount, setBillAmount] = useState(0)
    const [packages, setPackages] = useState([])
    const [openModal, setOpenModal] = useState(null)
    const [selectedPackage, setSelectedPackage] = useState(null)
    const [isUpdatingPackage, setIsUpdatingPackage] = useState(false)
    const [banks, setBanks] = useState([])

    const [choosePackage, setChoosePackage] = useState({})

    const [slip, setSlip] = useState()

    const fetchDataTotalBill = useBearProvider((state) => state.fetchDataTotalBill)
    const totalBill = useBearProvider((state) => state.totalBill)



    useEffect(() => {
        fetchData();
        fetchDataTotalBill()

        if (!openModal) {
            setSelectedPackage(null)
            return
        }

        if (!packages.length) return

        setSelectedPackage((prev) => {
            if (prev) return prev
            return packages.find((pkg) => pkg.name === packageName) ?? null
        })
    }, [openModal, packages, packageName])






    const fetchDataBanks = async () => {
        try {
            const res = await axios.get(config.path + '/bank/list', config.headers())
            if (res.data.status) {
                setBanks(res.data.data)
            }
        } catch (error) {
            ResponseError(error.message)
        }
    }



    const fetchData = async () => {
        try {

            await axios.get(config.path + "/member/info", config.headers()).then((res) => {
                if (res.data.status === true) {
                    setPackageName(res.data.data.package.name)
                    setBillAmount(res.data.data.package.bill_amount)
                    setMember(res.data.data.name)
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

    const fetchPackages = async () => {
        try {
            const res = await axios.get(config.path + '/package/list', config.headers())
            setPackages(res.data)

        } catch (error) {
            ResponseError(error.message)
        }
    }



    const handleConfirmPackage = (item) => {
        if (!selectedPackage || selectedPackage.name === packageName) {
            return
        }
        setChoosePackage(item)
        fetchDataBanks()
        setOpenModal('payment')


        // Swal.fire({
        //     title: 'ยืนยันการเปลี่ยนแพ็กเกจ?',
        //     text: `ต้องการเปลี่ยนเป็นแพ็กเกจ ${selectedPackage.name} หรือไม่`,
        //     icon: 'question',
        //     showCancelButton: true,
        //     confirmButtonText: 'ยืนยัน',
        //     cancelButtonText: 'ยกเลิก'
        // }).then(async (result) => {
        //     if (!result.isConfirmed) return

        //     try {
        //         setIsUpdatingPackage(true)
        //         await axios.put(
        //             config.path + '/member/update-profile',
        //             { package_id: selectedPackage.id },
        //             config.headers()
        //         )
        //         await fetchData()
        //         Swal.fire({
        //             title: 'อัปเดตสำเร็จ',
        //             text: `เปลี่ยนเป็นแพ็กเกจ ${selectedPackage.name} แล้ว`,
        //             icon: 'success',
        //             timer: 2000
        //         })
        //         setOpenModal(false)
        //     } catch (error) {
        //         ResponseError(error.message)
        //     } finally {
        //         setIsUpdatingPackage(false)
        //     }
        // })
    }

    const handleConfirmPayment = async () => {
        if (!slip) {
            return;
        }

        try {
            const res = await axios.get(config.path + '/package/change-package/' + choosePackage.id, config.headers())
            if (res.data.status) {
                Swal.fire({
                    title: 'Success',
                    text: 'คุณได้แจ้งชำระเงินเรียบร้อยแล้ว ระบบกำลังอัปเดตแพ็กเกจให้',
                    icon: 'success',
                    timer: 3000
                })

                setOpenModal(false)
            }
        } catch (error) {
            ResponseError(error.message)
        }
    }

    const formatNumber = (value) => {
        const numericValue = Number(value)
        if (Number.isNaN(numericValue)) return '-'
        return numericValue.toLocaleString('th-TH')
    }

    const menu = [
        {
            url: '/home',
            key: "dashboard",
            label: "Dashboard",
            icon: (
                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M20 6H10m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4m16 6h-2m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4m16 6H10m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4" />
                </svg>
            ),
        },
        {
            url: '/sales',
            key: "sale",
            label: "ขายสินค้า",
            icon: (

                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none" viewBox="0 0 24 24">
                    <path fill="#0000" d="M6.29977 5H21L19 12H7.37671M20 16H8L6 3H3M9 20C9 20.5523 8.55228 21 8 21C7.44772 21 7 20.5523 7 20C7 19.4477 7.44772 19 8 19C8.55228 19 9 19.4477 9 20ZM20 20C20 20.5523 19.5523 21 19 21C18.4477 21 18 20.5523 18 20C18 19.4477 18.4477 19 19 19C19.5523 19 20 19.4477 20 20Z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
        },
        {
            url: '/products',
            key: "products",
            label: "สินค้า",
            icon: (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="w-5 h-5"
                >
                    <path d="M3 7h18M7 3v8m10-8v8M5 21h14a2 2 0 0 0 2-2V7H3v12a2 2 0 0 0 2 2Z" />
                </svg>
            ),
        },
        {
            url: '/users',
            key: "users",
            label: "ผู้ใช้งาน",
            icon: (
                <svg width="100px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                    <g id="SVGRepo_iconCarrier">
                        <path d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z" fill="#ffffff" />
                        <path d="M14 12C14 10.3431 12.6569 9 11 9H5C3.34315 9 2 10.3431 2 12V15H14V12Z" fill="#ffffff" />
                    </g>

                </svg>

            ),
        },
        {
            url: '/sum-sale-per-day',
            key: "sumdayperday",
            label: "รายงานยอดขายรายวัน",
            icon: (
                <svg width="80px" viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                    <g id="SVGRepo_iconCarrier">
                        <path d="M292.571429 906.971429H146.285714c-14.628571 0-21.942857-7.314286-21.942857-21.942858V533.942857c0-7.314286 14.628571-21.942857 21.942857-21.942857h146.285715c14.628571 0 21.942857 7.314286 21.942857 21.942857v351.085714c0 7.314286-7.314286 21.942857-21.942857 21.942858z" fill="#e4e7e6" />
                        <path d="M292.571429 928.914286H146.285714c-29.257143 0-43.885714-21.942857-43.885714-43.885715V533.942857c0-21.942857 21.942857-43.885714 43.885714-43.885714h146.285715c29.257143 0 43.885714 21.942857 43.885714 43.885714v351.085714c7.314286 21.942857-14.628571 43.885714-43.885714 43.885715zM153.6 877.714286h131.657143V541.257143H153.6V877.714286zM943.542857 928.914286H804.571429c-29.257143 0-51.2-21.942857-51.2-51.2V394.971429c0-29.257143 21.942857-51.2 51.2-51.2h138.971428c29.257143 0 51.2 21.942857 51.2 51.2V877.714286c0 29.257143-21.942857 51.2-51.2 51.2z m-7.314286-533.942857H804.571429V877.714286l131.657142-7.314286V394.971429z m7.314286 482.742857z" fill="#ffffff" />
                        <path d="M621.714286 906.971429H490.057143c-14.628571 0-29.257143-14.628571-29.257143-29.257143V102.4c0-14.628571 14.628571-29.257143 29.257143-29.257143h124.342857c14.628571 0 29.257143 14.628571 29.257143 29.257143V877.714286c7.314286 14.628571-7.314286 29.257143-21.942857 29.257143z" fill="#e4e7e6" />
                        <path d="M621.714286 928.914286H490.057143c-29.257143 0-58.514286-21.942857-58.514286-58.514286V102.4c0-29.257143 21.942857-58.514286 58.514286-58.514286h124.342857c29.257143 0 58.514286 21.942857 58.514286 58.514286V877.714286c0 29.257143-21.942857 51.2-51.2 51.2zM490.057143 102.4V877.714286h131.657143V102.4H490.057143z" fill="#ffffff" />
                    </g>
                </svg>

            ),
        },
        {
            url: '/report-bill-sale',
            key: "report-bill-sale",
            label: "รายงานบิล",
            icon: (
                <svg width="50px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                    <g id="SVGRepo_iconCarrier">
                        <path d="M21 6V3.50519C21 2.92196 20.3109 2.61251 19.875 2.99999C19.2334 3.57029 18.2666 3.57029 17.625 2.99999C16.9834 2.42969 16.0166 2.42969 15.375 2.99999C14.7334 3.57029 13.7666 3.57029 13.125 2.99999C12.4834 2.42969 11.5166 2.42969 10.875 2.99999C10.2334 3.57029 9.26659 3.57029 8.625 2.99999C7.98341 2.42969 7.01659 2.42969 6.375 2.99999C5.73341 3.57029 4.76659 3.57029 4.125 2.99999C3.68909 2.61251 3 2.92196 3 3.50519V14M21 10V20.495C21 21.0782 20.3109 21.3876 19.875 21.0002C19.2334 20.4299 18.2666 20.4299 17.625 21.0002C16.9834 21.5705 16.0166 21.5705 15.375 21.0002C14.7334 20.4299 13.7666 20.4299 13.125 21.0002C12.4834 21.5705 11.5166 21.5705 10.875 21.0002C10.2334 20.4299 9.26659 20.4299 8.625 21.0002C7.98341 21.5705 7.01659 21.5705 6.375 21.0002C5.73341 20.4299 4.76659 20.4299 4.125 21.0002C3.68909 21.3876 3 21.0782 3 20.495V18" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M7.5 15.5H11.5M16.5 15.5H14.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M16.5 12H12.5M7.5 12H9.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M7.5 8.5H16.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                    </g>
                </svg>

            ),
        },
        {
            url: '/stock',
            key: "stock",
            label: "สต็อก",
            icon: (
                <svg width="50px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                    <g id="SVGRepo_iconCarrier">
                        <path d="M15.5777 3.38197L17.5777 4.43152C19.7294 5.56066 20.8052 6.12523 21.4026 7.13974C22 8.15425 22 9.41667 22 11.9415V12.0585C22 14.5833 22 15.8458 21.4026 16.8603C20.8052 17.8748 19.7294 18.4393 17.5777 19.5685L15.5777 20.618C13.8221 21.5393 12.9443 22 12 22C11.0557 22 10.1779 21.5393 8.42229 20.618L6.42229 19.5685C4.27063 18.4393 3.19479 17.8748 2.5974 16.8603C2 15.8458 2 14.5833 2 12.0585V11.9415C2 9.41667 2 8.15425 2.5974 7.13974C3.19479 6.12523 4.27063 5.56066 6.42229 4.43152L8.42229 3.38197C10.1779 2.46066 11.0557 2 12 2C12.9443 2 13.8221 2.46066 15.5777 3.38197Z" stroke="#f0f2f9" strokeWidth="1.5" strokeLinecap="round" />
                        <path opacity="0.5" d="M21 7.5L17 9.5M12 12L3 7.5M12 12V21.5M12 12C12 12 14.7426 10.6287 16.5 9.75C16.6953 9.65237 17 9.5 17 9.5M17 9.5V13M17 9.5L7.5 4.5" stroke="#f0f2f9" strokeWidth="1.5" strokeLinecap="round" />
                    </g>
                </svg>

            ),
        },
        {
            url: '/report-stock',
            key: 'report-stock',
            label: 'รายงานสต็อก',
            icon: (
                <svg width="50px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                    <g id="SVGRepo_iconCarrier">
                        <path d="M3 3H21V21H3V3Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M7 3V21" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M3 7H21" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M16 17H8V13H16V17Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M16 11H8V7H16V11Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                </svg>)
        }
        // {
        //     key: "overview",
        //     label: "ภาพรวม",
        //     icon: (
        //         <svg
        //             viewBox="0 0 24 24"
        //             fill="none"
        //             stroke="currentColor"
        //             strokeWidth="1.5"
        //             className="w-5 h-5"
        //         >
        //             <path d="M3 12h18M3 6h18M3 18h18" />
        //         </svg>
        //     ),
        // },



    ];

    return (
        <div>
            {/* Overlay for mobile */}
            {open && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                />
            )}

            <aside
                className={`fixed z-40 top-0 left-0 h-full w-72 bg-neutral-900/90 backdrop-blur border-r border-neutral-800 p-4 transition-transform ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                    }`}
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-300 text-neutral-900 font-bold">
                            A
                        </span>
                        <div>
                            <p className="font-semibold leading-tight">Admin</p>
                            <p className="text-xs text-neutral-400">Dashboard</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 rounded-lg hover:bg-neutral-800"
                        aria-label="close sidebar"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        >
                            <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                    </button>
                </div>

                <div className="mb-5">
                    <h4>{member} : {packageName}</h4>
                </div>
                <div>
                    <button onClick={() => { fetchPackages(); setOpenModal('package') }} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                            Upgradle Package
                        </span>
                    </button>
                </div>
                <div className="my-2">
                    <div><span className="text-sm"> {totalBill.toLocaleString('TH-th')} /{billAmount.toLocaleString('TH-th')}</span></div>
                    <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                        <div className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: `${(totalBill / billAmount) * 100}%` }}> {(totalBill / billAmount) * 100}%</div>
                    </div>
                </div>


                <nav className="space-y-1">
                    {menu.map((item, key) => (
                        <SidebarItem
                            key={key}
                            url={item.url}
                            icon={item.icon}
                            label={item.label}
                            active={current === item.key}
                            onClick={() => setCurrent(item.key)}
                        />
                    ))}
                </nav>

                <div className="mt-8 p-3 rounded-xl bg-neutral-800/60 border border-neutral-700">
                    <p className="text-sm font-medium">สรุปวันนี้</p>
                    <p className="text-xs text-neutral-400 mt-1">
                        ยอดขาย 27,450 ฿ • ออเดอร์ใหม่ 42
                    </p>
                </div>

                <footer className="absolute bottom-4 left-0 right-0 px-4">
                    <div className="text-xs text-neutral-500">
                        © {new Date().getFullYear()} Your Company
                    </div>
                </footer>
            </aside>
            <Modal title={'เลือกแพ็กเก็จ'} open={openModal === 'package'} onClose={() => setOpenModal(false)}>
                <div className="space-y-6">
                    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 px-4 py-3">
                        <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">แพ็กเกจปัจจุบัน</p>
                        <p className="text-lg font-semibold text-neutral-900 dark:text-white mt-1">{packageName || 'ยังไม่มีข้อมูลแพ็กเกจ'}</p>
                    </div>

                    {packages.length ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {packages.map((item) => {
                                const isCurrentPackage = item.name === packageName
                                const isSelected = selectedPackage?.id === item.id
                                const cardClasses = [
                                    'rounded-2xl border px-5 py-4 text-left transition shadow-sm',
                                    isSelected ? 'border-violet-500 bg-violet-50/70 dark:bg-violet-500/10' : 'border-neutral-200 dark:border-neutral-800 hover:border-violet-400 hover:bg-violet-50/40 dark:hover:border-violet-500/60',
                                    isCurrentPackage ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                                ].join(' ')

                                return (
                                    <button
                                        key={item.id ?? item.name}
                                        type="button"
                                        disabled={isCurrentPackage}
                                        onClick={() => setSelectedPackage(item)}
                                        className={cardClasses}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-sm text-neutral-500 dark:text-neutral-400">{formatNumber(item.bill_amount)} บิล / เดือน</p>
                                                <p className="text-xl font-semibold text-neutral-900 dark:text-white">{item.name}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400">ราคา</p>
                                                <p className="text-2xl font-bold text-emerald-500">{formatNumber(item.price)} ฿</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                                            {isCurrentPackage ? (
                                                <span className="inline-flex items-center rounded-full bg-neutral-900/10 px-2 py-0.5 text-[11px] font-semibold text-neutral-700 dark:bg-neutral-100/10 dark:text-neutral-200">แพ็กเกจปัจจุบัน</span>
                                            ) : (
                                                <span>กดเพื่อเลือกแพ็กเกจนี้</span>
                                            )}
                                            {isSelected && !isCurrentPackage && (
                                                <span className="inline-flex items-center gap-1 font-semibold text-violet-600">
                                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    เลือกแล้ว
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="py-10 text-center text-neutral-500">กำลังโหลดแพ็กเกจ...</div>
                    )}

                    <div className="flex flex-col gap-4 border-t border-neutral-200 pt-4 dark:border-neutral-800 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">แพ็กเกจที่เลือก</p>
                            {selectedPackage ? (
                                <div className="mt-1 text-neutral-900 dark:text-white">
                                    <p className="font-semibold">{selectedPackage.name}</p>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{formatNumber(selectedPackage.bill_amount)} บิล / เดือน • {formatNumber(selectedPackage.price)} ฿</p>
                                </div>
                            ) : (
                                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">กรุณาเลือกแพ็กเกจก่อนยืนยัน</p>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setOpenModal(false)}
                                className="rounded-xl border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
                            >
                                ยกเลิก
                            </button>
                            <button
                                type="button"
                                onClick={() => handleConfirmPackage(selectedPackage)}
                                disabled={!selectedPackage || selectedPackage.name === packageName || isUpdatingPackage}
                                className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-violet-500"
                            >
                                {isUpdatingPackage ? 'กำลังอัปเดต...' : 'ชำระเงิน'}
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal title={"ชำระเงิน"} open={openModal === 'payment'} onClose={() => setOpenModal(false)}>
                <span className="text-sm">Pakcage  <span className=" text-green-400">{choosePackage.name}</span> กรุณาโอนเงินจำนวน <span className="text-red-500">{choosePackage.price?.toLocaleString('TH-th')}</span> บาท ไปยังบัญชีด้านล่าง </span>
                <table className="w-full text-sm text-left text-gray-500 mt-3">
                    <TableHeader>
                        <th scope="col" className="py-6 px-3">ธนาคาร</th>
                        <th scope="col" className="py-6 px-3">เลขบัญชี</th>
                        <th scope="col" className="py-6 px-3">ชื่อเจ้าของบัญชี</th>
                        <th scope="col" className="py-6 px-3">ชื่อสาขา</th>
                    </TableHeader>
                    <TableBody data={banks} onItem={(item) => (
                        <>
                            <td className="py-4 px-3">{item.bank_type}</td>
                            <td className="py-4 px-3">{item.bank_code}</td>
                            <td className="py-4 px-3">{item.bank_name}</td>
                            <td className="py-4 px-3">{item.bank_branch}</td>
                        </>
                    )}>
                    </TableBody>
                </table>
                <div className="mt-4 flex flex-col">
                    <span className="text-red-500 text-sm ml-4 mb-4"> เมื่อโอนเงินแล้วกรุณาแนบสลิปโอนเงินด้วย!! </span>
                    <input type="file" onChange={(e) => setSlip(e.target.value)} ></input>
                    <button onClick={() => handleConfirmPayment()} type="button" class="mt-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">ยืนยันการเปลี่ยนแพ็กเกจ</button>
                </div>
            </Modal>
        </div>
    );
};
