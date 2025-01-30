// การนำเข้าและประกาศ Object ให้กับไฟล์สำหรับ React Bootstrap 5
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Navbar  from 'react-bootstrap/Navbar';

// การนำเข้าและประกาศ Object ให้กับไฟล์สำหรับรูปภาพ
import logofull from '../../../assets/image/logofull.png';

const Navbars = () => {
    return (
        <nav>
            <Row>
                <Navbar className='navbars'>
                    <Container>
                        <img className='logonoair1' src={logofull} alt='logo'/>
                    </Container>
                </Navbar>
          </Row>
        </nav>
    )
}

export default Navbars;