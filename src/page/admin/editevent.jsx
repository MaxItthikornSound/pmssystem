// การนำเข้าและประกาศ Object เมื่อนำมาใช้งานของ Framework สำหรับ React
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import Calendar from 'react-calendar';
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
import { formatdatefull } from '../component/fnc';
import { update_event } from '../component/connectdatabase';
import { alertsmall, alertsuccessredirect } from '../component/sweetalerttwo';
import OpenBtn from '../component/sidebar/openbtn';
const Editevent = () => {
    const location = useLocation();

    const [date, setDate] = useState(new Date());
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
       setIsSidebarOpen(!isSidebarOpen);
     };
    useEffect(() => {
        document.title = 'Edit Event';
        window.scrollTo(0, 0);
        !location.state ? navigate(-1) : null;
    }, []);
    
    const Date_Start = new Date(location.state.event.EventStartDate);
    const formattedStartDate = Date_Start.toLocaleDateString('en-CA');
    const Date_End = new Date(location.state.event.EventEndDate);
    const formattedEndDate = Date_End.toLocaleDateString('en-CA');

    // ถ้ามีค่าว่างให้ทำการใส่กรอบแดงให้กับ input แต่ถ้ามีข้อมูลแล้วให้ลบกรอบแดงออก
    const checkvaluenull = (value, element) => value ? document.getElementById('inputgroups_' + element).style.border = '1px solid rgb(222, 226, 230)' : document.getElementById('inputgroups_' + element).style.border = '1px solid red';

    // เมื่อมีการเปลี่ยนแปลงของข้อมูล ข้อความด้านบนจะถูกอัพเดท
    const Options = [{ value: 'Evaluate Self', label: 'Evaluate Self' }, { value: 'Manager Evaluate Staff', label: 'Manager Evaluate Staff' }, { value: 'Head Of Evaluate Manager', label: 'Head Of Evaluate Manager' }];
    const [Topic, setTopic] = useState(location.state.event.EventTopic);
    const [Evaluate, setEvaluate] = useState({ value: location.state.event.EventEvaluate, label: location.state.event.EventEvaluate });
    const [Description, setDescription] = useState(location.state.event.EventDescription);
    const [StartDate, setStartDate] = useState(location.state.event.EventStartDate);
    const [Start, setStart] = useState(formattedStartDate);
    const [End, setEnd] = useState(formattedEndDate);
    const [EndDate, setEndDate] = useState(location.state.event.EventEndDate);
    const [StatusDate, setStatusDate] = useState(location.state.event.EventStatusDate);
    const events = [Start, End]; // วันที่มีกิจกรรม
    const txtonchange = (event) => {
        checkvaluenull(event.target.value, event.target.id);
        if (event.target.id === 'topic') {
            setTopic(event.target.value);
        } else if (event.target.id === 'description') {
            setDescription(event.target.value);
        } else if (event.target.id === 'startdate') {
            setStart(event.target.value);
            setEnd('');
            // dateend.value = null;
            event.target.value ? setStartDate(formatdatefull.format(new Date(event.target.value))) : setStartDate('');
        } else if (event.target.id === 'enddate') {
            const datestart = document.getElementById('startdate');
            if (new Date(event.target.value) < new Date(datestart.value)) {
                checkvaluenull('', 'enddate');
                alertsmall('warning', 'The end date is incorrect.')
            } else {
                statusdatecalculate(Start);
                setEnd(event.target.value);
                event.target.value ? setEndDate(formatdatefull.format(new Date(event.target.value))) : setEndDate('');
            }
        }
    }

    // ทำการคำนวณรอบของการประเมิน
    const statusdatecalculate = (date) => {
        const startRound = new Date(date); // กำหนดวันที่ที่ต้องการ
        const month = startRound.getMonth(); // เดือน (0 = มกราคม, 11 = ธันวาคม)
        const year = startRound.getFullYear(); // ปี
        if (month >= 1 && month <= 6) {
            setStatusDate(`1-${year}`); // กุมภาพันธ์ (1) ถึง กรกฎาคม (6)
        } else {
            const evaluationYear = month === 0 ? year - 1 : year; // สิงหาคม (7) ถึง มกราคม (0) (มกราคมเป็นของปีที่แล้ว)
            setStatusDate(`2-${evaluationYear}`);
        }
    }

    // เมื่อมีการเปลี่ยนแปลงของข้อมูล ข้อความด้านบนจะถูกอัพเดท สำหรับ Select
    const selectonchange = (event) => setEvaluate(event);

    // ฟังก์ชันเพื่อตรวจสอบและเพิ่ม class ให้วันที่
    const highlightDates = ({ date, view }) => {
        if (view === 'month') {
            const dateString = date.toLocaleDateString('en-CA'); // แปลงวันที่เป็น 'YYYY-MM-DD'
            if (events.includes(dateString)) {
                return 'highlight'; // เพิ่ม class 'highlight' ถ้าวันนั้นมีใน events
            }
        }
        return null; // ไม่มี class ถ้าไม่เจอ
    };

    // อัพเดทข้อมูลกิจกรรม
    const edit_event = async () => {
        const topic = document.getElementById('topic');
        const description = document.getElementById('description');
        const startdate = document.getElementById('startdate');
        const enddate = document.getElementById('enddate');
        const element = document.getElementsByClassName('css-13cymwt-control');
        if (!topic.value || !Evaluate || !description.value || !startdate.value || !enddate.value) {
            checkvaluenull(topic.value, 'topic');
            element[0].style.border = '2px solid red';
            checkvaluenull(description.value, 'description');
            checkvaluenull(startdate.value, 'startdate');
            checkvaluenull(enddate.value, 'enddate');
        } else {
            element[0].style.border = '1px solid rgb(222, 226, 230)';
            if (location.state.events) {
                if (location.state.events.filter(item => item.EventID !== location.state.event.EventID && item.EventStatusDate === StatusDate && item.EventEvaluate === Evaluate.value).length) {
                    alertsmall('warning', 'This evaluation round is already here, please select the correct evaluator or date.');
                } else {
                    const result_updateevent = await update_event(location.state.event.EventID, topic.value, Evaluate.value, description.value, startdate.value, enddate.value, StatusDate);
                    result_updateevent === 'updateevent_success' ? alertsuccessredirect('Edit Event Success', '/manageevent') : null;
                }
            } else {
                const result_updateevent = await update_event(location.state.event.EventID, topic.value, Evaluate.value, description.value, startdate.value, enddate.value, StatusDate);
                result_updateevent === 'updateevent_success' ? alertsuccessredirect('Edit Event Success', '/manageevent') : null;
            }
        }
    }

    return (
        <Container fluid>
            <Row className='m-un h-100'>
                <div style={{width: '250px'}}></div> {/* ทดแทนที่ Sidebar เนื่องจากทำเป็น Position แบบ Fiexd */}
                <OpenBtn onClick={toggleSidebar} />
                <Sidebar namepage={3} isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)}/>
                <Container className='colbody pt-4 mb-4'>
                    <Row className='midpoint'>
                        <Col md={12} className='titletext'>
                            <label>Edit Event</label>
                        </Col>
                    </Row>
                    <Row className='mt-3'>
                        <Col className='col-12'>
                            <Row className='midpoint'>
                                <Col md={4} style={{marginTop: '25px', marginBottom: '20px'}}>
                                    <div className='calendar-container midpoint'>
                                        <Calendar onChange={setDate} value={date}  className='custom-calendar' tileClassName={highlightDates} locale='en-US' />
                                    </div>
                                </Col>
                                <Col md={6} style={{marginTop: '25px', marginBottom: '20px'}}>
                                    <div className='boxevent'>
                                        <b className='titleevent wordwarp'>{Topic ? Topic : 'Topic'}</b><br />
                                        <label className='wordwarp' style={{marginTop: '5px'}}>{Description ? Description : 'Text Description'}</label>
                                        <Row>
                                            <Col className='col-7'>
                                                <label style={{marginTop: '30px'}}><b>Event Dates</b></label><br />
                                                <label><b>{StartDate} {EndDate ? ' - ' + EndDate : null}</b></label>
                                            </Col>
                                            <Col className='col-5 bottomright'>
                                                <Button variant='warning' className='btns' style={{width: '150px', marginBottom: '5px'}}><b>View More</b></Button>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                            <Row style={{height: '470px', padding: '20px'}}>
                                <Col md={12} className='inputgroups_yellow' style={{height: '400px', backgroundColor: 'white', borderRadius: '25px'}}>
                                    <Row className='midpoint' style={{height: '100px'}}>
                                        <Col className='col-11'>
                                            <Row className='mt-3'>
                                                <Col md={9}>
                                                    <Form>
                                                        <Form.Group>
                                                            <Form.Label><b>Topic</b></Form.Label>
                                                            <InputGroup id='inputgroups_topic' className='inputgroups_eval'>
                                                                <Form.Control type='text' id='topic' className='inputtext' value={Topic} onChange={txtonchange} placeholder='Topic' />
                                                            </InputGroup>
                                                        </Form.Group>
                                                    </Form>
                                                </Col>
                                                <Col md={3}>
                                                    <Form>
                                                        <Form.Group>
                                                            <Form.Label><b>Evaluate</b></Form.Label>
                                                                <Select options={Options} id='evaluate' value={Evaluate} onChange={selectonchange} placeholder='Evaluate' />
                                                        </Form.Group>
                                                    </Form>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row className='midpoint mt-event' style={{height: '100px'}}>
                                        <Col className='col-11'>
                                            <Form>
                                                <Form.Group>
                                                    <Form.Label><b>Description</b></Form.Label>
                                                    <InputGroup id='inputgroups_description' className='inputgroups_eval'>
                                                        <Form.Control as='textarea' id='description' rows={3} value={Description} onChange={txtonchange} placeholder='Description' />
                                                    </InputGroup>
                                                </Form.Group>
                                            </Form>
                                        </Col>
                                    </Row>
                                    <Row className='midpoint' style={{height: '100px', marginTop: '40px'}}>
                                        <Col md={7}>
                                            <Row className='midpoint'>
                                                <Col className='col-6'>
                                                    <Form>
                                                        <Form.Group>
                                                            <Form.Label><b>Start</b></Form.Label>
                                                            <InputGroup id='inputgroups_startdate' className='inputgroups_eval'>
                                                                <Form.Control type='date' id='startdate' className='inputtext' value={Start} onChange={txtonchange} placeholder='Start Date' />
                                                            </InputGroup>
                                                        </Form.Group>
                                                    </Form>
                                                </Col>
                                                <Col className='col-6'>
                                                    <Form>
                                                        <Form.Group>
                                                            <Form.Label><b>End</b></Form.Label>
                                                            <InputGroup id='inputgroups_enddate' className='inputgroups_eval'>
                                                                <Form.Control type='date' id='enddate' className='inputtext' value={End} disabled={Start ? false : true} onChange={txtonchange} placeholder='End Date' />
                                                            </InputGroup>
                                                        </Form.Group>
                                                    </Form>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col md={3} className='midpoint' style={{marginTop: '30px'}}>
                                            <Button variant='warning' className='btns' style={{fontSize: '14px'}} onClick={edit_event}>Save</Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </Row>
        </Container>
    )
}

export default Editevent;