import React, { useEffect, useState } from 'react'
import MainContent from '../components/MainContent'
import Card from '../components/Card'
import ResponseError from '../utils/ResponseError'
import axios from 'axios'
import config from '../config'
import TableHeader from '../components/TableHeader'
import TableBody from '../components/TableBody'
import Modal from '../components/Modal'

const SumSalePerDay = () => {
    const [billSale, setBillSale] = useState([])
    const [billDataOnModal, setBillDataOnModel] = useState({})
    const [billDetailOnModal, setBillDetailOnModel] = useState([])
    const [openModal, setOpenModal] = useState(false)

    const [currentYear, setCurrentYear] = useState(() => {
        let myDate = new Date();
        return myDate.getFullYear()
    })

    const [arrYear] = useState(() => {
        let arr = [];
        let myDate = new Date();
        let currentYear = myDate.getFullYear();
        let beforeYear = currentYear - 5;

        for (let i = beforeYear; i <= currentYear; i++) {
            arr.push(i)
        }

        return arr;
    })

    const [currentMonth, setCurrentMonth] = useState(() => {
        let myDate = new Date();
        return myDate.getMonth() + 1;
    })

    const [arrMonth] = useState(() => {
        let arr = [
            { value: 1, label: 'มกราคม' },
            { value: 2, label: 'กุมภาพันธ์' },
            { value: 3, label: 'มีนาคม' },
            { value: 4, label: 'เมษายน' },
            { value: 5, label: 'พฤษภาคม' },
            { value: 6, label: 'มิถุนายน' },
            { value: 7, label: 'กรกฎาคม' },
            { value: 8, label: 'สิงหาคม' },
            { value: 9, label: 'กันยายน' },
            { value: 10, label: 'ตุลาคม' },
            { value: 11, label: 'พฤศจิกายน' },
            { value: 12, label: 'ธันวาคม' }
        ];

        return arr;
    })

    useEffect(() => {
        handleShowReport()
    }, [])

    const handleShowReport = async () => {
        try {
            const path = config.path + '/bill/list-by-year-and-month/' + currentYear + '/' + currentMonth;
            const res = await axios.get(path, config.headers())
            if (res.data.status) {
                setBillSale(res.data.data)
            }
        } catch (error) {
            ResponseError(error.message)
        }
    }



    return (
        <>
            <MainContent>
                <Card title="รายงานสรุปยอดขายรายวัน">
                    <div>
                        <form className="max-w-lg">
                            <div className='grid md:grid-cols-3 md:gap-6 items-end'>
                                <div>
                                    <label htmlFor="years" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Year</label>
                                    <select onChange={(e) => setCurrentYear(e.target.value)} value={currentYear} id="years" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        {arrYear.map((item, key) => (
                                            <option key={key}>{item}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="month" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Month</label>
                                    <select onChange={(e) => setCurrentMonth(e.target.value)} value={currentMonth} id="month" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        {arrMonth.map((item, key) => (
                                            <option key={key} value={item.value}>{item.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    onClick={() => handleShowReport()}
                                    type="button"
                                    className="mt-3 text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                    แสดงรายการ
                                </button>
                            </div>

                        </form>
                    </div>
                    <hr className='mb-5 mt-5 border-gray-600' />
                    <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border rounded-lg mr-3'>
                        <TableHeader>

                            <th scope="col" className="px-6 py-3 w-[20%]">วันที่</th>
                            <th scope="col" className="px-6 py-3 w-[50%]">ยอดขาย</th>
                            <th scope="col" className="px-6 py-3 w-[10%]">Action</th>

                        </TableHeader>
                        <TableBody data={billSale} onItem={(item) => (
                            <>
                                <th scope="row" className="px-6 py-4">{item.day}</th>
                                <th scope="row" className="px-6 py-4">{item.sum.toLocaleString('Th-th')}</th>
                                <th scope="row" className="px-6 py-4">
                                    <button onClick={() => { setBillDataOnModel(item.data); setOpenModal('detail') }} type="button" class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">รายละเอียด</button>
                                </th>

                            </>
                        )}>

                        </TableBody>
                    </table>
                </Card>
            </MainContent>
            <Modal open={openModal === 'detail'} onClose={() => setOpenModal(false)} title="บิลขาย">
                <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>

                    <TableHeader>

                        <th scope="col" className="px-6 py-3 w-[15%]">เลขบิล</th>
                        <th scope="col" className="px-6 py-3 w-[55%]">วันที่</th>
                        <th scope="col" className="px-6 py-3 w-[30%]">Action</th>

                    </TableHeader>
                    <TableBody data={billDataOnModal} onItem={(item) => (
                        <>
                            <th scope='row' className='py-4 px-6'>{item.id}</th>
                            <th scope='row' className='py-4 px-6'>{item.createdAt}</th>
                            <th scope='row' className='py-4 px-6'>
                                <button onClick={() => { setBillDetailOnModel(item.bill_sale_details); setOpenModal('bill-detail') }} type="button" class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">รายละเอียด</button>
                            </th>

                        </>
                    )}>

                    </TableBody>
                </table>
            </Modal >
            <Modal open={openModal === 'bill-detail'} title={'รายลเอียดบิล'} onClose={() => setOpenModal(false)}>
                <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>

                    <TableHeader>
                        <th scope="col" className="px-6 py-3 w-[55%]">รายการ</th>
                        <th scope="col" className="px-6 py-3 w-[15%]">ราคา</th>
                        <th scope="col" className="px-6 py-3 w-[15%]">จำนวน</th>
                        <th scope="col" className="px-6 py-3 w-[15%]">ยอดรวม</th>
                    </TableHeader>
                    {
                        <TableBody data={billDetailOnModal} onItem={(item) => (
                            <>
                                <th scope='row' className='py-4 px-6'>{item.product.name}</th>
                                <th scope='row' className='py-4 px-6'>{item.product.price.toLocaleString('TH-th')}</th>
                                <th scope='row' className='py-4 px-6'>{item.qty}</th>
                                <th scope='row' className='py-4 px-6'>{(item.qty * item.price).toLocaleString('TH-th')}</th>

                            </>
                        )}>

                        </TableBody>
                    }

                </table>
            </Modal>
        </>

    )
}

export default SumSalePerDay
