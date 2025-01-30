// การนำเข้าและประกาศ Object ให้กับไฟล์สำหรับ React Bootstrap 5
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// การนำเข้าและประกาศ Object ให้กับรูป Icon สำหรับ React
import Footer from '../footer';

// การนำเข้าและประกาศ Object ให้กับไฟล์สำหรับรูปภาพ
import logofull from '../../../assets/image/logofull.png';

const Notipms = ({ To, Subject, Description }) => {
    return (
        <Col className='exemail col-11'>
            <Row>
                <Col md={12} className='leftcenter' style={{height: '50px', backgroundColor: '#ffcb0b'}}>
                    <img src={logofull} width='150' height='40' />
                </Col>
                <Col md={12} className='bodyemail'>
                    <Row>
                        <Col md={12} className='textbodyemail'>
                            <div style={{marginTop: '30px', marginLeft: '10px'}}>
                                <b id='show_subject' style={{fontWeight: '600px'}}>{Subject ? Subject : 'เรื่อง'}</b>
                            </div>
                        </Col>
                        <Col md={12} className='textbodyemail'>
                            <div style={{marginTop: '20px', marginLeft: '10px'}}>
                                <b id='show_to' style={{fontWeight: '600px'}}>{To ? To : 'ถึง'}  email@company.co.th</b>
                            </div>
                        </Col>
                        <Col md={12} className='textbodyemail'>
                            <div style={{marginTop: '20px', marginLeft: '10px'}}>
                                <b id='show_subject' style={{fontWeight: '600px'}}>{Description ? Description : 'เนื้อหา'}</b>
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col md={12} style={{fontSize: '16px'}}>
                    <Footer />
                </Col>
            </Row>
        </Col>
    )
}

export default Notipms;