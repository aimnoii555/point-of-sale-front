import React, { useEffect, useRef, useState } from 'react'
import MainContent from '../components/MainContent'
import Modal from '../components/Modal'
import Swal from 'sweetalert2'
import axios from 'axios'
import config from '../config'
import FilterHeader from '../components/FilterHeader'
import TableHeader from '../components/TableHeader'
import TableBody from '../components/TableBody'
import ResponseError from '../utils/ResponseError'

const User = () => {
    const [openModal, setOpenModal] = useState(false)
    const [user, setUser] = useState({ name: '', username: '', role: 'user' })
    const [users, setUsers] = useState([])
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [isPassword, setIsPassword] = useState(false)
    const [alertText, setAlertText] = useState("")
    const [readOnly, setReadOnly] = useState(false)

    const passRef = useRef(null)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const res = await axios.get(config.path + '/users/list', config.headers())
            if (res.data.status) {
                setUsers(res.data.data)
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error'
            })
        }
    }

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Confirm',
            text: 'Are you sure to delete user?',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonColor: 'red'
        }).then(async (e) => {
            if (e.isConfirmed) {
                try {
                    const res = await axios.delete(config.path + '/users/delete/' + id, config.headers())
                    if (res.data.status) {
                        Swal.fire({
                            title: 'Success',
                            text: 'Deleted Success',
                            icon: 'success',
                            timer: 2000,

                        })
                        fetchData()
                    }
                } catch (error) {
                    ResponseError(error.message)
                }
            }
        })
    }



    const handleSaveUser = async (e) => {
        e.preventDefault()
        setIsPassword(false)



        if (user.name === "" || user.name === undefined) {
            return;
        }

        if (user.username === "" || user.username === undefined) {
            return;
        }


        if ((password || passwordConfirm) && password !== passwordConfirm) {
            setIsPassword(true);
            setAlertText('รหัสผ่านไม่ตรงกัน');
            return;
        }

        let url = "/users/insert";
        if (user.id !== undefined) {
            url = "/users/update";
        }

        try {
            const newUser = {
                ...user,
                password: password
            }

            const res = await axios.post(config.path + url, newUser, config.headers())

            if (res.data.status) {
                Swal.fire({
                    title: 'Success',
                    text: 'บันทึกข้อมูลผู้ใช้งานเรียบร้อย',
                    icon: 'success',
                })
                setUser({})
                setPassword()
                setPasswordConfirm()
                fetchData()
                setOpenModal(false)
            }

        } catch (error) {
            ResponseError(error.message)
        }
    }

    return (
        <>
            <MainContent>
                <div className="rounded-lg shadow-md p-4 bg-neutral-900 dark:text-gray-200 m-2 border border-gray-800">
                    <div className='flex items-center justify-between'>
                        <h2 className="text-xl font-semibold mb-2 dark:text-white">ผู้ใช้งาน</h2>
                        <button onClick={(e) => { setOpenModal(true); setUser({}); setReadOnly(false) }} type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">เพิ่มผู้ใช้งาน</button>
                    </div>
                    <hr className='my-3 border-gray-300 dark:border-gray-700' />
                    <FilterHeader></FilterHeader>
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <TableHeader>
                            <th scope="col" className="px-6 py-3">
                                ชื่อ
                            </th>
                            <th scope="col" className="px-6 py-3">
                                ชื่อผู้ใช้
                            </th>
                            <th scope="col" className="px-6 py-3">
                                ระดับ
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </TableHeader>
                        <TableBody data={users}
                            onItem={(item, key) =>

                                <>
                                    <th key={key} scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {item.name}
                                    </th><td className="px-6 py-4">
                                        {item.username}
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.role}
                                    </td>
                                    <td className="px-6 py-4 flex ">
                                        <svg onClick={(e) => { setUser(item); setPassword(''); setPasswordConfirm(''); setOpenModal(true); setReadOnly(true) }} className="cursor-pointer w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                            <path fillRule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clipRule="evenodd" />
                                            <path fillRule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clipRule="evenodd" />
                                        </svg>
                                        <svg onClick={(e) => handleDelete(item.id)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeLinecap="1.5" stroke="currentColor" className="w-6 h-6 text-red-500 cursor-pointer ">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>

                                    </td>
                                </>
                            }
                        />

                    </table>


                </div >
            </MainContent >
            <Modal onClose={(e) => setOpenModal(false)} title="เพิ่มผู้ใช้งาน" open={openModal}>
                <div>
                    <form onSubmit={handleSaveUser}>
                        <div className='w-[100%]'>
                            <label>ชื่อ-สกุล</label>
                            <input value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} type="text" placeholder='Full Name' className="block w-full border border-gray-500 rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                        </div>
                        <div className='w-[100%] mt-5'>
                            <label>ชื่อผู้ใช้</label>
                            <input readOnly={readOnly} value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })} type="text" placeholder='Username' className="block w-full border border-gray-500 rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                        </div>
                        <div className='flex flex-row gap-2 mt-5'>

                            <div className='w-[50%]'>
                                <label>รหัสผ่าน</label>
                                <input
                                    id="real-password"
                                    name="real-password"          // ใช้ชื่อที่ไม่ใช่ 'password' ตรงๆ
                                    ref={passRef}
                                    autoComplete="new-password"   // หรือ "current-password" ตามบริบท
                                    onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Password' className="block w-full border border-gray-500 rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                            </div>

                            <div className='w-[50%]'>
                                <label >ยืนยันรหัสผ่าน</label>
                                <input name="fakepasswordremembered2" onChange={(e) => setPasswordConfirm(e.target.value)} type="password" placeholder='Password Confirm' className="block w-full border border-gray-500 rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                                <p className='text-sm text-red-500'>{isPassword ? alertText : ''}</p>
                            </div>

                        </div>
                        <div className='mt-5'>
                            <label>ระดับ</label>
                            <select value={user.role} onChange={(e) => setUser({ ...user, role: e.target.value })} className='block w-full border border-gray-500 rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6'>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <div className='mt-5'>
                            <button type="submit" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">บันทึก</button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    )
}

export default User
