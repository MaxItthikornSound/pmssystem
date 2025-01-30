// การนำเข้าและประกาศ Object เมื่อนำมาใช้งานของ Framework สำหรับ React
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

// การนำเข้าและประกาศ Object ให้กับไฟล์สำหรับ React Bootstrap 5
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';

// การนำเข้าหน้า Page เพื่อ Link ไปหน้าถัดไป และการ Include ไฟล์เสริมที่เราสร้างขึ้นมา
import Sidebar from '../component/sidebar/sidebar';
import { department, adduser } from '../component/connectdatabase';
import { validateEmail, checkfilteremail, checkfilterenglish, checkfilterenglishspace } from '../component/fnc';
import { alertsmall, alertsuccessredirect } from '../component/sweetalerttwo';
import { CustomSelect } from '../../css/styles';
import OpenBtn from '../component/sidebar/openbtn';
// การนำเข้าและประกาศ Object ให้กับรูป Icon สำหรับ React
import { MdOutlineFileDownload } from 'react-icons/md';

const Adduser = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
       setIsSidebarOpen(!isSidebarOpen);
     };
    useEffect(() => {
        document.title = 'Add User';
        get_database();
    }, []);

    // ดึงข้อมูลมาจาก database
    const [Options_Department, setOptions_Department] = useState([]);
    const get_database = async () => {
        const data_department = await department();
        const transformedDepartment = data_department.map(item => ({ value: item.DepartmentID, label: item.DepartmentName }));
        setOptions_Department(transformedDepartment);
    }

    const Options_UserType = [{ value: 'user', label: 'User' }, { value: 'admin', label: 'Admin' }]
    const Options_Level = [{ value: 'level_5', label: 'level_5' }, { value: 'level_4', label: 'level_4' }, { value: 'level_3', label: 'Level 3' }, { value: 'level_2', label: 'Level 2' }, { value: 'level_1', label: 'Level 1' }];

    // ตรวจเช็คข้อมูลขณะข้อมูลมีการเปลี่ยนแปลงใน Input
    const [Department, setDepartment] = useState('');
    const [UserType, setUserType] = useState('');
    const [Level, setLevel] = useState('');
    const txtonchange = (event, type) => {
        if (event) {
            if (!event.target) {
                if (type === 'department') { setDepartment(event); checkvaluenull('department', true); }
                else if (type === 'usertype') { setUserType(event); checkvaluenull('usertype', true); }
                else if (type === 'level') { setLevel(event); checkvaluenull('level', true); }
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
            if (type === 'department') { setDepartment(event); checkvaluenull('department', false); }
            else if (type === 'usertype') { setUserType(event); checkvaluenull('usertype', false); }
            else if (type === 'level') { setLevel(event); checkvaluenull('level', false); }
        }
    }

    // บันทึกข้อมูลของ User
    const clearselectdepartment = useRef(null);
    const clearselectusertype = useRef(null);
    const clearselectlevel = useRef(null);
    const save_user = async () => {
        const nokid = document.getElementById('nokid');
        const nameen = document.getElementById('nameen');
        const nameth = document.getElementById('nameth');
        const position = document.getElementById('position');
        const evaluator = document.getElementById('evaluator');
        const email = document.getElementById('email');
        if (!nokid.value || !nameen.value || !nameth.value || !position.value || !evaluator.value || !Department || !UserType || !email.value || !Level) {
            !nokid.value ? checkvaluenull('nokid', false) : checkvaluenull('nokid', true);
            !nameen.value ? checkvaluenull('nameen', false) : checkvaluenull('nameen', true);
            !nameth.value ? checkvaluenull('nameth', false) : checkvaluenull('nameth', true);
            !position.value ? checkvaluenull('position', false) : checkvaluenull('position', true);
            !evaluator.value ? checkvaluenull('evaluator', false) : checkvaluenull('evaluator', true);
            !Department ? checkvaluenull('department', false) : checkvaluenull('department', true);
            !UserType ? checkvaluenull('usertype', false) : checkvaluenull('usertype', true);
            !email.value ? checkvaluenull('email', false) : checkvaluenull('email', true);
            !Level ? checkvaluenull('level', false) : checkvaluenull('level', true);
        } else {
            const sendData = new FormData();
            sendData.append('nokid', nokid.value);
            sendData.append('nameen', nameen.value);
            sendData.append('nameth', nameth.value);
            sendData.append('position', position.value);
            sendData.append('evaluator', evaluator.value);
            sendData.append('department', Department.value);
            sendData.append('usertype', UserType.value);
            sendData.append('email', email.value);
            sendData.append('level', Level.value);
            const result_adduser = await adduser(sendData);
            if (result_adduser === 'register_success') {
                nokid.value = '';
                nameen.value = '';
                nameth.value = '';
                position.value = '';
                evaluator.value = '';
                clearselectdepartment.current.clearValue();
                checkvaluenull('department', true);
                clearselectusertype.current.clearValue();
                checkvaluenull('usertype', true);
                email.value = '';
                clearselectlevel.current.clearValue();
                checkvaluenull('level', true);
                alertsuccessredirect('Register Success', '/manageuser');
            } else if (result_adduser === 'user_exist') {
                alertsmall('warning', 'NOKID OR Email has already created an account');
            }
        }
    }

    // เมื่อข้อมูลมีค่าว่างให้ทำการใส่กรอบสีแดงเพื่อให้รู้ว่ามีค่าว่างอยู่
    const checkvaluenull = (type, value) => {
        const element = document.getElementById('inputgroups_' + type);
        value === false ? element.style.border = '2px solid red' : element.style.border = '2px solid #ffcb0b';
    }

    return (
        <Container fluid>
            <Row className='m-un h-100'>
                <div style={{width: '250px'}}></div> {/* ทดแทนที่ Sidebar เนื่องจากทำเป็น Position แบบ Fiexd */}
                <OpenBtn onClick={toggleSidebar} />
                <Sidebar namepage={1} isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)}/>
                <Container className='colbody pt-4'>
                    <Row className='midpoint'>
                        <Col className='col-10 titletext'>
                            <label>Add User</label>
                        </Col>
                        <Col className='col-2 midpoint'>
                            <Button variant='warning' className='btns' style={{width: '200px', fontSize: '20px'}} onClick={() => navigate('/addcsvfileuser')}><b><MdOutlineFileDownload /><span className='pc'>Import</span></b></Button>
                        </Col>
                        <Col md={12} className='inputgroups_yellow_border adduser' style={{paddingTop: '10px'}}>
                            <Row className='rowadduser'>
                                <Col md={2} style={{marginTop: '10px'}}>
                                    <Form onSubmit={(e) => e.preventDefault()}>
                                        <Form.Group>
                                            <Form.Label><b>Nok ID</b></Form.Label>
                                            <InputGroup id='inputgroups_nokid' className='inputgroups inputgroups_yellow'>
                                                <Form.Control type='text' id='nokid' className='inputtext' onChange={(e) => { checkfilterenglish(e); txtonchange(e); }} placeholder='Nok ID' />
                                            </InputGroup>
                                        </Form.Group>
                                    </Form>
                                </Col>
                                <Col md={3} style={{marginTop: '10px'}}>
                                    <Form onSubmit={(e) => e.preventDefault()}>
                                        <Form.Group>
                                            <Form.Label><b>Name English</b></Form.Label>
                                            <InputGroup id='inputgroups_nameen' className='inputgroups inputgroups_yellow'>
                                                <Form.Control type='text' id='nameen' className='inputtext' onChange={(e) => { checkfilterenglishspace(e); txtonchange(e); }} placeholder='Name English' />
                                            </InputGroup>
                                        </Form.Group>
                                    </Form>
                                </Col>
                                <Col md={3} style={{marginTop: '10px'}}>
                                    <Form onSubmit={(e) => e.preventDefault()}>
                                        <Form.Group>
                                            <Form.Label><b>Name Thai</b></Form.Label>
                                            <InputGroup id='inputgroups_nameth' className='inputgroups inputgroups_yellow'>
                                                <Form.Control type='text' id='nameth' className='inputtext' onChange={txtonchange} placeholder='Name Thai' />
                                            </InputGroup>
                                        </Form.Group>
                                    </Form>
                                </Col>
                                <Col md={4} style={{marginTop: '10px'}}>
                                    <Form onSubmit={(e) => e.preventDefault()}>
                                        <Form.Group>
                                            <Form.Label><b>Position</b></Form.Label>
                                            <InputGroup id='inputgroups_position' className='inputgroups inputgroups_yellow'>
                                                <Form.Control type='text' id='position' className='inputtext' onChange={(e) => { checkfilterenglishspace(e); txtonchange(e); }} placeholder='Position' />
                                            </InputGroup>
                                        </Form.Group>
                                    </Form>
                                </Col>
                            </Row>
                            <Row className='rowadduser'>
                                <Col md={2} style={{marginTop: '10px'}}>
                                    <Form onSubmit={(e) => e.preventDefault()}>
                                        <Form.Group>
                                            <Form.Label><b>Evaluator</b></Form.Label>
                                            <InputGroup id='inputgroups_evaluator' className='inputgroups inputgroups_yellow'>
                                                <Form.Control type='text' id='evaluator' className='inputtext' onChange={(e) => { checkfilterenglish(e); txtonchange(e); }} placeholder='Evaluator' />
                                            </InputGroup>
                                        </Form.Group>
                                    </Form>
                                </Col>
                                <Col md={2} style={{marginTop: '10px'}}>
                                    <Form onSubmit={(e) => e.preventDefault()}>
                                        <Form.Label><b>UserType</b></Form.Label>
                                        <Form.Group className='pb-2 selectgruops' id='inputgroups_usertype'>
                                            <Select options={Options_UserType} id='usertype' className='selectuser' styles={CustomSelect} isClearable='true' ref={clearselectusertype} onChange={(e) => txtonchange(e, 'usertype')} placeholder='UserType' />
                                        </Form.Group>
                                    </Form>
                                </Col>
                                <Col md={3} style={{marginTop: '10px'}}>
                                    <Form onSubmit={(e) => e.preventDefault()}>
                                        <Form.Group>
                                            <Form.Label><b>Department</b></Form.Label>
                                            <Form.Group className='pb-2 selectgruops' id='inputgroups_department'>
                                                <Select options={Options_Department} id='department' className='selectuser' styles={CustomSelect} isClearable='true' ref={clearselectdepartment} onChange={(e) => txtonchange(e, 'department')} placeholder='Department' />
                                            </Form.Group>
                                        </Form.Group>
                                    </Form>
                                </Col>
                                <Col md={3} style={{marginTop: '10px'}}>
                                    <Form onSubmit={(e) => e.preventDefault()}>
                                        <Form.Group>
                                            <Form.Label><b>Email</b></Form.Label>
                                            <InputGroup id='inputgroups_email' className='inputgroups inputgroups_yellow'>
                                                <Form.Control type='text' id='email' className='inputtext' onChange={(e) => { checkfilteremail(e); txtonchange(e); }} placeholder='Email' />
                                            </InputGroup>
                                        </Form.Group>
                                    </Form>
                                </Col>
                                <Col md={2} style={{marginTop: '10px'}}>
                                    <Form onSubmit={(e) => e.preventDefault()}>
                                        <Form.Group>
                                            <Form.Label><b>Level</b></Form.Label>
                                                <Form.Group className='pb-2 selectgruops' id='inputgroups_level'>
                                                    <Select options={Options_Level} id='level' className='selectuser' styles={CustomSelect} isClearable='true' ref={clearselectlevel} onChange={(e) => txtonchange(e, 'level')} placeholder='Level' />
                                                </Form.Group>
                                        </Form.Group>
                                    </Form>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12} className='mt-5 midpoint mb-5'>
                            <Button variant='warning' className='btns' style={{width: '200px', color: 'black', fontSize: '20px'}} onClick={save_user}><b>Save</b></Button>
                        </Col>
                    </Row>
                </Container>
            </Row>
        </Container>
    )
}

export default Adduser;