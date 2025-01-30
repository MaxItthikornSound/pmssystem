// การนำเข้าและประกาศ Object เมื่อนำมาใช้งานของ Framework สำหรับ React
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// การนำเข้าและประกาศ Object ให้กับไฟล์สำหรับ React Bootstrap 5
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';

// การนำเข้าหน้า Page เพื่อ Link ไปหน้าถัดไป และการ Include ไฟล์เสริมที่เราสร้างขึ้นมา
import Navbar from '../component/navbar/navbar';
import { checkfilteremail, checkfilterenglish } from '../component/fnc';
import { logins } from '../component/connectdatabase';
import { alertsmall } from '../component/sweetalerttwo';
import Footer from '../component/footer';

// การนำเข้าและประกาศ Object ให้กับไฟล์สำหรับรูปภาพ
import logo from '../../assets/image/logo.png';

// การนำเข้าและประกาศ Object ให้กับรูป Icon สำหรับ React
import { BiEnvelope, BiLock } from 'react-icons/bi';

const Index = () => {
    const navigate = useNavigate();

    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [Remember, setRemember] = useState(null);
    useEffect(() => {
        document.title = 'PMS Login';
        const login_data = localStorage.getItem(import.meta.env.VITE_LOGINSESSION) ? JSON.parse(localStorage.getItem(import.meta.env.VITE_LOGINSESSION)) : null;
        if (login_data) {
            setEmail(login_data.email);
            setPassword(login_data.passwords);
            setRemember(login_data.remember);
        }
    }, []);
    
    // ตรวจจับว่าได้ทำการกรอกอีเมลครบแล้วหรือไม่
    const txtonchange = (event) => {
        if (event.target.id === 'email_login') {
            if (event.target.value) {
                // ฟังก์ชันที่ใช้ในการตรวจสอบอีเมลเมื่อมีการกรอกข้อมูล
                const inputgroups_email = document.getElementById('inputgroups_email');
                const textalertemail = document.getElementById('textalertemail');
                inputgroups_email.style.border = '1px solid black';
                textalertemail.style.display = 'none';
            } else {
                inputgroups_email.style.border = '2px solid red';
                textalertemail.style.display = 'block';
            }
        } else if (event.target.id === 'password_login') {
            const inputgroups_password = document.getElementById('inputgroups_password');
            const textalertpassword = document.getElementById('textalertpassword');
            if (event.target.value) {
                inputgroups_password.style.border = '1px solid black';
                textalertpassword.style.display = 'none';
            } else {
                inputgroups_password.style.border = '2px solid red';
                textalertpassword.style.display = 'block';
            }
        }
    }

    // ปุ่มเข้าสู่ระบบ
    const login = async () => {
        const email = document.getElementById('email_login');
        const passwords = document.getElementById('password_login');
        const remember = document.getElementById('remember');
        if (!email.value || !passwords.value) {
            if (!email.value) {
                inputgroups_email.style.border = '2px solid red';
                textalertemail.style.display = 'block';
            }
            if (!passwords.value) {
                inputgroups_password.style.border = '2px solid red';
                textalertpassword.style.display = 'block';
            }
        } else {
            const result_login = await logins(email.value, passwords.value);
            if (result_login.auth === false) {
                alertsmall('error', 'Email or Password Incorrect');
            } else {
                if (remember.checked === true) {
                    const login_data = { email: email.value, passwords: passwords.value, remember: true };
                    localStorage.setItem(import.meta.env.VITE_LOGINSESSION, JSON.stringify(login_data));
                } else {
                    localStorage.removeItem(import.meta.env.VITE_LOGINSESSION);
                }
                result_login.EmployeeUserType === 'admin' ? navigate('/manageuser') : result_login.EmployeeUserType === 'user' ? navigate('/home') : null;
            }
        }
    }

    return(
        <Container fluid>
            <Navbar />
            <Row className='midpoint' style={{flex: 1}}>
                <Col md={5}>
                    <Row className='midpoint'>
                        <Col md={12} className='midpoint'>
                            <img src={logo} alt='logo noair' className='logo' />
                        </Col>
                        <Col md={12} className='midpoint mt-2'>
                            <b style={{fontSize: '30px'}}>Login</b>
                        </Col>
                        <Col md={12} className='midpoint'>
                            <label>Employee Assessment Website</label>
                        </Col>
                        <Col md={12} className='midpoint mt-3'>
                            <Form style={{width: '80%'}} onSubmit={(e) => e.preventDefault()}>
                                <Form.Group>
                                    <Form.Label>Nok ID</Form.Label>
                                    <InputGroup className='inputgroups' id='inputgroups_email'>
                                        <InputGroup.Text className='inputicon'><BiEnvelope /></InputGroup.Text>
                                        <Form.Control type='text' id='email_login' className='inputtext' defaultValue={Email} onChange={(e) => { checkfilteremail(e); txtonchange(e); }} placeholder='Enter your Nok ID' />
                                    </InputGroup>
                                </Form.Group>
                            </Form>
                        </Col>
                        <Col className='col-9 mt-1' id='textalertemail' style={{display: 'none'}}>
                            <label style={{color: 'red'}}>Please enter your email address correctly.</label>
                        </Col>
                        <Col md={12} className='midpoint mt-2'>
                            <Form style={{width: '80%'}} onSubmit={(e) => { e.preventDefault(); login(); }}>
                                <Form.Group>
                                    <Form.Label>Password</Form.Label>
                                    <InputGroup className='inputgroups' id='inputgroups_password'>
                                        <InputGroup.Text className='inputicon'><BiLock /></InputGroup.Text>
                                        <Form.Control type='password' id='password_login' className='inputtext' defaultValue={Password} onChange={(e) => { checkfilterenglish(e); txtonchange(e); }} placeholder='Enter your password' />
                                    </InputGroup>
                                </Form.Group>
                            </Form>
                        </Col>
                        <Col className='col-9 mt-1' id='textalertpassword' style={{display: 'none'}}>
                            <label style={{color: 'red'}}>Please enter your password correctly.</label>
                        </Col>
                        <Col className='col-10 mt-3'>
                            <Row>
                                <Col className='col-6'>
                                <label className='custom-radio'>
                                    <input type='checkbox' id='remember' className='radio-input' defaultChecked={Remember} />
                                    <span className='checkmark'></span>
                                    <b>Remember me</b>
                                </label>
                                </Col>
                                <Col className='col-6' style={{textAlign: 'right', marginTop: '10px', paddingRight: '20px'}}>
                                    <b className='forgetpassword' onClick={() => { navigate('/forgottenpassword') }}>Forgetten Password</b>
                                </Col>
                            </Row>
                        </Col>
                        <Col md={12} className='col-10 mt-5 midpoint'>
                            <Button variant='warning' className='btns' onClick={login}>Login</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Footer />
        </Container>
    )
}

export default Index;