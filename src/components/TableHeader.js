import React from 'react'

const TableHeader = (props) => {
    return (

        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-neutral-800 dark:text-gray-400">
            <tr>
                {props.children}
            </tr>
        </thead>


    )
}

export default TableHeader
