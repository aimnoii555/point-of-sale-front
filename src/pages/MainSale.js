import React, { useEffect, useState } from 'react'
import config from '../config';
import Modal from '../components/Modal';
import axios from 'axios';
import ResponseError from '../utils/ResponseError';
import Swal from 'sweetalert2';

const MainSale = () => {

    const [products, setProducts] = useState([]);
    const [bill, setBill] = useState([]);
    const [currentBill, setCurrentBill] = useState({})
    const [totalPrice, setTotalPrice] = useState(0)
    const [openModal, setOpenModal] = useState(null)
    const [item, setItem] = useState({})
    const [inputMoney, setInputMoney] = useState(0)


    useEffect(() => {

        fetchData()
        fetchBill()
        fetchBillSaleDetail()

    }, [])

    const fetchBillSaleDetail = async () => {
        try {
            const res = await axios.get(config.path + '/bill/current-bill', config.headers())
            if (res.data.status) {
                setCurrentBill(res.data.data)
                sumTotalPrice(res.data.data);
            }
        } catch (error) {
            ResponseError(error.message)
        }
    }

    const sumTotalPrice = (bill) => {

        let sum = 0;

        if (bill && bill.bill_sale_details) {
            for (let i = 0; i < bill.bill_sale_details.length; i++) {
                const item = bill.bill_sale_details[i]
                const qty = parseInt(item.qty);

                sum += (qty * item.price)
            }

            setTotalPrice(sum)
        }

    }

    const fetchBill = async () => {
        try {
            const header = config.headers()
            const res = await axios.get(config.path + '/bill/open-bill', header)

            if (res.data.status) {
                setBill(res.data.data)
            }
        } catch (error) {
            ResponseError(error.message)
        }
    }

    const fetchData = async () => {
        try {
            const res = await axios.get(config.path + '/product/list-for-sale', config.headers())
            if (res.data.status) {
                setProducts(res.data.data)
            }
        } catch (error) {
            ResponseError(error.message)
        }
    }



    const handleDelete = async (item) => {
        try {
            const res = await axios.delete(config.path + '/bill/delete/' + item.id, config.headers())
            if (res.data.status) {
                fetchBillSaleDetail()
            }
        } catch (error) {
            ResponseError(error.message)
        }
    }

    const handleUpdateQty = async () => {
        try {
            const res = await axios.put(config.path + '/bill/update-qty', item, config.headers())
            if (res.data.status) {
                fetchBillSaleDetail()
                setOpenModal(false)
            }
        } catch (error) {
            ResponseError(error.message)

        }
    }



    const handleEndSale = () => {
        Swal.fire({
            title: 'จบการขาย',
            text: 'ยืนยันจบการขายหรือไม่?',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true,
        }).then(async (e) => {
            if (e.isConfirmed) {
                try {
                    const res = await axios.get(config.path + '/bill/end-sale', config.headers())
                    if (res.data.status) {
                        Swal.fire({
                            title: 'Success',
                            text: 'Successfully',
                            icon: 'success',
                            timer: 2000
                        })

                        fetchBill()
                        fetchBillSaleDetail()
                        setOpenModal(false)
                    }
                } catch (error) {
                    ResponseError(error.mesage)
                }
            }
        })
    }

    const handleSave = async (item) => {
        try {
            const res = await axios.post(config.path + '/bill/sale', item, config.headers())
            if (res.data.status) {
                fetchBillSaleDetail()
            }
        } catch (error) {
            ResponseError(error.mesage)
        }
    }

    return (

        <>
            <div className='text-end mb-1'>
                <button type="button" onClick={() => setOpenModal('endsale')} class="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">จบการขาย</button>
            </div>
            <div className='flex min-h-screen gap-2'>

                <div className='w-[75%]'>
                    <div className="grid grid-cols-6 md:grid-cols-6 gap-2">
                        {
                            products.length > 0 ? products.map((item) => (
                                <>
                                    <div key={item.id}>
                                        <div onClick={(e) => handleSave(item)} className='max-w-sm p-3 bg-white border border-gray-200 rounded-lg cursor-pointer shadow-sm dark:bg-neutral-800 dark:border-gray-700'>
                                            <img className="rounded-lg h-48 w-96 object-cover mb-5" src={config.path + '/uploads/' + item.product_images[0].image_path} alt="" />
                                            <h3 className="mb-3 font-normal text-lg text-gray-700 dark:text-gray-400">{item.name}</h3>
                                            <p className='font-normal text-sm'>{item.price?.toLocaleString('TH-th')}</p>
                                        </div>

                                    </div>
                                </>)) : null
                        }

                    </div>
                </div>

                <div className="bg-neutral-800 w-[25%] self-stretch border border-gray-700 rounded-lg p-4 flex flex-col">

                    {/* สรุปรวมด้านล่าง */}
                    <div className="border-b border-gray-700 pb-3 mb-3">
                        <div className="flex justify-between items-center text-white font-semibold text-lg">
                            <span>รวมทั้งหมด</span>
                            <span className="text-emerald-400">
                                {currentBill?.bill_sale_details?.reduce(
                                    (sum, i) => sum + i.qty * i.price,
                                    0
                                ).toLocaleString('TH-th') || 0}{' '}
                                ฿
                            </span>
                        </div>
                    </div>



                    <div className="flex-1 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                        {currentBill?.bill_sale_details?.length > 0 ? (
                            currentBill.bill_sale_details.map((item, key) => (
                                <div
                                    key={key}
                                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-700 bg-neutral-900 hover:bg-neutral-700/80 transition-all duration-200 shadow-sm"
                                >
                                    {/* ภาพสินค้า */}
                                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-gray-600">
                                        <img
                                            src={config.path + '/uploads/' + item.product.product_images[0].image_path}
                                            alt={item.product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* รายละเอียดสินค้า */}
                                    <div className="flex flex-col flex-1">
                                        <div className="text-gray-100 font-medium truncate">{item.product.name}</div>
                                        <div className="text-gray-400 text-sm mt-0.5">
                                            {item.qty} × {item.price?.toLocaleString('TH-th')}
                                        </div>
                                        <div className="text-emerald-400 font-semibold text-sm mt-1">
                                            = {(item.qty * item.price).toLocaleString('TH-th')} ฿
                                        </div>
                                    </div>

                                    {/* ปุ่มแก้ไข / ลบ */}
                                    <div className="flex flex-col gap-1">
                                        <button
                                            onClick={(e) => {
                                                setItem(item);
                                                setOpenModal('edit')
                                            }}
                                            className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-all"
                                            title="แก้ไข"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-4 h-4 text-white"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15.232 5.232l3.536 3.536M16.5 3.5a2.121 2.121 0 013 3L7.5 18H4v-3.5L16.5 3.5z"
                                                />
                                            </svg>
                                        </button>

                                        <button
                                            onClick={(e) => handleDelete(item)}
                                            className="p-2 rounded-full bg-red-600 hover:bg-red-700 transition-all"
                                            title="ลบ"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-4 h-4 text-white"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-500 text-center py-10 border border-dashed border-gray-600 rounded-lg">
                                ไม่มีสินค้าในบิล
                            </div>
                        )}
                    </div>


                </div>
            </div>

            <Modal open={openModal === 'edit'} onClose={(e) => setOpenModal(null)} title='แก้ไขจำนวน'>
                <div>
                    <input onChange={(e) => setItem({ ...item, qty: e.target.value })} value={item.qty} type="text" aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    <button onClick={(e) => handleUpdateQty()} type="button" class="mt-5 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">ตกลง</button>
                </div>
            </Modal>


            <Modal open={openModal === 'endsale'} onClose={(e) => setOpenModal(null)} title={'จบการขาย'}>
                <div>

                    <form className="max-w-sm mx-auto">
                        <div className="mb-5">
                            <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ยอดเงินทั้งหมด</label>
                            <input disabled type="text" value={totalPrice.toLocaleString('TH-th')} className="text-end bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>
                        <div className="mb-5">
                            <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">รับเงิน</label>
                            <input value={inputMoney.toLocaleString('TH-th')} onChange={(e) => setInputMoney(e.target.value)} type="number" className="text-end bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>
                        <div className="mb-5">
                            <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">เงินทอน</label>
                            <input type="number" value={(totalPrice - inputMoney).toLocaleString('Th-th')} disabled className="text-end bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>

                        <button type="button" onClick={(e) => setInputMoney(totalPrice)} class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">จ่ายพอดี</button>
                        <button onClick={(e) => handleEndSale()} type="button" class="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-900">จบการขาย</button>

                    </form>
                </div>
            </Modal>
        </>

    )
}

export default MainSale
