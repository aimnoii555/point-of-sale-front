import React, { useEffect, useState } from 'react'
import MainContent from '../components/MainContent'
import FilterHeader from '../components/FilterHeader'
import LastBill from './LastBill'
import BillToday from './BillToday'
import MainSale from './MainSale'
import PrintJS from 'print-js'
import ResponseError from '../utils/ResponseError'
import config from '../config'
import axios from 'axios'
import * as dayjs from 'dayjs'

const Sale = () => {



    const [btnAction, setBtnAction] = useState(1)
    const [isPrint, setIsPrint] = useState(false)
    const [memberInfo, setMemberInfo] = useState({})
    const [lastBillInfo, setLastBillInfo] = useState({})
    const [sumTotal, setSumTotal] = useState(0)

    const categoriesBill = [
        { id: 1, name: 'ขายสินค้า', component: <MainSale /> },
        { id: 2, name: 'บิลล่าสุด', component: <LastBill /> },
        { id: 3, name: 'บิลวันนี้', component: <BillToday /> },
    ]

    const actionComponent = categoriesBill.find(c => c.id === btnAction).component ?? null;

    const fetchInfo = async () => {
        try {
            const res = await axios.get(config.path + '/member/info', config.headers())
            if (res.data.status) {
                setMemberInfo(res.data.data)
            }
        } catch (error) {
            ResponseError(error.message)
        }
    }

    const fetchLastBill = async () => {
        try {
            const res = await axios.get(config.path + '/bill/last-bill', config.headers())
            if (res.data.status) {
                setLastBillInfo(res.data.data)

                let sum = 0;

                if (res.data.data.bill_sale_details.length > 0) {
                    const data = res.data.data.bill_sale_details;
                    for (let i = 0; i < data.length; i++) {
                        const item = data[i];

                        sum += (parseInt(item.qty) * parseFloat(item.price))

                    }

                    setSumTotal(sum)
                }


            }
        } catch (error) {
            ResponseError(error.message)
        }
    }

    const handlePrint = async () => {
        try {
            await fetchLastBill();
            await fetchInfo();

        } catch (error) {
            ResponseError(error.message)
        }
    }

    useEffect(() => {


        if (
            isPrint &&
            lastBillInfo &&
            lastBillInfo.id &&
            memberInfo &&
            memberInfo.name
        ) {
            PrintJS({
                printable: 'slip',
                maxWidth: 400,
                type: 'html',
                onPrintDialogClose: () => setIsPrint(false),
            })
        }

    }, [isPrint, memberInfo, lastBillInfo])

    return (
        <>
            <MainContent>
                <div className="min-h-screen rounded-lg shadow-md p-4 bg-neutral-900 dark:text-gray-200 m-2 border border-gray-800">
                    <div className=''>
                        <h2 className="text-xl font-semibold mb-2 dark:text-white">ขายสินค้า</h2>
                    </div>
                    <div className='flex items-center justify-end'>
                        <div className='flex gap-2'>
                            {categoriesBill.map((item) => {
                                const isActive = btnAction === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() =>
                                            setBtnAction(item.id)
                                        }

                                        className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-all",
                                            ${isActive ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/30" : "bg-white text-gray-900 border-gray-200 hover:bg-gray-100 hover:text-white-700 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"}
                                            `}
                                    >
                                        {item.name}
                                    </button>
                                );
                            })}
                            <button onClick={() => { handlePrint(); setIsPrint(true) }} type="button" class="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">พิมพ์บิลล่าสุด</button>
                        </div>

                    </div>
                    <hr className='my-3 border-gray-300 dark:border-gray-700' />


                    <div className='flex justify-between w-full'>
                        <FilterHeader></FilterHeader>
                    </div>
                    {
                        actionComponent
                    }
                </div>

            </MainContent >

            {
                isPrint ? <div>
                    <div id="slip">
                        <div>length : {lastBillInfo.length}</div>
                        <div>เลขบิล: {lastBillInfo.id}</div>
                        <div><img width={100} src='https://deekrub.com/static/media/logo.6ce24c58023cc2f8fd88fe9d219db6c6.svg' /></div>
                        <div>ใบเสร็จรับเงิน</div>
                        <div ><strong className='flex items-center justify-center w-48' >{memberInfo.name}</strong></div>
                        <div>ผู้ขาย : xxx</div>
                        <span>----------------------------------------------------------------------</span>
                        <table width="100%">
                            <tbody>
                                {
                                    lastBillInfo?.bill_sale_details?.length > 0 ? lastBillInfo?.bill_sale_details.map((item) => (
                                        <tr>
                                            <td>{item.product.name}</td>
                                            <td>{item.qty} </td>
                                            <td>{item.price.toLocaleString()} </td>
                                            <td>{(item.price * item.qty).toLocaleString()} </td>
                                        </tr>
                                    )) : null
                                }


                            </tbody>
                        </table>



                        <span>----------------------------------------------------------------------</span>
                        <div>ยอดรวม : {sumTotal.toLocaleString()} บาท</div>
                        <div className='text-sm'>{dayjs(lastBillInfo.createdAt).format("DD/MM/YYYY HH:mm")}</div>
                    </div>
                </div> : null
            }


        </>
    )
}



export default Sale
