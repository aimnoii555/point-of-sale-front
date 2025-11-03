import axios from "axios"
import { useState } from "react"
import config from "../config"
import ResponseError from "../utils/ResponseError"
import Swal from "sweetalert2"
import Modal from "../components/Modal"
import TableHeader from "../components/TableHeader"
import TableBody from "../components/TableBody"


const AddStock = () => {
    const [products, setProducts] = useState([])
    const [openModal, setOpenModal] = useState(false)
    const [productName, setProductName] = useState('')
    const [qty, setQty] = useState(1)
    const [productId, setProductId] = useState(0)



    const fetchProduct = async () => {
        try {
            const res = await axios.get(config.path + '/products/list', config.headers())

            if (res.data.status) {
                setProducts(res.data.data)
            }
        } catch (error) {
            ResponseError(error.message)
        }
    }

    const handleSetProductName = (item) => {
        setProductName(item.name)
        setProductId(item.id)
        setOpenModal(false)
    }

    const handleSaveStock = async () => {
        try {
            const payload = {
                product_id: productId,
                qty
            }
            const res = await axios.post(config.path + '/stock/save', payload, config.headers())
            if (res.data.status) {
                Swal.fire({
                    title: 'Success',
                    text: 'Saved',
                    icon: 'success',
                    timer: 2000
                })

                setProductName('')
                setQty(1)
                setQty(0)
            }
        } catch (error) {
            ResponseError(error.message)
        }
    }



    return (
        <>
            <div className="max-w-3xl mx-auto bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md mt-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                    เพิ่มสต็อกสินค้า
                </h2>

                {/* ค้นหาสินค้า */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex w-full">
                        <input
                            readOnly
                            value={productName}
                            type="text"
                            placeholder="ค้นหาชื่อหรือรหัสสินค้า..."
                            className="w-full rounded-l-md bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        <button
                            onClick={() => { fetchProduct(); setOpenModal('select-product') }}
                            type="button"
                            className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-medium rounded-r-md text-sm px-5 py-2.5"
                        >
                            ค้นหา
                        </button>
                    </div>
                </div>

                {/* ฟอร์มรายละเอียดการเพิ่มสต็อก */}
                <div className="space-y-4">


                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            จำนวนที่ต้องการเพิ่ม
                        </label>
                        <input
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                            type="number"
                            min="1"
                            placeholder="ระบุจำนวน"
                            className="w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={() => handleSaveStock()}
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-md text-sm px-6 py-2.5"
                        >
                            เพิ่มสต็อก
                        </button>
                    </div>
                </div>
            </div>
            <Modal open={openModal === 'select-product'} onClose={() => setOpenModal(false)} title={'เลือกสินค้า'}>
                <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                    <TableHeader>

                        <th scope='row' className='px-6 py-3 w-[20%]'>barcode</th>
                        <th scope='row' className='px-6 py-3 w-[60%]'>รายการ</th>
                        <th scope='row' className='px-6 py-3 w-[20%]'>Action</th>



                    </TableHeader>
                    <TableBody data={products} onItem={(item) => (
                        <>
                            <th scope='row' className='py-4 px-6'>{item.barcode}</th>
                            <th scope='row' className='py-4 px-6'>{item.name}</th>
                            <th scope='row' className='py-4 px-6'>
                                <button onClick={() => handleSetProductName(item)} type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">เลือก</button>
                            </th>
                        </>

                    )}>

                    </TableBody>
                </table>
            </Modal>
        </>


    )
}

export default AddStock
