import { useEffect, useState } from "react"
import axios from "axios"
import config from "../config"
import ResponseError from "../utils/ResponseError"
import TableHeader from "../components/TableHeader"
import TableBody from "../components/TableBody"
import * as dayjs from 'dayjs'
import Modal from "../components/Modal"

const BillToday = () => {

  const [billToday, setBillToday] = useState([])
  const [openModal, setOpenModal] = useState(null)
  const [selectedBill, setSelectedBill] = useState({})

  useEffect(() => {
    handleBillToday();
  }, [])

  const handleBillToday = async () => {
    try {
      const res = await axios.get(config.path + '/bill/bill-today', config.headers())
      if (res.data.status) {
        setBillToday(res.data.data)
      }
    } catch (error) {
      ResponseError(error.message)

    }
  }

  return (
    <>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <TableHeader>
          <th className='w-[50%] px-6 py-3'>เลขบิล</th>
          <th className='w-[25%] px-6 py-3'>วันเวลาที่ขาย</th>
          <th className='w-[25%] px-6 py-3'>รายละเอียด</th>


        </TableHeader>
        <TableBody data={billToday}
          onItem={(item) => (
            <>
              <th scope="row" className="px-6 py-4 text-start">{item.id}</th>
              <td className="px-6 py-4 text-start">{dayjs(item.createdAt).format('DD/MM/YYYY HH:mm')}</td>
              <td>
                <button onClick={() => { setSelectedBill(item); setOpenModal('detail'); }} type="button" className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">รายละเอียด</button>
              </td>
            </>
          )}>
        </TableBody>
      </table>
      <Modal open={openModal === 'detail'} onClose={() => setOpenModal(false)} title={'รายละเอียด'}>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <TableHeader>

            <th className='w-[20%] px-6 py-3'>barcode</th>
            <th className='w-[20%] px-6 py-3'>รายการ</th>
            <th className='w-[20%] px-6 py-3'>ราคา</th>
            <th className='w-[20%] px-6 py-3'>จำนวน</th>
            <th className='w-[20%] px-6 py-3'>ยอดรวม</th>
          </TableHeader>
          <TableBody data={selectedBill.bill_sale_details}
            onItem={(item) => {
              return (<>
                <th scope="row" className="px-6 py-4">{item.product.barcode}</th>
                <td className="px-6 py-4">{item.product.name}</td>
                <td className="px-6 py-4">{item.price}</td>
                <td className="px-6 py-4">{item.qty}</td>
                <td className="px-6 py-4">{item.price * item.qty}</td>

              </>)
            }}>


          </TableBody>
        </table >
      </Modal>
    </>
  )
}

export default BillToday
