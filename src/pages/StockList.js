import React, { useEffect, useState } from 'react'
import ResponseError from '../utils/ResponseError'
import axios from 'axios'
import config from '../config'
import TableHeader from '../components/TableHeader'
import TableBody from '../components/TableBody'
import * as dayjs from 'dayjs'
import Swal from 'sweetalert2'

const StockList = () => {
    const [stocks, setStocks] = useState([])

    useEffect(() => {
        fetchStockList()
    }, [])

    const fetchStockList = async () => {
        try {
            const res = await axios.get(config.path + '/stock/list', config.headers())
            if (res.data.status) {
                setStocks(res.data.data)
            }
        } catch (error) {
            ResponseError(error.message)
        }
    }

    const handleDelete = (id) => {
        try {
            Swal.fire({
                title: 'Delete',
                text: 'Are you sure to delete?',
                icon: 'question',
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonColor: 'red'
            }).then(async (e) => {
                if (e.isConfirmed) {

                    const res = await axios.delete(config.path + '/stock/delete/' + id, config.headers())
                    if (res.data.status) {
                        Swal.fire({
                            title: 'Success',
                            text: 'Deleted',
                            icon: 'success',
                            timer: 2000
                        })
                    }

                    fetchStockList()
                }
            })
        } catch (error) {
            ResponseError(error.message)
        }
    }

    return (
        <>
            <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                <TableHeader>
                    <th scope='col' className='py-4 px-6'>Barcode</th>
                    <th scope='col' className='py-4 px-6'>รายการ</th>
                    <th scope='col' className='py-4 px-6'>จำนวน</th>
                    <th scope='col' className='py-4 px-6'>วันที่</th>
                    <th scope='col' className='py-4 px-6'>

                    </th>


                </TableHeader>
                <TableBody data={stocks} onItem={(item) => (
                    <>
                        <th scope="row" className="px-6 py-4">{item.product.barcode}</th>
                        <th scope="row" className="px-6 py-4">{item.product.name}</th>
                        <th scope="row" className="px-6 py-4">{item.qty}</th>
                        <th scope="row" className="px-6 py-4">{dayjs(item.createdAt).format('DD/MM/YYYY HH:mm')}</th>
                        <th scope="row" className="px-6 py-4">
                            <button onClick={() => handleDelete(item.id)} type="button" class="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">ลบ</button>
                        </th>




                    </>
                )}>

                </TableBody>
            </table>
        </>
    )
}

export default StockList
