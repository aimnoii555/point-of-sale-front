import React from 'react'

const TableBody = (props) => {

    const { data = [], onItem } = props;

    return (
        <tbody>
            {
                data.length > 0 ? data.map((item, key) => (

                    <tr className="border-b dark:border-gray-700" key={key}>
                        {onItem?.(item, key)}
                    </tr>)) : null
            }

        </tbody>

    )
}

export default TableBody
