import React, { useState } from 'react'
import MainContent from '../components/MainContent'
import Card from '../components/Card'
import StockList from './StockList'
import AddStock from './AddStock'

const Stock = () => {

    const [btnSelect, setBtnSelect] = useState(1)


    const stockPage = [
        { id: 1, name: 'เพิ่มสต็อกสินค้า', components: <AddStock /> },
        { id: 2, name: 'รายการสต็อก', components: <StockList /> }
    ]

    const actionComponent = stockPage.find(p => p.id === btnSelect) ?? null

    return (
        <>
            <MainContent>

                <Card title="สต็อกสินค้า">
                    <div className='mb-3'>
                        {
                            stockPage.map((name) => {
                                return <button onClick={() => setBtnSelect(name.id)} type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">{name.name}</button>
                            })
                        }
                    </div>
                    {actionComponent.components}

                </Card>
            </MainContent>

        </>
    )

}





export default Stock
