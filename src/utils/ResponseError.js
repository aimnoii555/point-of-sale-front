import React from 'react'
import Swal from 'sweetalert2';

const ResponseError = (error) => {
    return Swal.fire({
        title: "เกิดข้อผิดพลาด",
        icon: "error",
        text: error
    });
}

export default ResponseError
