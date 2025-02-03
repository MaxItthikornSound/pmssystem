// การนำเข้าและประกาศ Object เมื่อนำมาใช้งานของ Framework สำหรับ React
import { useEffect } from 'react'

// การนำเข้าและประกาศ Object ให้กับไฟล์สำหรับ React Bootstrap 5
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// การนำเข้าหน้า Page เพื่อ Link ไปหน้าถัดไป และการ Include ไฟล์เสริมที่เราสร้างขึ้นมา
import Navbars from '../src/page/component/navbar/navbar';

// การนำเข้าและประกาศ Object ให้กับไฟล์สำหรับรูปภาพ
import Notfounds from '../src/assets/image/notfound2.png'

const Notfound = () => {
    useEffect( () => {
        document.title = 'ไม่พบหน้านี้';
    }, []); 

    return (
        <Container fluid className='vh-100' style={{overflow: 'hidden'}}>
            <Navbars title={'ไม่พบหน้าเว็บนี้'} />
            <Row className='m-un h-100'>
                <Container className='midpoint'>
                    <Row>
                        <Col md={12}>
                            <Row>
                                <Col md={12} className='midpoint'>
                                    <img className='imgnotfound' src={Notfounds} alt="ไม่พบหน้า"/>
                                </Col>
                                <Col md={12} className='textnotfound'>
                                    <label>ไม่พบหน้า กรุณาตรวจสอบ URL อีกครั้ง</label><br />
                                    <label>404 Not Found</label>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </Row>
        </Container>
    )
}

export default Notfound;