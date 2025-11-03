import React, { useEffect, useState } from 'react'
import MainContent from '../components/MainContent'
import Card from '../components/Card'
import ResponseError from '../utils/ResponseError'
import axios from 'axios'
import config from '../config'
import TableHeader from '../components/TableHeader'
import TableBody from '../components/TableBody'
import Modal from '../components/Modal'
import * as dayjs from 'dayjs'

const ReportStock = () => {
    const [stocks, setStocks] = useState([])
    const [currentStockIn, setCurrentStockIn] = useState({})
    const [currentStockOut, setCurrentStockOut] = useState({})


    const [openModal, setOpenModal] = useState(false)

    useEffect(() => {
        fetchData()
    }, [])





    const fetchData = async () => {
        try {
            const res = await axios.get(config.path + '/stock/report', config.headers())
            if (res.data.status) {
                setStocks(res.data.data)
                // console.log(res.data.data)
            }
        } catch (error) {
            ResponseError(error.message)
        }
    }

    const selectedStockIn = (item) => {
        setCurrentStockIn(item)
        setOpenModal(true)
    }

    const selectedStockOut = (item) => {
        setCurrentStockOut(item)
        setOpenModal(true)
    }

    return (
        <>
            <MainContent>
                <Card title="รายงานสต็อกสินค้า">
                    <table className='w-full text-left text-sm text-gray-500 dark:text-gray-400 border'>
                        <TableHeader>
                            <th scope='col' className='py-6 px-3'>Barcode</th>
                            <th scope='col' className='py-6 px-3'>รายการ</th>
                            <th scope='col' className='py-6 px-3'>รับเข้า</th>
                            <th scope='col' className='py-6 px-3'>ขายออก</th>
                            <th scope='col' className='py-6 px-3'>คงเหลือ</th>
                        </TableHeader>
                        <TableBody data={stocks} onItem={(item) => (
                            <>
                                <td className="px-6 py-4">{item.result.barcode}</td>
                                <td className="px-6 py-4">{item.result.name}</td>
                                <td className="px-6 py-4">
                                    <button onClick={() => selectedStockIn(item.result)} type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        {item.stock_in.toLocaleString('TH-th')}
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    <button type="button" onClick={() => selectedStockOut(item.result)} class="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                                        {item.stock_out.toLocaleString('TH-th')}
                                    </button>
                                </td>
                                <td className="px-6 py-4">{(item.stock_in - item.stock_out).toLocaleString('TH-th')}</td>

                            </>
                        )}>

                        </TableBody>
                    </table>
                </Card>
            </MainContent>
            <Modal open={openModal} onClose={() => setOpenModal(false)} title={'ข้อมูลการรับเข้าสต็อกสินค้า'}>
                <table className='w-full text-left text-sm text-gray-500 dark:text-gray-400'>
                    <TableHeader>
                        <th scope='col' className='py-6 px-3'>barcode</th>
                        <th scope='col' className='py-6 px-3'>รายการ</th>
                        <th scope='col' className='py-6 px-3'>จำนวน</th>
                        <th scope='col' className='py-6 px-3'>วันที่</th>
                    </TableHeader>
                    <TableBody data={currentStockIn.stocks} onItem={(item) => (
                        <>
                            <td scope="row" className='className="px-6 py-4'>{item.product.barcode}</td>
                            <td scope="row" className='className="px-6 py-4'>{item.product.name}</td>
                            <td scope="row" className='className="px-6 py-4'>{item.qty}</td>
                            <td scope="row" className='className="px-6 py-4'>{dayjs(item.createdAt).format('DD/MM/YYYY HH:mm')}</td>
                        </>
                    )}>

                    </TableBody>
                </table>
            </Modal>

            <Modal open={openModal} onClose={() => setOpenModal(false)} title={'ข้อมูลการขายออกจากสต็อกสินค้า'}>
                <table className='w-full text-left text-sm text-gray-500 dark:text-gray-400'>
                    <TableHeader>
                        <th scope='col' className='py-6 px-3'>barcode</th>
                        <th scope='col' className='py-6 px-3'>รายการ</th>
                        <th scope='col' className='py-6 px-3'>จำนวน</th>
                        <th scope='col' className='py-6 px-3'>วันที่</th>
                    </TableHeader>
                    <TableBody data={currentStockOut.bill_sale_details} onItem={(item) => (
                        <>
                            <td scope="row" className='className="px-6 py-4'>{item.product.barcode}</td>
                            <td scope="row" className='className="px-6 py-4'>{item.product.name}</td>
                            <td scope="row" className='className="px-6 py-4'>{item.qty}</td>
                            <td scope="row" className='className="px-6 py-4'>{dayjs(item.createdAt).format('DD/MM/YYYY HH:mm')}</td>
                        </>
                    )}>

                    </TableBody>
                </table>
            </Modal>


        </>
    )
}

export default ReportStock
