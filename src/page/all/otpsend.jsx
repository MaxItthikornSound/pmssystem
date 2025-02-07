// การนำเข้าและประกาศ Object เมื่อนำมาใช้งานของ Framework สำหรับ React
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// การนำเข้าและประกาศ Object ให้กับไฟล์สำหรับ React Bootstrap 5
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';

// การนำเข้าหน้า Page เพื่อ Link ไปหน้าถัดไป และการ Include ไฟล์เสริมที่เราสร้างขึ้นมา
import Navbar from '../component/navbar/navbar';
import { checkfilternumber } from '../component/fnc';
import { sendotp } from '../component/connectdatabase';
import { alertsmall } from '../component/sweetalerttwo';
import Footer from '../component/footer';

// การนำเข้าและประกาศ Object ให้กับไฟล์สำหรับรูปภาพ
import logo from '../../assets/image/logo.png';

// การนำเข้าและประกาศ Object ให้กับรูป Icon สำหรับ React
import { BiEnvelope } from 'react-icons/bi';
import { CgPassword } from 'react-icons/cg';

const Otpsend = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'OTP Send';
        !location.state ? navigate(-1) : null;
        document.getElementById('otp_forgot').focus();
    }, []);

    const txtonchange = (event) => {
        const inputgroups_otp = document.getElementById('inputgroups_otp');
        const textalertotp = document.getElementById('textalertotp');
        if (checkfilternumber(event)) {
            inputgroups_otp.style.border = '1px solid black';
            textalertotp.style.display = 'none';
        } else {
            inputgroups_otp.style.border = '2px solid red';
            textalertotp.style.display = 'block';
        }
    }

    const sendopt = async () => {
        const email_forgot = document.getElementById('email_forgot');
        const otp_forgot = document.getElementById('otp_forgot');
        const inputgroups_otp = document.getElementById('inputgroups_otp');
        const textalertotp = document.getElementById('textalertotp');
        if (!otp_forgot.value) {
            inputgroups_otp.style.border = '2px solid red';
            textalertotp.style.display = 'block';
        } else {
            inputgroups_otp.style.border = '1px solid black';
            textalertotp.style.display = 'none';
            const resutl_sendotp = await sendotp(email_forgot.value, otp_forgot.value);
            if (resutl_sendotp === 'success') {
                navigate('/newpassword', { state: email_forgot.value });
            } else if (resutl_sendotp === 'otp failed') {
                alertsmall('warning', 'OTP is invalidt');
            } else if (resutl_sendotp === 'not found email') {
                alertsmall('warning', 'Email Not Exist');
            } else {
                alertsmall('error', 'กรุณาติดต่อผู้ดูแลระบบ / Please contact the system administrator.');
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
                            <b style={{fontSize: '30px'}}>forgotten Password</b>
                        </Col>
                        <Col md={12} className='midpoint'>
                            <label>OTP Send.</label>
                        </Col>
                        <Col md={12} className='midpoint mt-3'>
                            <Form style={{width: '80%'}}>
                                <Form.Group>
                                    <Form.Label><b>Nok ID</b></Form.Label>
                                    <InputGroup className='inputgroups' id='inputgroups_email'>
                                        <InputGroup.Text className='inputicon'><BiEnvelope /></InputGroup.Text>
                                        <Form.Control type='text' id='email_forgot' className='inputtext' defaultValue={location.state} placeholder='Enter your Nok ID' readOnly />
                                    </InputGroup>
                                </Form.Group>
                            </Form>
                        </Col>
                        <Col md={12} className='midpoint mt-3'>
                            <Form style={{width: '80%'}}>
                                <Form.Group>
                                    <Form.Label><b>OTP</b></Form.Label>
                                    <InputGroup className='inputgroups' id='inputgroups_otp'>
                                        <InputGroup.Text className='inputicon'><CgPassword /></InputGroup.Text>
                                        <Form.Control type='text' id='otp_forgot' className='inputtext' onChange={(e) => { txtonchange(e); checkfilternumber(e); }} placeholder='Enter your OTP' />
                                    </InputGroup>
                                </Form.Group>
                            </Form>
                        </Col>
                        <Col className='col-12 mt-2 midpoint' id='textalertotp' style={{display: 'none', textAlign: 'center'}}>
                            <label style={{color: 'red'}}>Please enter the OTP correctly.</label>
                        </Col>
                        <Col className='col-10 mt-4 midpoint'>
                            <Button variant='warning' className='btns btndark' onClick={() => navigate('/forgottenpassword')}>Cancel</Button>
                            <Button variant='warning' className='btns' onClick={sendopt}>Next</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Footer />
        </Container>
    )
}

export default Otpsend;
