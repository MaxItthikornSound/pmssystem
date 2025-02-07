// การนำเข้าและประกาศ Object เมื่อนำมาใช้งานของ Framework สำหรับ React
import { useEffect, useState } from 'react';
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
import { checkfilterenglish } from '../component/fnc';
import { createnewpassword } from '../component/connectdatabase';
import { alertsmall, alertsuccessredirect } from '../component/sweetalerttwo';
import Footer from '../component/footer';

// การนำเข้าและประกาศ Object ให้กับไฟล์สำหรับรูปภาพ
import logo from '../../assets/image/logo.png';

// การนำเข้าและประกาศ Object ให้กับรูป Icon สำหรับ React
import { CgPassword } from 'react-icons/cg';

const Newpassword = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [Email, setEmail] = useState('');
    useEffect(() => {
        document.title = 'New Password';
        !location.state ? navigate(-1) : null;
    }, []);

    const txtonchange = (event) => {
        const textalertpasswordmatch = document.getElementById('textalertpasswordmatch');
        textalertpasswordmatch.style.display = 'none';
        if (event.target.id === 'password_new') {
            const inputgroups_password = document.getElementById('inputgroups_password');
            const textalertpassword = document.getElementById('textalertpassword');
            if (event.target.value) {
                inputgroups_password.style.border = '1px solid black';
                textalertpassword.style.display = 'none';
            } else {
                inputgroups_password.style.border = '2px solid red';
                textalertpassword.style.display = 'block';
            }
        } else if (event.target.id === 'passwordconfirm_new') {
            const inputgroups_passwordconfirm = document.getElementById('inputgroups_passwordconfirm');
            const textalertpasswordconfirm = document.getElementById('textalertpasswordconfirm');
            if (event.target.value) {
                inputgroups_passwordconfirm.style.border = '1px solid black';
                textalertpasswordconfirm.style.display = 'none';
            } else {
                inputgroups_passwordconfirm.style.border = '2px solid red';
                textalertpasswordconfirm.style.display = 'block';
            }
        }
    }

    const btncreatenewpassword = async () => {
        const password_new = document.getElementById('password_new');
        const passwordconfirm_new = document.getElementById('passwordconfirm_new');
        const inputgroups_password = document.getElementById('inputgroups_password');
        const inputgroups_passwordconfirm = document.getElementById('inputgroups_passwordconfirm');
        const textalertpassword = document.getElementById('textalertpassword');
        const textalertpasswordconfirm = document.getElementById('textalertpasswordconfirm');
        const textalertpasswordmatch = document.getElementById('textalertpasswordmatch');
        if (!password_new.value || !passwordconfirm_new.value) {
            if (!password_new.value) {
                inputgroups_password.style.border = '2px solid red';
                textalertpassword.style.display = 'block';
            }
            if (!passwordconfirm_new.value) {
                inputgroups_passwordconfirm.style.border = '2px solid red';
                textalertpasswordconfirm.style.display = 'block';
            }
        } else if (password_new.value !== passwordconfirm_new.value) {
            inputgroups_password.style.border = '2px solid red';
            inputgroups_passwordconfirm.style.border = '2px solid red';
            textalertpasswordmatch.style.display = 'block';
        } else {
            inputgroups_password.style.border = '1px solid black';
            inputgroups_passwordconfirm.style.border = '1px solid black';
            const result_createnewpassword = await createnewpassword(location.state, password_new.value);
            if (result_createnewpassword === 'success') {
                alertsuccessredirect('Password changed successfully', '/');
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
                            <b style={{fontSize: '30px'}}>Create New Password</b>
                        </Col>
                        <Col md={12} className='midpoint mt-3'>
                            <Form style={{width: '80%'}} onSubmit={(e) => e.preventDefault()}>
                                <Form.Group>
                                    <Form.Label><b>Password</b></Form.Label>
                                    <InputGroup className='inputgroups' id='inputgroups_password'>
                                        <InputGroup.Text className='inputicon'><CgPassword /></InputGroup.Text>
                                        <Form.Control type='password' id='password_new' className='inputtext' onChange={(e) => { txtonchange(e); checkfilterenglish(e); }} placeholder='Enter your password' />
                                    </InputGroup>
                                </Form.Group>
                            </Form>
                        </Col>
                        <Col className='col-9 mt-1' id='textalertpassword' style={{display: 'none'}}>
                            <label style={{color: 'red'}}>Please enter the Password correctly.</label>
                        </Col>
                        <Col md={12} className='midpoint mt-3'>
                            <Form style={{width: '80%'}} onSubmit={(e) => { e.preventDefault(); btncreatenewpassword(); }}>
                                <Form.Group>
                                    <Form.Label><b>Confirm Password</b></Form.Label>
                                    <InputGroup className='inputgroups' id='inputgroups_passwordconfirm'>
                                        <InputGroup.Text className='inputicon'><CgPassword /></InputGroup.Text>
                                        <Form.Control type='password' id='passwordconfirm_new' className='inputtext' onChange={(e) => { txtonchange(e); checkfilterenglish(e); }} placeholder='Enter your confirm password' />
                                    </InputGroup>
                                </Form.Group>
                            </Form>
                        </Col>
                        <Col className='col-9 mt-1' id='textalertpasswordconfirm' style={{display: 'none'}}>
                            <label style={{color: 'red'}}>Please enter the Confirm Password correctly.</label>
                        </Col>
                        <Col className='col-12 mt-2 midpoint' id='textalertpasswordmatch' style={{display: 'none', textAlign: 'center'}}>
                            <label style={{color: 'red'}}>Passwords don't match.</label>
                        </Col>
                        <Col className='col-10 mt-4 midpoint'>
                            <Button variant='warning' className='btns btndark' onClick={() => navigate('/forgettenpassword')}>Cancel</Button>
                            <Button variant='warning' className='btns' onClick={btncreatenewpassword}>Save</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Footer />
        </Container>
    )
}

export default Newpassword;
