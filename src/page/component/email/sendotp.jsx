// การนำเข้าและประกาศ Object ให้กับไฟล์สำหรับ React Bootstrap 5
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// การนำเข้าและประกาศ Object ให้กับรูป Icon สำหรับ React
import Footer from '../footer';

// การนำเข้าและประกาศ Object ให้กับไฟล์สำหรับรูปภาพ
import logofull from '../../../assets/image/logofull.png';

const Sendotp = ({ To, Subject, Description }) => {
    return (
        <Col className='exemail col-11'>
            <Row>
                <Col md={12} className='leftcenter' style={{height: '50px', backgroundColor: '#ffcb0b'}}>
                    <img src={logofull} width='150' height='40' />
                </Col>
                <Col md={12} className='midpoint bodyemail'>
                    <Row>
                        <Col md={12}>
                            <div className='midpoint'>
                                <b id='show_subject' style={{fontSize: '16px', fontWeight: '600px', margin: '0'}}>{Subject ? Subject : 'Subject'}</b>
                            </div>
                            <div className='midpoint'>
                                <label style={{color: '#ba3d4f', fontSize: '30px', fontWeight: '600px', letterSpacing: '25px', margin: '0', marginTop: '20px'}}>000000</label>
                            </div>
                            <div className='midpoint'>
                                <label style={{fontSize: '14px', fontWeight: '600px', margin: '0', marginTop: '20px', textAlign: 'center'}}>
                                    <p id='show_to'>{To ? To : 'To'} email@company.co.th</p>
                                    <p id='show_description'>{Description ? Description : 'Description'}</p>
                                </label>
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

export default Sendotp;