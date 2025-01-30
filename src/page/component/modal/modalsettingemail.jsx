// การนำเข้าและประกาศ Object เมื่อนำมาใช้งานของ Framework สำหรับ React
import { useEffect, useState } from 'react'
import Select from 'react-select';

// การนำเข้าและประกาศ Object ให้กับไฟล์สำหรับ React Bootstrap 5
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

// การนำเข้าหน้า Page เพื่อ Link ไปหน้าถัดไป และการ Include ไฟล์เสริมที่เราสร้างขึ้นมา
import { viewemailservice, testemailservice, updateeamilservice } from '../connectdatabase';
import { validateEmail, checkfilteremail, checkfilteripaddress, checkfilterenglishspace } from '../fnc';
import { alertsmall } from '../sweetalerttwo';

const Modalsettingemail = ({ show, onHide }) => {
    useEffect(() => {
        get_database();
    }, []);

    // ดึงข้อมูลการตั้งค่าสำหรับการทำ Email Service
    const [ID, setID] = useState('');
    const [Service, setService] = useState({});
    const [IPAddress, setIPAddress] = useState('');
    const [Checkeds, setCheckeds] = useState(false);
    const [User, setUser] = useState('');
    const [Apppass, setApppass] = useState('');
    const [Email, setEmail] = useState('');
    const [Name, setName] = useState('');
    const get_database = async () => {
        const data_viewemailservice = await viewemailservice();
        setID(data_viewemailservice[0].SettingsID)
        setService({ value: data_viewemailservice[0].SettingsEmailService, label: data_viewemailservice[0].SettingsEmailService });
        setIPAddress(data_viewemailservice[0].SettingsEmailIPAddress)
        setCheckeds(data_viewemailservice[0].SettingsEmailCheckUser);
        setUser(data_viewemailservice[0].SettingsEmailUser);
        setApppass(data_viewemailservice[0].SettingsEmailApppass);
        setEmail(data_viewemailservice[0].SettingsEmailAddress);
        setName(data_viewemailservice[0].SettingsEmailName);
    }

    const Options = [{ value: 'Gmail', label: 'Gmail' }, { value: 'Yahoo', label: 'Yahoo' }, { value: 'Outlook', label: 'Outlook' }, { value: 'Other', label: 'Other' }];

    // เมื่อข้อมูลมีค่าว่างให้ทำการใส่กรอบสีแดงเพื่อให้รู้ว่ามีค่าว่างอยู่
    const checkvaluenull = (type, value) => {
        const element = document.getElementById(type);
        value === false ? element.style.border = '2px solid red' : element.style.border = '1px solid rgb(222, 226, 230)';
    }

    // ตรวจเช็คข้อมูลขณะข้อมูลมีการเปลี่ยนแปลงใน Input และ Select
    const txtonchange = (event) => {
        if (event) {
            if (!event.target) {
                setService(event);
                checkvaluenull('service', true); 
            } else {
                if (event.target.value) {
                    if (event.target.id === 'email') {
                        validateEmail(event.target.value) ? checkvaluenull(event.target.id, true) : checkvaluenull(event.target.id, false);
                    } else {
                        checkvaluenull(event.target.id, true);
                    }
                } else {
                    checkvaluenull(event.target.id, false);
                }
            }
        } else {
            setService(event);
            checkvaluenull('service', false);
        }
    }

    // ปิด modal พร้อมนำข้อมูลจาก database มาโชว์เหมือนเดิม
    const closemodal = () => {
        get_database();
        onHide();
    }

    // ทดสอบ Email Service
    const test_emailservice = async () => {
        const check = document.getElementById('checkboxuser');
        const email = document.getElementById('email');
        const ipaddress = document.getElementById('ipaddress');
        const name = document.getElementById('name');
        const emailto = document.getElementById('emailto');
        const message = document.getElementById('message');
        if (!email.value || !validateEmail(email.value) || !name.value || !emailto.value || !message.value) {
            alertsmall('warning', 'Found a blank value.');
        } else if (Service.value === 'Other' && !ipaddress.value) {
            alertsmall('warning', 'Found a blank value.');
        } else {
            const test_result = await testemailservice(Service.value, IPAddress, check.checked, User, Apppass, Email, Name, emailto.value, message.value);
            test_result === 'success' ? alertsmall('success', 'This service can be used.') : alertsmall('error', 'An error occurred. Please try again. (There may be incorrect information)');
        }
    }

    // อัพเดทข้อมูล Email Service
    const update_emailservice = async () => {
        const check = document.getElementById('checkboxuser');
        const user = document.getElementById('user');
        const email = document.getElementById('email');
        const name = document.getElementById('name');
        if ((!check.checked && !user.value) || !email.value || !validateEmail(email.value) || !name.value) {
            !user.value ? checkvaluenull('user', false) : checkvaluenull('user', true);
            !email ? checkvaluenull('email', false) : validateEmail(email.value) ? checkvaluenull('email', true) : checkvaluenull('email', false)
            !name.value ? checkvaluenull('name', false) : checkvaluenull('name', true);
        } else {
            const result_updateemailservice = await updateeamilservice(ID, Service.value, IPAddress, check.checked, User, Apppass, Email, Name);
            if (result_updateemailservice === 'updateemailservice_success') {
                closemodal();
                alertsmall('success', 'Update Email Service Success');
            } else {
                alertsmall('error', 'Please contact the system administrator.');
            }
        }
    }

    // ปุ่ม checkbox สำหรับในกรณีบางทีไม่มี Username และ Password
    const handleCheckboxChange = (event) => {
        if (event.target.checked) {
            document.getElementById('user').value = '';
            document.getElementById('apppass').value = '';
            setUser('');
            setApppass('');
        }
        setCheckeds(event.target.checked);
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>ตั้งค่า Email Service</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className='mb-3'>
                        <Form.Label>Service SMTP</Form.Label>
                        <Select options={Options} id='service' value={Service} onChange={txtonchange} placeholder='Service SMTP' />
                    </Form.Group>
                    {Service.value === 'Other' ? (
                        <Form.Group className='mb-3'>
                            <Form.Label>IP Address SMTP</Form.Label>
                            <Form.Control type='text' id='ipaddress' value={IPAddress} onChange={(e) => { txtonchange(e); checkfilteripaddress(e); setIPAddress(e.target.value); }} placeholder='127.0.0.1:25' autoFocus />
                        </Form.Group>
                    ) : null}
                    <Form.Group className='mb-3'>
                        <Form.Check type='checkbox' id='checkboxuser' checked={Checkeds} label='ในกรณีที่ไม่มี Username และ Password' onChange={handleCheckboxChange} />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>User</Form.Label>
                        <Form.Control type='text' id='user' value={User} onChange={(e) => { txtonchange(e); checkfilteremail(e); setUser(e.target.value); }} disabled={Checkeds} placeholder='username' autoFocus />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type='password' id='apppass' value={Apppass} onChange={(e) => { checkfilterenglishspace(e); setApppass(e.target.value); }} disabled={Checkeds}  placeholder='Password' />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>From email address</Form.Label>
                        <Form.Control type='text' id='email' placeholder='name@example.com' value={Email} onChange={(e) => { txtonchange(e); checkfilteremail(e); setEmail(e.target.value); }} />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type='text' id='name' value={Name} onChange={(e) => { txtonchange(e); checkfilterenglishspace(e); setName(e.target.value); }} placeholder='fisrtname lastname' />
                    </Form.Group>
                    <hr /><div className='midpoint'>
                        <label>Test Email Service</label>
                    </div>
                    <Form.Group className='mb-3'>
                        <Form.Label>To email address</Form.Label>
                        <Form.Control type='text' id='emailto' placeholder='name@example.com' />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Message Description</Form.Label>
                        <Form.Control type='text' id='message' placeholder='Message Description' />
                    </Form.Group>
                    <div className='midpoint'>
                        <Button variant='warning' className='btns' style={{width: '150px'}} onClick={test_emailservice}>Test Service</Button>
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='warning' className='btns' style={{width: '150px', color: 'red', backgroundColor: 'white', border: '1px solid red'}} onClick={closemodal}>Close</Button>
                <Button variant='warning' className='btns' style={{width: '150px'}} onClick={update_emailservice}>Save Changes</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default Modalsettingemail;