import React from 'react'

const Card = (props) => {
    return (
        <div className="rounded-lg shadow-md p-4 bg-neutral-900 dark:text-gray-200 m-2 border border-gray-800">
            <div className='flex items-center justify-between'>
                <h2 className="text-xl font-semibold mb-2 dark:text-white">{props.title}</h2>
                {/* <button onClick={(e) => openAddProduct()} type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">เพิ่มสินค้า</button> */}
            </div>
            <hr className='my-3 border-gray-300 dark:border-gray-700' />
            {props.children}
        </div>
    )
}

export default Card
