import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const ipaddress = import.meta.env.VITE_IPADDRESS;
// ---------------------------------- ทั้งหมด -----------------------------------------
// เข้าสู่ระบบสำหรับการประเมิน (ส่งไปหาระบบหลังบ้าน)
export const logins = async (emailornokid, password) => {
    try {
        const response = await axios.post(ipaddress + import.meta.env.VITE_LOGINUSER, { emailornokid: emailornokid, password: password });
        
        if (response.data.auth === false) {
            return response.data;
        } else {
            const token = response.data.token;
            const decoded = jwtDecode(token);
            localStorage.setItem(import.meta.env.VITE_TOKEN, token);
            return { auth: response.data.auth, EmployeeUserType: decoded.EmployeeUserType };
        }
    } catch (error) {
        console.error(error);
    }
}

// ออกจากระบบและเคลียร์ session ทุกอย่าง
export const logout = async () => {
    localStorage.removeItem(import.meta.env.VITE_TOKEN);
    window.location.href = '/';
}

// รับอีเมลจาก User เพื่อทำการส่ง Email ที่ทีหมายเลข OTP ไป (ส่งไปหาระบบหลังบ้าน)
export const sendemail = async (email) => {
    try {
        const response = await axios.post(ipaddress + import.meta.env.VITE_SENDEMAIL, { email: email });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ตรวจสอบหมายเลข OTP ที่ได้รับจาก User ว่าตรงกันหรือไม่ (ส่งไปหาระบบหลังบ้าน)
export const sendotp = async (emailornokid, otp) => {
    try {
        const response = await axios.post(ipaddress + import.meta.env.VITE_SENDOTP, { emailornokid: emailornokid, otp: otp });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// เปลี่ยนรหัสผ่านของ User ใหม่ ในกรณีที่ได้ OTP แล้วตรวจสอบ OTP ถูกต้อง (ส่งไปหาระบบหลังบ้าน)
export const createnewpassword = async (email, password) => {
    try {
        const response = await axios.post(ipaddress + import.meta.env.VITE_CREATENEWPASSWORD, { email: email, password: password });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ---------------------------------- User -----------------------------------------
// เช็ควันที่เปิด - ปิดการประเมิน
export const checkpms = async (evaluate) => {
    try {
        const response = await axios.post(ipaddress + import.meta.env.VITE_CHECK_PMS, { evaluate: evaluate });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ตรวจสอบว่า supervisor เป็น level อะไรเพื่อทำการตรวจเช็คเงื่อนไขของ event ได้
export const checksupervisor = async (supervisor) => {
    try {
        const response = await axios.post(ipaddress + import.meta.env.VITE_CHECK_SUPERVISOR, { supervisor: supervisor });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ดุเกณฑ์การประเมินในแต่ละ part และแต่ละ level
export const criteria = async (parttypeid, namefiles) => {
    try {
        const response = await axios.post(ipaddress + import.meta.env.VITE_CRITERIA, { parttypeid: parttypeid, namefiles: namefiles }, { responseType: 'blob' });
        return response.data;
    } catch (error) {
        console.error(error.response);
    }
}

// ดูข้อมูลของ Part ทั้งหมด
export const viewpart = async () => {
    try {
        const response = await axios.get(ipaddress + import.meta.env.VITE_PART);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ดูคะแนนการประเมินสำหรับ part1 และ part2
export const view_eval_part = async (part, employeecode, evaluatorcode) => {
    try {
        const response = await axios.post(ipaddress + import.meta.env.VITE_VIEW_EVAL_PART, { part: part, employeecode: employeecode, evaluatorcode: evaluatorcode });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// บันทึกการประเมิน
export const save_eval_part = async (data) => {
    try {
        const response = await axios.post(ipaddress + import.meta.env.VITE_SAVE_EVAL_PART, { data: data });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ดึงข้อมูลสำหรับการประเมินของหัวหน้าประเมินลูกน้อง
export const eval_score = async (supervisorcode, level, departmentid, page) => {
    try {
        const response = await axios.post(ipaddress + import.meta.env.VITE_VIEW_EVAL_SCORE, { supervisorcode: supervisorcode, level: level, departmentid: departmentid, page: page });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ---------------------------------- Admin -----------------------------------------
// ดึงข้อมูลแผนกทั้งหมด
export const department = async () => {
    try {
        const response = await axios.get(ipaddress + import.meta.env.VITE_GET_DEPARTMENT);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// เพิ่มข้อมูลพนักงาน
export const adduser = async (data) => {
    try {
        const response = await axios.post(ipaddress + import.meta.env.VITE_ADD_USER, data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// เพิ่มข้อมูลพนักงานแบบ CSV
export const addusercsv = async (data) => {
    try {
        const response = await axios.post(ipaddress + import.meta.env.VITE_ADD_USER_CSV, data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// แก้ไขข้อมูลพนักงาน
export const updateuser = async (data) => {
    try {
        const response = await axios.put(ipaddress + import.meta.env.VITE_UPDATE_USER, data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ดูข้อมูลของพนักงานทั้งหมดและสามารถค้นหา NOKID ได้
export const viewuser = async () => {
    try {
        const response = await axios.get(ipaddress + import.meta.env.VITE_VIEW_USER);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ดูข้อมูลของพนักงานทั้งหมดและสามารถค้นหา NOKID ได้
export const viewuserall = async () => {
    try {
        const response = await axios.get(ipaddress + import.meta.env.VITE_VIEW_USER_ALL);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ลบข้อมูลพนักงาน (ทำหมายเหตุไว้ แต่ข้อมูลยังอยู่)
export const deleteuser = async (id) => {
    try {
        const response = await axios.delete(ipaddress + import.meta.env.VITE_DELETE_USER, {params: { id: id }});
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ดูข้อมูลว่ามี Part ทั้งหมด
export const parttype = async () => {
    try {
        const response = await axios.get(ipaddress + import.meta.env.VITE_PART_TYPE);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// เปลี่ยนสถานะของ part นั้นว่าจะเปืดหรือปิดการประเมิน
export const changestatustype = async (part, statusname, status) => {
    try {
        const response = await axios.put(ipaddress + import.meta.env.VITE_CHANGE_STATUS_TYPE, { part: part, statusname: statusname, status: status });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// บันทึกไฟล์ลงไปยังเซิร์ฟเวอร์และบันทึกชื่อไฟล์ลงไปยังฐานข้อมูล
export const savefileeval = async (files) => {
    try {
        const response = await axios.post(ipaddress + import.meta.env.VITE_SAVE_FILE_EVAL, files);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ลบไฟล์ออกจากเซิร์ฟเวอร์และลบชื่อไฟล์ออกจากฐานข้อมูล
export const deletefileeval = async (parttypeid, namefiles, namefilescurrent) => {
    try {
        const response = await axios.delete(ipaddress + import.meta.env.VITE_DELETE_FILE_EVAL, {params: { parttypeid: parttypeid, namefiles: namefiles, namefilescurrent: namefilescurrent, originalname: null }});
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// เพิ่มข้อมูลการประเมินในกรณีที่ไม่มีข้อมูลการประเมินนี้อยู่ในฐานข้อมูล
export const add_eval = async (level, topic, weight, description, part) => {
    try {
        const response = await axios.post(ipaddress + import.meta.env.VITE_ADD_EVAL, { level: level, topic: topic, weight: weight, description: description, part: part });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// อัพเดทข้อมูลการประเมินในกรณีที่มีข้อมูลอยู่แล้ว
export const update_eval = async (id, topic, weight, description) => {
    try {
        const response = await axios.put(ipaddress + import.meta.env.VITE_UPDATE_EVAL, { id: id, topic: topic, weight: weight, description: description });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ลบข้อมูลการประเมินในกรณีที่มีอยู่ในฐานข้อมูล
export const delete_eval = async (id, part) => {
    try {
        const response = await axios.delete(ipaddress + import.meta.env.VITE_DELETE_EVAL, {params: { id: id, part: part }});
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ดูข้อมูลกิจกรรมทั้งหมด
export const view_event = async () => {
    try {
        const response = await axios.get(ipaddress + import.meta.env.VITE_VIEW_EVENT);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// เพิ่มข้อมูลกิจกรรม
export const add_event = async (topic, evaluate, description, startdate, enddate, statusdate) => {
    try {
        const response = await axios.post(ipaddress + import.meta.env.VITE_ADD_EVENT, { topic: topic, evaluate: evaluate, description: description, startdate: startdate, enddate: enddate, statusdate: statusdate });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// อัพเดทข้อมูลกิจกรรม
export const update_event = async (id, topic, evaluate, description, startdate, enddate, statusdate) => {
    try {
        const response = await axios.put(ipaddress + import.meta.env.VITE_UPDATE_EVENT, { id: id, topic: topic, evaluate: evaluate, description: description, startdate: startdate, enddate: enddate, statusdate: statusdate });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ลบข้อมูลการประเมินในกรณีที่มีอยู่ในฐานข้อมูล
export const delete_event = async (id) => {
    try {
        const response = await axios.delete(ipaddress + import.meta.env.VITE_DELETE_EVENT, {params: { id: id }});
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ดูการตั้งค่าอีเมลที่ต้องส่
export const viewemailservice = async () => {
    try {
        const response = await axios.get(ipaddress + import.meta.env.VITE_VIEW_EMAIL_SERVICE);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ทดสอบ Email Service
export const testemailservice = async (service, ipaddresses, checkuser, user, apppass, email, name, emailto, description) => {
    try {
        const response = await axios.post(ipaddress + import.meta.env.VITE_TEST_EMAIL_SERVICE, { service: service, ipaddress: ipaddresses, checkuser: checkuser, user: user, apppass: apppass, email: email, name: name, emailto: emailto, description: description });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// อัพเดทการตั้งต่าอีเมล
export const updateeamilservice = async (id, service, ipaddresses, checkuser, user, apppass, email, name) => {
    try {
        const response = await axios.put(ipaddress + import.meta.env.VITE_UPDATE_EMAIL_SERVICE, { id: id, service: service, ipaddress: ipaddresses, checkuser: checkuser, user: user, apppass: apppass, email: email, name: name });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// ดูการตั้งค่าการส่งข้อความด้วยอีเมล
export const configemail = async () => {
    try {
        const response = await axios.get(ipaddress + import.meta.env.VITE_VIEW_CONFIG_EMAIL);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// อัพเดทการตั้งต่าอีเมล
export const updateconfigemail = async (id, to, subject, description) => {
    try {
        const response = await axios.put(ipaddress + import.meta.env.VITE_UPDATE_CONFIG_EMAIL, { id: id, to: to, subject: subject, description: description });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}