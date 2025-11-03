import React, { useEffect, useState } from 'react'
import axios from 'axios'
import config from '../config'
import ResponseError from '../utils/ResponseError'
import TableHeader from '../components/TableHeader'
import TableBody from '../components/TableBody'

const LastBill = () => {
    const [lastBill, setLastBill] = useState([])

    useEffect(() => {
        fetchLastBill()
    }, [])

    const fetchLastBill = async () => {
        try {
            const res = await axios.get(config.path + '/bill/last-bill', config.headers())
            if (res.data.status) {
                setLastBill(res.data.data.bill_sale_details)
            }
        } catch (error) {
            ResponseError(error.message)
        }
    }

    return (
        <>

            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">

                <TableHeader>
                    <th scope="col" className="px-6 py-3">barcode</th>
                    <th scope="col" className="px-6 py-3">รายการ</th>
                    <th scope="col" className="px-6 py-3">ราคา </th>
                    <th scope="col" className="px-6 py-3">จำนวน</th>
                    <th scope="col" className="px-6 py-3">ยอดรวม</th>
                </TableHeader>

                <TableBody data={lastBill}
                    onItem={(item) => (
                        <>
                            <th scope="row" className="px-6 py-4">{item.product.barcode}</th>
                            <td className="px-6 py-4">{item.product.name}</td>
                            <td className="px-6 py-4">{(item.price).toLocaleString('TH-th')}</td>
                            <td className="px-6 py-4">{item.qty}</td>
                            <td className="px-6 py-4">{(item.qty * item.price).toLocaleString('TH-th')}</td>
                        </>
                    )}>

                </TableBody>
            </table>
        </>
    )
}

export default LastBill
