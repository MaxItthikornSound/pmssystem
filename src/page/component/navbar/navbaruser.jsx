// การนำเข้าและประกาศ Object เมื่อนำมาใช้งานของ Framework สำหรับ React
import { useNavigate } from 'react-router-dom';

// การนำเข้าและประกาศ Object ให้กับไฟล์สำหรับ React Bootstrap 5
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Navbar  from 'react-bootstrap/Navbar';
import Nav  from 'react-bootstrap/Nav';

// การนำเข้าหน้า Page เพื่อ Link ไปหน้าถัดไป และการ Include ไฟล์เสริมที่เราสร้างขึ้นมา
import { alertlogout } from '../sweetalerttwo';
import { logout } from '../connectdatabase';

// การนำเข้าและประกาศ Object ให้กับไฟล์สำหรับรูปภาพ
import Logo from '../../../assets/image/logofull.png';
import More from '../../../assets/image/More.png';
import { IoLogOut } from 'react-icons/io5';

const Navbaruser = () => {
    const navigate = useNavigate();
    return (
        <nav>
            <Row>
                <Navbar expand='xl' className='bg-body-tertiary custom-navbar'>
                    <Container>
                        <img className='logonoair' src={Logo} alt='logo'/>
                        <div className='ic' style={{order: 1}}>
                            <label style={{cursor: 'pointer'}} onClick={() => alertlogout(logout)}><IoLogOut /></label>
                        </div>
                        <Navbar.Toggle aria-controls='basic-navbar-nav' className='custom-toggle'>
                            <img src={More} alt='menu toggle' style={{ width: '30px', height: '30px' }} />
                        </Navbar.Toggle>
                        <Navbar.Collapse id='basic-navbar-nav'>
                            <Nav className=' me-auto'>
                                <Nav.Link className='home'  onClick={() => navigate('/home')}>Home</Nav.Link>
                                <Nav.Link className='self'  onClick={() => navigate('/self')}>Self Evaluation</Nav.Link>
                                <Nav.Link className='manager' onClick={() => navigate('/manage')}>Manager Evaluation</Nav.Link>
                                <Nav.Link className='staff' onClick={() => navigate('/staff')}>Staff Summary</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </Row>
        </nav>
    )
}

export default Navbaruser;