// การนำเข้าและประกาศ Object เมื่อนำมาใช้งานของ Framework สำหรับ React
import { useState } from 'react';
import Calendar from 'react-calendar';

// การนำเข้าและประกาศ Object ให้กับไฟล์สำหรับ React Bootstrap 5
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

const Modals = ({ show, onHide, data }) => {
    // ฟังก์ชันเพื่อตรวจสอบและเพิ่ม class ให้วันที่
    const Date_Start = new Date(data.start_date);
    const formattedStartDate = Date_Start.toLocaleDateString('en-CA');
    const Date_End = new Date(data.end_date);
    const formattedEndDate = Date_End.toLocaleDateString('en-CA');
    const [date, setDate] = useState(new Date());
    const events = [formattedStartDate, formattedEndDate]; // วันที่มีกิจกรรม
    const highlightDates = ({ date, view }) => {
        if (view === 'month') {
            const dateString = date.toLocaleDateString('en-CA'); // แปลงวันที่เป็น 'YYYY-MM-DD'
            if (events.includes(dateString)) {
                return 'highlight'; // เพิ่ม class 'highlight' ถ้าวันนั้นมีใน events
            }
        }
        return null; // ไม่มี class ถ้าไม่เจอ
    };
    
    return (
        <Modal show={show} size='lg' centered onHide={onHide} className='detailevent'>
            <Modal.Body style={{backgroundColor:'#FFFFFF', borderRadius:'10em'}}>
                <Container>
                    <Row>
                        <label style={{fontSize: '36px', fontWeight: 'bold', textAlign: 'center'}}>FLOW OF PROCESS</label>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <div className='calendar-container midpoint'>
                                <Calendar onChange={setDate} value={date}  className='custom-calendar disabled-calendar' tileClassName={highlightDates} locale='en-US' />
                            </div>
                        </Col>
                        <Col md={6} style={{marginTop: '20px'}}>
                            <b className='titleevent' style={{fontSize: '18px'}}>{data.EventTopic}</b><br />
                            <label style={{fontSize: '16px', marginTop: '5px'}}>{data.EventDescription}</label><br />
                            <Row>
                                <Col className='col-12'>
                                    <label style={{fontSize: '16px', marginTop: '30px'}}><b>Event Dates</b></label><br />
                                    <label style={{fontSize: '16px'}}><b>{data.EventStartDate} {data.EventEndDate ? '- ' + data.EventEndDate : null}</b></label>
                                </Col>
                                <Col className='col-12 bottomright mt-4' style={{marginLeft: '20PX'}}>
                                    <Button variant='warning' className='btns' style={{width: '120px'}} onClick={onHide}>Close</Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
    );
};

export default Modals;