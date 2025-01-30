import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Footer = () => {
    return (
        <footer>
            <Row className='midpoint' style={{height: '60px', backgroundColor: '#2e2e2e'}}> 
                <Col md={12} style={{textAlign: 'center'}}>
                    <label className='footer-text'style={{color: 'white'}}>©2024 Nok Airlines Public Company Limited. All Right Reserved.</label>
                </Col>
            </Row>
        </footer>
    )
}

export default Footer;