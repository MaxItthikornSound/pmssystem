// การนำเข้าและประกาศ Object เมื่อนำมาใช้งานของ Framework สำหรับ React
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

// การนำเข้าและประกาศ Object ให้กับไฟล์สำหรับ React Bootstrap 5
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

// การนำเข้าหน้า Page เพื่อ Link ไปหน้าถัดไป และการ Include ไฟล์เสริมที่เราสร้างขึ้นมา
import Navbar from '../component/navbar/navbaruser';
import { view_event } from '../component/connectdatabase';
import Footer from '../component/footer';
import Modaldetailevent from '../component/modal/modaldetailevent';
import { loading } from '../component/sweetalerttwo';

const Home = () =>{
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Home';
        get_database();
    }, []);

    // ดึง Event มาโชว์
    const [Event, setEvent] = useState('');
    const get_database = async () => {
        loading()
        const data_event = await view_event();
        const activeEvents = []; // เก็บเหตุการณ์ที่ยังไม่หมดเวลา
        data_event.map(data => {
            // แปลงวันที่สิ้นสุดของเหตุการณ์เป็น Moment object
            const endDate = moment(data.EventEndDate, 'D MMMM YYYY').endOf('day');
            // วันที่ปัจจุบัน
            const currentDate = moment();
    
            // ตรวจสอบว่าเหตุการณ์ยังไม่หมดเวลา
            if (currentDate.isBefore(endDate)) {
                activeEvents.push(data);  // เฉพาะเมื่อเหตุการณ์ยังไม่หมดเวลา
            }
        })
        // ตั้งค่าข้อมูลเหตุการณ์ที่ยังไม่หมดเวลา
        setEvent(activeEvents);
        loading('success');
    }

    // เปิดปิด Modal
    const [ModalShow, setModalShow] = useState(false);
    const [SelectedData, setSelectedData] = useState('');
    const openModal = (data) => { 
        setSelectedData(data);
        setModalShow(true);
    }
    const closeModal = () => setModalShow(false);

    return (
        <Container fluid>
            <Navbar />
                <Container className='home-page' style={{flex: 1}}>
                    <b className='midpoint topichead'>FLOW OF PROCESS</ b>
                    <Row className='flow-process mb-5'>
                        {Event && Event.length ? (
                            Event.map((item, index) => (
                                <Col md={6} key={index} className={index % 2 === 1 ? 'item second-column' : 'item'}>
                                    <b className='titleevent wordwarp' style={{fontSize: '18px'}}>{item.EventTopic}</b><br />
                                    <label className='text-clamp wordwarp' style={{fontSize: '16px', marginTop: '5px'}}>{item.EventDescription}</label><br />
                                    <Row>
                                        <Col className='col-7'>
                                            <label className='event-top'><b>Event Dates</b></label><br />
                                            <label className='event'><b>{item.EventStartDate} {item.EventEndDate ? '- ' + item.EventEndDate : null}</b></label>
                                        </Col>
                                        <Col className='col-5 bottomright'>
                                            <Button variant='warning' className='btns' onClick={() => openModal(item)}>More Detail</Button>
                                        </Col>
                                    </Row>
                                </Col>
                            ))
                        ) : null}
                    </Row>
                </Container>
            <Footer />
            <Modaldetailevent show={ModalShow} onHide={closeModal} data={SelectedData} />
        </Container>
    )
    
}
export default Home;