import React, { useEffect, useState } from 'react'
import MainContent from '../components/MainContent'
import Card from '../components/Card'
import ResponseError from '../utils/ResponseError'
import axios from 'axios'
import config from '../config'
import TableHeader from '../components/TableHeader'
import TableBody from '../components/TableBody'
import Modal from '../components/Modal'

const ReportBillSale = () => {
    const [billSales, setBillSales] = useState([])
    const [billSaleDetaie, setBillSaleDetail] = useState({})
    const [openModal, setOpenModal] = useState(false)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const res = await axios.get(config.path + '/bill/list', config.headers())

            if (res.data.status) {
                setBillSales(res.data.data)
            }
        } catch (error) {
            ResponseError(error.message)
        }
    }

    return (
        <>
            <MainContent>
                <Card title="รายงานบิล">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <TableHeader>
                            <th scope="col" className="px-6 py-3">เลขบิล</th>
                            <th scope="col" className="px-6 py-3">วันที่</th>
                            <th scope='col' className='px-6 py-3'>Action</th>
                        </TableHeader>
                        <TableBody data={billSales} onItem={(item) => (
                            <>
                                <td className="px-6 py-4">{item.id}</td>
                                <th scope="row" className="px-6 py-4">{item.createdAt}</th>
                                <td>
                                    <button onClick={() => { setBillSaleDetail(item); setOpenModal('detail') }} type="button" class="m-2 text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">รายละเอียด</button>
                                </td>
                            </>
                        )} />
                    </table>
                </Card>
            </MainContent>

            <Modal open={openModal === 'detail'} onClose={(e) => setOpenModal(false)} title={'รายละเอียด'}>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <TableHeader>
                        <th scope="col" className="px-6 py-3">รายการ</th>
                        <th scope="col" className="px-6 py-3">ราคา</th>
                        <th scope="col" className="px-6 py-3">จำนวน</th>
                        <th scope="col" className="px-6 py-3">ยอดรวม</th>
                    </TableHeader>
                    <TableBody data={billSaleDetaie.bill_sale_details} onItem={(item) => (
                        <>
                            <td className="px-6 py-4">{item.product.name}</td>
                            <th scope="row" className="px-6 py-4">{item.product.price.toLocaleString('TH-th')}</th>
                            <th scope="row" className="px-6 py-4">{item.qty}</th>
                            <th scope="row" className="px-6 py-4">{(item.qty * item.product.price).toLocaleString('TH-th')}</th>

                        </>
                    )} />

                </table>

            </Modal>
        </>
    )
}

export default ReportBillSale
