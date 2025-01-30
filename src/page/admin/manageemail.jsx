// การนำเข้าและประกาศ Object เมื่อนำมาใช้งานของ Framework สำหรับ React
import React, { useEffect, useState } from 'react'

// การนำเข้าและประกาศ Object ให้กับไฟล์สำหรับ React Bootstrap 5
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';

// การนำเข้าหน้า Page เพื่อ Link ไปหน้าถัดไป และการ Include ไฟล์เสริมที่เราสร้างขึ้นมา
import Sidebar from '../component/sidebar/sidebar';
import { viewemailservice, configemail, updateconfigemail } from '../component/connectdatabase';
import { alertsmall } from '../component/sweetalerttwo';
import Modalsettingemail from '../component/modal/modalsettingemail';

// การนำเข้าและประกาศ Object ให้กับรูป Icon สำหรับ React
import Sendotp from '../component/email/sendotp';
import Notipms from '../component/email/notipms';
import OpenBtn from '../component/sidebar/openbtn';
const Manageemail = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
       setIsSidebarOpen(!isSidebarOpen);
     };
    useEffect(() => {
        document.title = 'Manage Email';
        Email_Config('OTP');
    }, []);

    // เปิดปิด Modal
    const [ModalShow, setModalShow] = useState(false);
    const openModal = () => { 
        setModalShow(true);
    }
    const closeModal = () => setModalShow(false);

    const [selectedTab, setSelectedTab] = useState('one');
    const [ID, setID] = useState('');
    const [To, setTo] = useState('');
    const [Subject, setSubject] = useState('');
    const [Description, setDescription] = useState('');

    // ดึงข้อมูลอีเมลออกมา
    const Email_Config = async (keyword) => {
        const data_config_email = await configemail();
        const filteredData = data_config_email.filter(data => data.EmailKeyword === keyword);
        setID(filteredData[0].EmailID);
        setTo(filteredData[0].EmailTo);
        setSubject(filteredData[0].EmailSubject);
        setDescription(filteredData[0].EmailDescription);
    }

    // ฟังก์ชันแปลงข้อความให้แทน /n ด้วย <br />
    const formattedMessageShow = Description.split('/n').map((line, index) => (
        <React.Fragment key={index}>
            {line}
            <br />
        </React.Fragment>
    ));

    // สำหรับ input textare
    const formattedMessageInput = Description.replace(/\/n/g, '\n');

    // เมื่อมีข้อความกรอกเข้ามา ให้ทำการโชว์ไว้ด้านบน
    const txtonchange = (event) => {
        event.target.id === 'to' ? setTo(event.target.value) : event.target.id === 'subject' ? setSubject(event.target.value) : event.target.id === 'description' ? setDescription(event.target.value.replace(/\n/g, '/n')) : null;
    }

    // เมื่อมีการ Enter เกินกว่าที่กำหนด
    const txtonkeydown = (event) => {
        const textArea = event.target;
        const maxRows = 11;
        // คำนวณจำนวนแถวปัจจุบัน
        const currentRows = textArea.value.split('\n').length;
        if (event.key === 'Enter' && currentRows >= maxRows) {
            event.preventDefault(); // ป้องกันการกด Enter ถ้าจำนวนแถวเกิน
        }
    };

    // อัพเดทการตั้งค่า Email
    const update_configemail = async () => {
        const result_updateemailconfig = await updateconfigemail(ID, To, Subject, Description);
        result_updateemailconfig === 'updateemailconfig_success' ? alertsmall('success', 'Update Email Config Success') : alertsmall('error', 'Please contact the system administrator.');
    }

    return (
        <Container fluid>
            <Row className='m-un h-100'>
                <div style={{width: '250px'}}></div> {/* ทดแทนที่ Sidebar เนื่องจากทำเป็น Position แบบ Fiexd */}
                <OpenBtn onClick={toggleSidebar} />
                <Sidebar namepage={5} isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)}/>
                <Container className='colbodyemail pt-4'>
                    <Row>
                        <Col md={12} className='titletext'>
                            <label>Manage Email</label>
                        </Col>
                        <Col className='col-12 mt-3'>
                            <Row className='rightcenter'>
                                <Col md={2}>
                                    <Button variant='warning' style={{width: '100%', borderRadius: '25px'}} onClick={openModal}>ตั้งค่า Email Service</Button>
                                </Col>
                            </Row>
                        </Col>
                        <Col md={12} className='mt-3'>
                            <Row className='midpoint'>
                                <Col md={5}>
                                    {selectedTab === 'one' ? (
                                        <Row className='midpoint'>
                                            <Sendotp To={To} Subject={Subject} Description={formattedMessageShow} />
                                        </Row>
                                    ) : selectedTab === 'two' || selectedTab === 'three' ? (
                                        <Row className='midpoint'>
                                            <Notipms To={To} Subject={Subject} Description={formattedMessageShow}  />
                                        </Row>
                                    ) : null}
                                </Col>
                                <Col md={7}>
                                    <div className='warpper mt-4'>
                                        <input className='radio' id='one' name='group' type='radio' checked={selectedTab === 'one'} onChange={() => { setSelectedTab('one'); Email_Config('OTP'); }} />
                                        <input className='radio' id='two' name='group' type='radio' checked={selectedTab === 'two'} onChange={() => { setSelectedTab('two'); Email_Config('Self'); }} />
                                        <input className='radio' id='three' name='group' type='radio' checked={selectedTab === 'three'} onChange={() => { setSelectedTab('three'); Email_Config('Staff'); }} />
                                        <div className='tabs'>
                                            <label className='tab' id='one-tab' htmlFor='one'><b>OTP</b></label>
                                            <label className='tab' id='two-tab' htmlFor='two' style={{marginLeft: '10px'}}><b>Self</b></label>
                                            <label className='tab' id='three-tab' htmlFor='three' style={{marginLeft: '10px'}}><b>Staff</b></label>
                                        </div>
                                        <div className='panels' style={{height: '600px', minHeight: '300px', marginBottom: '30px', padding: '20px'}}>
                                            <div className='panel' id={selectedTab + '-panel'}>
                                                <Row className='midpoint'>
                                                    <Col className='col-11'>
                                                        <Form>
                                                            <Form.Group>
                                                                <InputGroup className='inputgroups_eval'>
                                                                    <Form.Control type='text' id='to' value={To} onChange={txtonchange} placeholder='To' />
                                                                </InputGroup>
                                                            </Form.Group>
                                                        </Form>
                                                    </Col>
                                                    <Col className='col-11 mt-4'>
                                                        <Form>
                                                            <Form.Group>
                                                                <InputGroup className='inputgroups_eval'>
                                                                    <Form.Control type='text' id='subject' value={Subject} onChange={txtonchange} placeholder='Subject' />
                                                                </InputGroup>
                                                            </Form.Group>
                                                        </Form>
                                                    </Col>
                                                    <Col className='col-11 mt-4'>
                                                        <Form>
                                                            <Form.Group>
                                                                <InputGroup className='inputgroups_eval'>
                                                                    <Form.Control as='textarea' id='description' rows={15} style={{resize: 'none'}} value={formattedMessageInput} onChange={txtonchange} onKeyDown={txtonkeydown} placeholder='Description' />
                                                                </InputGroup>
                                                            </Form.Group>
                                                        </Form>
                                                    </Col>
                                                    <Col className='col-12 mt-4 rightcenter'>
                                                        <Button variant='warning' className='btns btndark' style={{width: '150px', color: '#ffcb0b'}} onClick={update_configemail}>Save</Button>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>-
                </Container>
            </Row>
            <Modalsettingemail show={ModalShow} onHide={closeModal} />
        </Container>
    )
}
export default Manageemail;