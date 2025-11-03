import React, { useEffect, useState } from 'react'
import MainContent from '../components/MainContent'
import FilterHeader from '../components/FilterHeader'
import LastBill from './LastBill'
import BillToday from './BillToday'
import MainSale from './MainSale'

const Sale = () => {



    const [btnAction, setBtnAction] = useState(1)

    const categoriesBill = [
        { id: 1, name: 'ขายสินค้า', component: <MainSale /> },
        { id: 2, name: 'บิลล่าสุด', component: <LastBill /> },
        { id: 3, name: 'บิลวันนี้', component: <BillToday /> },
    ]

    const actionComponent = categoriesBill.find(c => c.id === btnAction).component ?? null;




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

        </>
    )
}



export default Sale
