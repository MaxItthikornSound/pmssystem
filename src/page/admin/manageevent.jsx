// การนำเข้าและประกาศ Object เมื่อนำมาใช้งานของ Framework สำหรับ React
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

// การนำเข้าและประกาศ Object ให้กับไฟล์สำหรับ React Bootstrap 5
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

// การนำเข้าหน้า Page เพื่อ Link ไปหน้าถัดไป และการ Include ไฟล์เสริมที่เราสร้างขึ้นมา
import Sidebar from '../component/sidebar/sidebar';
import { view_event, delete_event } from '../component/connectdatabase';
import { alertsmall, alertdeleteevent } from '../component/sweetalerttwo';
import OpenBtn from '../component/sidebar/openbtn';
const Manageevent = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
       setIsSidebarOpen(!isSidebarOpen);
     };

    useEffect(() => {
        document.title = 'Manage Event';
        get_database();
    }, []);

    const [Event, setEvent] = useState('');
    const get_database = async () => {
        const data_event = await view_event();
        setEvent(data_event);
    }

    // ลบข้อมูลกิจกรรม
    const remove_event = async (id) => {
        const result_delete = await delete_event(id);
        if (result_delete === 'deleteerror_success') {
            get_database();
            alertsmall('success', 'Remove Event Success');
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
                            <label>Manage Event</label>
                        </Col>
                    </Row>
                    <Row className='midpoint mt-3'>
                        <Col className='col-12'>
                            <Row>
                                {Event && Event.length ? (
                                    Event.map((data, index) => (
                                        <Col key={index} md={6} style={{marginTop: '25px', marginBottom: '20px'}}>
                                            <div className='boxevent'>
                                                <b className='titleevent wordwarp'>{data.EventTopic}</b><br />
                                                <label className='wordwarp' style={{marginTop: '5px'}}>{data.EventDescription}</label><br />
                                                <label style={{marginTop: '30px'}}><b>Event Dates</b></label><br />
                                                <label><b>{data.EventStartDate} {data.EventStartDate ? '- ' + data.EventEndDate : null}</b></label>
                                            </div>
                                            <Row style={{marginTop: '20px'}}>
                                                <Col md={12} style={{textAlign: 'right'}}>
                                                    <Button variant='warning' className='btns' style={{width: '150px'}} onClick={() => navigate('/editevent', { state: { events: Event, event: data} })}><b>Edit</b></Button>
                                                    <Button variant='warning' className='btns' style={{width: '150px', color: 'red', backgroundColor: 'white', border: '1px solid red'}} onClick={() => alertdeleteevent(remove_event, data.EventID)}><b>Delete</b></Button>
                                                </Col>
                                            </Row>
                                        </Col>
                                    ))
                                ) : null}
                            </Row>
                            <Row>
                                <Col md={12} className='midpoint'>
                                    <Button variant='warning' className='btns' style={{width: '150px'}} onClick={() => navigate('/addevent', { state: Event })}>Add Event</Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </Row>
        </Container>
    )
}

export default Manageevent;