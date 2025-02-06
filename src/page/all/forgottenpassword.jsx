// การนำเข้าและประกาศ Object เมื่อนำมาใช้งานของ Framework สำหรับ React
import { useEffect } from 'react';
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
import { validateEmail, checkfilteremail } from '../component/fnc';
import { sendemail } from '../component/connectdatabase';
import { alertsmall, loadingotp } from '../component/sweetalerttwo';
import Footer from '../component/footer';

// การนำเข้าและประกาศ Object ให้กับไฟล์สำหรับรูปภาพ
import logo from '../../assets/image/logo.png';

// การนำเข้าและประกาศ Object ให้กับรูป Icon สำหรับ React
import { BiEnvelope } from 'react-icons/bi';

const Forgettenpassword = () => {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Forgetten Password';
    }, []);

    const txtonchange = (event) => {
        const inputgroups_email = document.getElementById('inputgroups_email');
        const textalertemail = document.getElementById('textalertemail');
        if (event.target.id === 'email_forget') {
            if (event.target.value) {
                // ฟังก์ชันที่ใช้ในการตรวจสอบอีเมลเมื่อมีการกรอกข้อมูล
                if (validateEmail(event.target.value)) {
                    inputgroups_email.style.border = '1px solid black';
                    textalertemail.style.display = 'none';
                } else {
                    inputgroups_email.style.border = '2px solid red';
                    textalertemail.style.display = 'block';
                }
            } else {
                inputgroups_email.style.border = '2px solid red';
                textalertemail.style.display = 'block';
            }
        }
    }

    // ปุ่มรับรหัส OTP
    const btnforgetpassword = async () => {
        const email_forget = document.getElementById('email_forget');
        const inputgroups_email = document.getElementById('inputgroups_email');
        const textalertemail = document.getElementById('textalertemail');
        if (!email_forget.value) {
            inputgroups_email.style.border = '2px solid red';
            textalertemail.style.display = 'block';
        } else {
            if (validateEmail(email_forget.value)) {
                loadingotp();
                inputgroups_email.style.border = '1px solid black';
                textalertemail.style.display = 'none';
                const result_sendemail = await sendemail(email_forget.value);
                if (result_sendemail === 'success') {
                    loadingotp(result_sendemail);
                    navigate('/otpsend', { state: email_forget.value });
                } else if (result_sendemail === 'email not exist') {
                    alertsmall('warning', 'Email Not Exist');
                } else {
                    alertsmall('error', 'กรุณาติดต่อผู้ดูแลระบบ / Please contact the system administrator.');
                }
            } else {
                inputgroups_email.style.border = '2px solid red';
                textalertemail.style.display = 'block';
            }
        }
    }

    return(
        <Container fluid>
            <Navbar />
            <Row className='midpoint' style={{flex: 1}}>
                <Col md={4}>
                    <Row className='midpoint'>
                        <Col md={12} className='midpoint'>
                            <img src={logo} alt='logo noair' className='logo' />
                        </Col>
                        <Col md={12} className='midpoint mt-2'>
                            <b style={{fontSize: '30px'}}>Forgotten Password</b>
                        </Col>
                        <Col md={12} className='midpoint mt-3'>
                            <Form style={{width: '80%'}}>
                                <Form.Group>
                                    <Form.Label><b>Email</b></Form.Label>
                                    <InputGroup className='inputgroups' id='inputgroups_email'>
                                        <InputGroup.Text className='inputicon'><BiEnvelope /></InputGroup.Text>
                                        <Form.Control type='text' id='email_forget' className='inputtext' onChange={(e) => { txtonchange(e); checkfilteremail(e); }} placeholder='Enter your Email' />
                                    </InputGroup>
                                </Form.Group>
                            </Form>
                        </Col>
                        <Col className='col-9 mt-1' id='textalertemail' style={{display: 'none'}}>
                            <label style={{color: 'red'}}>Please enter your email address correctly.</label>
                        </Col>
                        <Col className='col-10 mt-4 midpoint'>
                            <Button variant='warning' className='btns btndark' onClick={() => navigate('/')}>Cancel</Button>
                            <Button variant='warning' className='btns' onClick={btnforgetpassword}>Send</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Footer />
        </Container>
    )
}

export default Forgettenpassword;
