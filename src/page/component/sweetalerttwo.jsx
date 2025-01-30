// การนำเข้าและประกาศ Object ให้กับไฟล์สำหรับ Sweetalert2
import Swal from 'sweetalert2'

export const alertsmall = (icon, text) => {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    Toast.fire({
        icon: icon,
        title: text
    });
}

export const alertsuccessredirect = (text, link) => {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success m-2'
        },
        buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
        title: 'Succeed!',
        text: text,
        icon: 'success',
        confirmButtonText: 'ตกลง'
    }).then((result) => result.isConfirmed ?  window.location.href = link : null);
}

export const loading = async (message) => {
    // แสดง Loading Popup
    if (message === '' || message === undefined) {
        Swal.fire({
            title: 'Loading...',
            html: `
              <div class='spinner-border text-warning' role='status' style='width: 5rem; height: 5rem;'>
                <span class='visually-hidden'>Loading...</span>
              </div>
            `,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                const popup = Swal.getPopup();
                popup.style.height = '300px';
                popup.style.maxHeight = '80%'; // ป้องกันการล้น
            },
            scrollbarPadding: false,
        });
    }

    // ตรวจสอบข้อความตอบกลับ
    if (message === 'success') {
        // ปิด Popup Loading
        Swal.close();
    } else if (message === 'errorloadfilecsv') {
        Swal.close(); // ปิด Loading ก่อน
        Swal.fire({
            title: 'Error!',
            icon: 'error',
            html: 'Please select the correct file.',
        });
        setTimeout(() => Swal.close(), 2000);
    } else if (message === 'addusercsvsuccess') {
        Swal.close(); // ปิด Loading ก่อน
        Swal.fire({
            title: 'Register Success',
            icon: 'success',
        });
        setTimeout(() => window.location.href = '/manageuser', 1500);
    }
};

// loading สำหรับหน้า OTP
export const loadingotp = async (message) => {
    // แสดง Loading Popup
    Swal.fire({
        title: 'Loading...',
        html: `
          <div class='spinner-border text-warning' role='status' style='width: 5rem; height: 5rem;'>
            <span class='visually-hidden'>Loading...</span>
          </div>
        `,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            const popup = Swal.getPopup();
            popup.style.height = '300px';
            popup.style.maxHeight = '80%'; // ป้องกันการล้น
        },
        scrollbarPadding: false
    });

    // ตรวจสอบข้อความตอบกลับ
    if (message === 'success') {
        // เปลี่ยนข้อความและสถานะเป็น Success
        Swal.update({
            title: 'Success!',
            icon: 'success',
            html: 'OTP Verified successfully.',
        });

        // Redirect หลังจากแสดงข้อความสำเร็จ
        setTimeout(() => Swal.close(), 2000);
    }  
};

// ป๊อปอัพแจ้งเตือนว่าต้องการลบข้อมูลสมาชิกหรือไม่
export const alertyesornocanceluser = (delete_user, id) => {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success m-2',
          cancelButton: 'btn btn-danger m-2'
        },
        buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
        title: 'Do you want to remove this employee?',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'No',
        confirmButtonText: 'Yes'
    }).then((result) => result.isConfirmed ? delete_user(id) : null);
}

// ป๊อปอัพแจ้งเตือนว่าต้องการลบคำถามการประเมินหรือไม่
export const alertdeleteeval = (delete_eval, id, level) => {
    Swal.fire({
        title: 'Are you sure?',
        text: `You won't be able to revert this!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
        if (result.isConfirmed) {
            const results = await delete_eval(id, level);
            results === 'success' ? alertsmall('success', 'Remove Topic Success') : null;
        }
    });
}

// ป๊อปอัพแจ้งเตือนว่าต้องการลบคำถามการประเมินหรือไม่
export const alertdeleteevent = (remove_event, id) => {
    Swal.fire({
        title: 'Are you sure?',
        text: `You won't be able to revert this!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
        if (result.isConfirmed) {
            remove_event(id);
            
        }
    });
}

// เมื่อออกจากระบบ
export const alertlogout = (logout) => {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success m-2',
          cancelButton: 'btn btn-danger m-2'
        },
        buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
        title: 'Log out or not?',
        text: 'Do you want to log out?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Logout',
        cancelButtonText: 'Cancel'
    }).then((result) => result.isConfirmed ? logout() : null);
}

// ป๊อปอัพแจ้งเตือนว่าต้องการลบคำถามการประเมินหรือไม่
export const alertdeletefile = (fnc, id, filename) => {
    Swal.fire({
        title: 'Are you sure?',
        text: `You won't be able to revert this!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => result.isConfirmed ? fnc(id, filename) : null);
}