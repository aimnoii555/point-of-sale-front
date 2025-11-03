import React, { useEffect, useState } from 'react'
import MainContent from '../components/MainContent'
import Swal from 'sweetalert2'
import axios from 'axios'
import config from '../config'
import Modal from '../components/Modal'
import TableBody from '../components/TableBody'
import TableHeader from '../components/TableHeader'
import FilterHeader from '../components/FilterHeader'
import ResponseError from '../utils/ResponseError'

const Product = () => {
    const [product, setProduct] = useState({})
    const [products, setProducts] = useState([])
    const [openModal, setOpenModal] = useState(null)
    const [productImage, setProductImage] = useState({})
    const [productImages, setProductImages] = useState([])

    const openAddProduct = () => {
        setProduct({})
        setOpenModal('addProduct')
    }

    const openAddImage = (item) => {
        setProduct(item)
        fetchDataProductImage(item.id)
        setOpenModal('addImage')
    }
    const closeModal = () => setOpenModal(null)




    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = () => {
        try {
            axios.get(config.path + '/products/list', config.headers()).then((res) => {
                if (res.data.status) {
                    setProducts(res.data.data)
                }
            })
        } catch (error) {
            ResponseError(error.message)
        }
    }

    const handleSaveProduct = async (e) => {
        e.preventDefault()

        let url = '/product/insert';

        if (product.id !== undefined) {
            url = '/product/update'
        }

        try {
            axios.post(config.path + url, product, config.headers()).then((res) => {
                if (res.data.status) {
                    Swal.fire({
                        title: 'Success',
                        text: res.data.message + ' success',
                        icon: 'success'
                    })

                    setOpenModal(false)
                    fetchData()
                    setProduct({})
                }
            })
        } catch (error) {
            ResponseError(error.message)
        }
    }

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Delete?',
            text: 'Are you sure to delete?',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonColor: 'red',
            icon: 'question',
        }).then(async (e) => {
            if (e.isConfirmed) {
                try {
                    await axios.delete(config.path + '/product/delete/' + id, config.headers()).then((res) => {
                        if (res.data.status) {
                            Swal.fire({
                                title: 'Success',
                                text: res.data.message + ' success',
                                icon: 'success',
                            })

                            fetchData()
                        }
                    })
                } catch (error) {
                    ResponseError(error.message)
                }
            }
        })

    }



    const handleChangeFile = async (e) => {
        setProductImage(e.target.files[0])
    }



    const handleUploadFile = async () => {
        try {
            const configFile = {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem(config.token_name),
                    'Cotent-Type': 'multipart/form-data'
                }
            }
            const formData = new FormData();
            formData.append('file', productImage);
            formData.append('fileName', productImage.name)
            formData.append('product_id', product.id)

            await axios.post(config.path + '/product-image/insert', formData, configFile).then((res) => {
                if (res.data.status === true) {
                    Swal.fire({
                        title: 'Uploaded',
                        text: 'Uploaded File',
                        icon: 'success',
                        timer: 2000
                    })
                    fetchDataProductImage(product.id)
                    setProductImage({})
                    setOpenModal(false)
                }
            })
        } catch (error) {
            ResponseError(error.message)
        }
    }

    const fetchDataProductImage = async (id) => {
        try {
            const res = await axios.get(config.path + '/product-image/list/' + id, config.headers())
            if (res.data.status) {
                setProductImages(res.data.data)
            }
        } catch (error) {
            ResponseError(error.message)
        }
    }


    //  เมื่อคลิกเลือกภาพหลักใหม่
    const handleChooseMainImage = async (item) => {

        try {
            let url = config.path + '/product-image/choose-main-img/' + item.id + '/' + item.product_id
            const res = await axios.get(url, config.headers())

            if (res.data.status) {
                Swal.fire({
                    title: 'อัปเดตภาพหลักแล้ว',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                })
                await fetchDataProductImage(item.product_id)
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
                        <h2 className="text-xl font-semibold mb-2 dark:text-white">สินค้า</h2>
                        <button onClick={(e) => openAddProduct()} type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">เพิ่มสินค้า</button>
                    </div>
                    <hr className='my-3 border-gray-300 dark:border-gray-700' />


                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <FilterHeader></FilterHeader>
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <TableHeader>
                                <th scope="col" className="px-6 py-3">
                                    barcode
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    ชื่อสินค้า
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    ราคาทุน
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    ราคาจำหน่าย
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    รายเอียด
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </TableHeader>
                            <TableBody data={products}
                                onItem={(item) =>
                                    <>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {item.barcode}
                                        </th>
                                        <td className="px-6 py-4">
                                            {item.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item?.cost?.toLocaleString('TH-th')}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item?.price?.toLocaleString('TH-th')}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.detail}
                                        </td>
                                        <td className="px-6 py-4 flex ">

                                            <svg onClick={(e) => openAddImage(item)} className="cursor-pointer w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                <path fillRule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clipRule="evenodd" />
                                                <path fillRule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clipRule="evenodd" />
                                            </svg>
                                            <svg onClick={(e) => handleDelete(item.id)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeLinecap="1.5" stroke="currentColor" className="w-6 h-6 text-red-500 cursor-pointer ">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>

                                        </td>
                                    </>
                                }>

                            </TableBody>
                        </table>
                    </div>

                </div>

            </MainContent >


            <Modal open={openModal === 'addProduct'} onClose={(e) => closeModal()} title="เพิ่มสินค้า" >
                <form onSubmit={handleSaveProduct}>
                    <div className='grid grid-rows-3 grid-cols-2 gap-2'>
                        <div className="mb-4">
                            <label htmlFor="" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">barcode</label>
                            <input value={product.barcode} onChange={(e) => setProduct({ ...product, barcode: e.target.value })} type="text" id="" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ชื่อสินค้า</label>
                            <input value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} type="text" id="" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ราคาจำหน่าย</label>
                            <input value={product.price} onChange={(e) => setProduct({ ...product, price: e.target.value })} type="number" id="" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ราคาทุน</label>
                            <input value={product.cost} onChange={(e) => setProduct({ ...product, cost: e.target.value })} type="number" id="" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">รายเอียด</label>
                            <input value={product.detail} onChange={(e) => setProduct({ ...product, detail: e.target.value })} type="text" id="" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>
                    </div>

                    <button type="submit" className="mt-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">บันทึก</button>


                </form>
            </Modal>



            <Modal open={openModal === 'addImage'} onClose={(e) => closeModal()} title="เพิ่มรูปภาพสินค้า">
                <div>
                    <div className='flex flex-row gap-2'>
                        <div className='w-[30%]'>
                            <label>barcode</label>
                            <input onChange={(e) => setProduct({ ...product, barcode: e.target.value })} value={product.barcode} type="text" className="block w-full border border-gray-500 rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                        </div>
                        <div className='w-[70%]'>
                            <label>ชื่อสินค้า</label>
                            <input onChange={(e) => setProduct({ ...product, name: e.target.value })} value={product.name} type="text" className="block w-full border border-gray-500 rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                        </div>

                    </div>
                    <div className='mt-3'>
                        <label>รายเอียด</label>
                        <input onChange={(e) => setProduct({ ...product, detail: e.target.value })} value={product.detail} type="text" className="block w-full border border-gray-500 rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                    </div>
                    <div className='mt-3'>
                        <label>เลือกรุปภาพสินค้า</label>
                        <input onChange={(e) => handleChangeFile(e)} type="file" name='imageName' className="block w-full border border-gray-500 rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                    </div>

                    <button onClick={(e) => handleSaveProduct(e)} type="button" className="mt-5 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">แก้ไข</button>


                    <div className='mt-3'>
                        {
                            productImage.name !== undefined ? <div>

                                <button onClick={() => handleUploadFile()} type="submit" className="mt-5 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">บันทึกรูปภาพ</button>
                            </div> : null
                        }

                    </div>
                    <div className='mt-5'>
                        <hr />
                    </div>
                    <div className='mt-3 mb-5'>
                        <div className='text-lg text-inherit mb-5'>ภาพรวมสินค้า</div>
                        <div className='flex grid grid-cols-3 gap-3'>
                            {productImages.length > 0 &&
                                productImages.map((item, key) => (
                                    <div key={key} className='border border-400 p-3 rounded-lg'>
                                        <img
                                            src={config.path + '/uploads/' + item.image_path}
                                            width='100%'
                                            alt=''
                                        />
                                        <div className="flex items-center mt-4">
                                            <input
                                                type="checkbox"
                                                checked={item.isMain}
                                                onChange={() => handleChooseMainImage(item)} //  เมื่อเลือกใหม่จะ set mainImage ใหม่
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500"
                                            />
                                            <label className="ms-2 text-sm font-medium">
                                                ภาพหลัก
                                            </label>
                                        </div>
                                    </div>
                                ))}

                        </div>
                    </div>


                </div>
            </Modal>

        </>
    );
}

export default Product;


