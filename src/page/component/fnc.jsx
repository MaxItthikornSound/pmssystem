// เปลี่ยน format จาก 2024-11-11 เป็น 11 November 2024
export const formatdatefull = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', });

// ฟังก์ชันสำหรับตรวจสอบว่าอีเมลถูกต้องหรือไม่
export const validateEmail = (email) => {
    // รูปแบบ Regular Expression สำหรับอีเมล
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
};

// ให้สามารถพิมพ์ได้คั้งแต่ A-Z, a-z, 0-9, _, - (พิมพ์ภาษาไทยไม่ได้)
export const checkfilterenglish = (event) => {
    const inputid = event.target.id;
    const inputvalue = event.target.value;
    const filtervalue = inputvalue.replace(/[^A-Za-z0-9@#$&_-]/g, '');
    document.getElementById(inputid).value = filtervalue;
}

// ให้สามารถพิมพ์ได้คั้งแต่ A-Z, a-z, 0-9, _, -, เว้นวรรค (พิมพ์ภาษาไทยไม่ได้) สำหรับต้องมีการเว้นวรรค
export const checkfilterenglishspace = (event) => {
    const inputid = event.target.id;
    const inputvalue = event.target.value;
    const filtervalue = inputvalue.replace(/[^A-Za-z0-9@#$& _-]/g, '');
    document.getElementById(inputid).value = filtervalue;
}

// ให้สามารถพิมพ์ได้คั้งแต่ A-Z, a-z, 0-9, _, -, @, . (พิมพ์ภาษาไทยไม่ได้) สำหรับ Email
export const checkfilteremail = (event) => {
    const inputid = event.target.id;
    const inputvalue = event.target.value;
    const filtervalue = inputvalue.replace(/[^A-Za-z0-9@._-]/g, '');
    document.getElementById(inputid).value = filtervalue;
}

// ให้สามารถพิมพ์ได้คั้งแต่ A-Z, a-z, 0-9, _, -, :, . (พิมพ์ภาษาไทยไม่ได้) สำหรับ IPAddress และ Port
export const checkfilteripaddress = (event) => {
    const inputid = event.target.id;
    const inputvalue = event.target.value;
    const filtervalue = inputvalue.replace(/[^A-Za-z0-9:._-]/g, '');
    document.getElementById(inputid).value = filtervalue;
}

// ให้สามารถพิมพ์ได้เฉพาะ 0-9 (พิมพ์ได้แค่ตัวเลข เหมาะสำหรับการเข้าสู่ระบบ)
export const checkfilternumber = (event) => {
    const inputid = event.target.id;
    const inputvalue = event.target.value;
    const filtervalue = inputvalue.replace(/[^0-9*]/g, '');
    document.getElementById(inputid).value = filtervalue;
    return filtervalue;
}

// เงื่อนไข: ต้องมีตัวอักษร (a-z, A-Z) และตัวเลข (0-9)
export const validatePassword = (password) => {
    const regex = /^(?=.*[a-zA-Z])(?=.*\d).+$/;
    return regex.test(password);
}