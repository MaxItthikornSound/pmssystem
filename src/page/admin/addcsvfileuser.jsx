// การนำเข้าและประกาศ Object เมื่อนำมาใช้งานของ Framework สำหรับ React
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';

// การนำเข้าและประกาศ Object ให้กับไฟล์สำหรับ React Bootstrap 5
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';

// การนำเข้าหน้า Page เพื่อ Link ไปหน้าถัดไป และการ Include ไฟล์เสริมที่เราสร้างขึ้นมา
import Sidebar from '../component/sidebar/sidebar';
import { addusercsv } from '../component/connectdatabase';
import { loading, alertsmall } from '../component/sweetalerttwo';

import { MdOutlineFileDownload } from 'react-icons/md';
import OpenBtn from '../component/sidebar/openbtn';
const Addcsvfileuser = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
       setIsSidebarOpen(!isSidebarOpen);
     };
    useEffect(() => {
        document.title = 'Add CSV File';
    }, []);

    const [Title, setTitle] = useState('Choose File CSV');
    const [Data, setData] = useState([]);

    // ทำการประมวลผลไฟล์ csv ที่นำเข้ามา แล้วแยกเป็นหัวข้อและเนื้อหาข้อมูล
    const handleFileUpload = (event) => {
        setTitle(event.target.files[0].name);
        loading();
        const file = event.target.files[0];
        if (file) {
            Papa.parse(file, {
                complete: (result) => {
                    const [headerRow, ...rows] = result.data;
                    // ตรวจสอบจำนวนคอลัมน์
                    if (headerRow.length !== 9) {
                        loading('errorloadfilecsv');
                        return;
                    }
                    // ตั้งค่า headers และข้อมูล
                    setData(rows);
                    loading('success');
                },
                header: false,
                skipEmptyLines: true,
            });
        } else {
            loading('errorloadfilecsv');
        }
    };
    

    // บันทึกข้อมูลลงในฐานข้อมูล
    const addusercsvfile = async () => {
        loading();
        const result_addusercsv = await addusercsv(Data);
        if (result_addusercsv === 'register_success') {
            setTitle('Choose File CSV')
            setData([]);
            loading('addusercsvsuccess');
        } else if (result_addusercsv === 'user_exist') {
            alertsmall('warning', 'NOKID OR Email has already created an account');
        }
    }

    return (
        <Container fluid>
            <Row className='m-un h-100'>
                <div style={{width: '250px'}}></div> {/* ทดแทนที่ Sidebar เนื่องจากทำเป็น Position แบบ Fiexd */}
                <OpenBtn onClick={toggleSidebar} />
                <Sidebar namepage={1} isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
                <Container className='colbody pt-4'>
                    <Row className='midpoint'>
                        <Col md={12} className='titletext'>
                            <label>Add CSV File</label>
                        </Col>
                        <Col md={12} className='rightcenter' style={{marginTop: '30px'}}>
                            <label htmlFor='filecsv' className='custom-file-upload'><span style={{fontSize: '20px', marginRight: '5px'}}><MdOutlineFileDownload /></span>{Title}</label>
                            <Form>
                                <Form.Group className='pb-2'>
                                    <InputGroup>
                                        <Form.Control type='file' id='filecsv' className='choosedfilecsv' onChange={handleFileUpload} accept='.csv' />
                                    </InputGroup>
                                </Form.Group>
                            </Form>
                        </Col>
                        {Data.length > 0 && (
                            Data.map((data, index) => (
                                <Col md={12} key={index} className='inputgroups_yellow adduser' style={{paddingTop: '10px'}}>
                                    <Row className='rowadduser'>
                                        <Col md={2} style={{marginTop: '10px'}}>
                                            <Form>
                                                <Form.Group>
                                                    <Form.Label><b>Nok ID</b></Form.Label>
                                                    <InputGroup className='inputgroups inputgroups_yellow'>
                                                        <Form.Control type='text' id='nokid' className='inputtext' value={data[0]} placeholder='Nok ID' readOnly={true} />
                                                    </InputGroup>
                                                </Form.Group>
                                            </Form>
                                        </Col>
                                        <Col md={3} style={{marginTop: '10px'}}>
                                            <Form>
                                                <Form.Group>
                                                    <Form.Label><b>Name English</b></Form.Label>
                                                    <InputGroup className='inputgroups inputgroups_yellow'>
                                                        <Form.Control type='text' id='nameen' className='inputtext' value={data[1]} placeholder='Name English' readOnly={true} />
                                                    </InputGroup>
                                                </Form.Group>
                                            </Form>
                                        </Col>
                                        <Col md={3} style={{marginTop: '10px'}}>
                                            <Form>
                                                <Form.Group>
                                                    <Form.Label><b>Name Thai</b></Form.Label>
                                                    <InputGroup className='inputgroups inputgroups_yellow'>
                                                        <Form.Control type='text' id='nameth' className='inputtext' value={data[2]} placeholder='Name Thai' readOnly={true} />
                                                    </InputGroup>
                                                </Form.Group>
                                            </Form>
                                        </Col>
                                        <Col md={4} style={{marginTop: '10px'}}>
                                            <Form>
                                                <Form.Group>
                                                    <Form.Label><b>Position</b></Form.Label>
                                                    <InputGroup className='inputgroups inputgroups_yellow'>
                                                        <Form.Control type='text' id='position' className='inputtext' value={data[3]} placeholder='Position' readOnly={true} />
                                                    </InputGroup>
                                                </Form.Group>
                                            </Form>
                                        </Col>
                                    </Row>
                                    <Row className='rowadduser'>
                                        <Col md={2} style={{marginTop: '10px'}}>
                                            <Form>
                                                <Form.Group>
                                                    <Form.Label><b>Evaluator</b></Form.Label>
                                                    <InputGroup className='inputgroups inputgroups_yellow'>
                                                        <Form.Control type='text' id='evaluator' className='inputtext' value={data[4]} placeholder='Evaluator' readOnly={true} />
                                                    </InputGroup>
                                                </Form.Group>
                                            </Form>
                                        </Col>
                                        <Col md={3} style={{marginTop: '10px'}}>
                                            <Form>
                                                <Form.Group>
                                                    <Form.Label><b>Department</b></Form.Label>
                                                    <InputGroup className='inputgroups inputgroups_yellow'>
                                                        <Form.Control type='text' id='department' className='inputtext' value={data[5]} placeholder='Department' readOnly={true} />
                                                    </InputGroup>
                                                </Form.Group>
                                            </Form>
                                        </Col>
                                        <Col md={2} style={{marginTop: '10px'}}>
                                            <Form>
                                                <Form.Group>
                                                    <Form.Label><b>UserType</b></Form.Label>
                                                    <InputGroup className='inputgroups inputgroups_yellow'>
                                                        <Form.Control type='text' id='usertype' className='inputtext' value={data[6]} placeholder='UserType' readOnly={true} />
                                                    </InputGroup>
                                                </Form.Group>
                                            </Form>
                                        </Col>
                                        <Col md={3} style={{marginTop: '10px'}}>
                                            <Form>
                                                <Form.Group>
                                                    <Form.Label><b>Email</b></Form.Label>
                                                    <InputGroup className='inputgroups inputgroups_yellow'>
                                                        <Form.Control type='text' id='email' className='inputtext' value={data[7]} placeholder='Email' readOnly={true} />
                                                    </InputGroup>
                                                </Form.Group>
                                            </Form>
                                        </Col>
                                        <Col md={2} style={{marginTop: '10px'}}>
                                            <Form>
                                                <Form.Group>
                                                    <Form.Label><b>Level</b></Form.Label>
                                                    <InputGroup className='inputgroups inputgroups_yellow'>
                                                        <Form.Control type='text' id='level' className='inputtext' value={data[8]} placeholder='Level' readOnly={true} />
                                                    </InputGroup>
                                                </Form.Group>
                                            </Form>
                                        </Col>
                                    </Row>
                                </Col>
                            ))
                        )}
                    </Row>
                    {Data.length > 0 && (
                        <Row className='mt-4'>
                            <Col md={12} className='midpoint mb-5'>
                                <Button variant='warning' className='btns' style={{width: '200px', fontSize: '20px'}} onClick={addusercsvfile}><b>Upload</b></Button>
                            </Col>
                        </Row>
                    )}
                </Container>
            </Row>
        </Container>
    )
}

export default Addcsvfileuser;