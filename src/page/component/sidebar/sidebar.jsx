// การนำเข้าและประกาศ Object เมื่อนำมาใช้งานของ Framework สำหรับ React
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useRef } from 'react';
// การนำเข้าและประกาศ Object ให้กับไฟล์สำหรับ React Bootstrap 5
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

// การนำเข้าหน้า Page เพื่อ Link ไปหน้าถัดไป และการ Include ไฟล์เสริมที่เราสร้างขึ้นมา
import { alertlogout } from '../sweetalerttwo';
import { logout } from '../connectdatabase';

// การนำเข้าและประกาศ Object ให้กับไฟล์สำหรับ Icon React
import { BsBoxArrowLeft } from 'react-icons/bs';

// การนำเข้าและประกาศ Object ให้กับไฟล์สำหรับรูปภาพ
import logofull from '../../../assets/image/logofull.png';


function Sidebar({ namepage, isOpen, closeSidebar }) {
    const navigate = useNavigate();
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        window.innerWidth <= 1000
      ) {
        closeSidebar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeSidebar]);
    
    return (
        <div ref={sidebarRef} className={`sidebar ${isOpen ? 'open' : ''}`}>
            <Col md={12} style={{height: '70px', marginTop: '10px'}} className='midpoint'>
                <Row style={{width: '100%'}}>
                    <Col className='col-12 midpoint'>
                        <img src={logofull} alt='logo noair' width={180} height={45} className="logo-side" />
                    </Col>
                </Row>
            </Col>
            <Col md={12} className='buttons-container'>
                <Button variant='none' className={namepage === 1 ? 'btnsidebar active' : 'btnsidebar'} onClick={() => navigate('/manageuser')}>
                    <label className='effecttext'>User Management</label>
                </Button>
                <Button variant='none' className={namepage === 2 ? 'btnsidebar active' : 'btnsidebar'} onClick={() => navigate('/dashboard')}>
                    <label className='effecttext'>Dashboard</label>
                </Button>
                <Button variant='none' className={namepage === 3 ? 'btnsidebar active' : 'btnsidebar'} onClick={() => navigate('/manageevent')}>
                    <label className='effecttext'>Manage Event</label>
                </Button>
                <Button variant='none' className={namepage === 4 ? 'btnsidebar active' : 'btnsidebar'} onClick={() => navigate('/manageeval')}>
                    <label className='effecttext'>Manage Evaluation</label>
                </Button>
                <Button variant='none' className={namepage === 5 ? 'btnsidebar active' : 'btnsidebar'} onClick={() => navigate('/manageemail')}>
                    <label className='effecttext'>Manage Email</label>
                </Button>
                {/* <Button variant='none' className='btnsidebarlogoutmoblie'>
                    <label><BsBoxArrowLeft /></label>
                </Button> */}
            </Col>
            <Col md={12} className='logout-container'>
                <Button variant='none' className='btnsidebarlogout' onClick={() => alertlogout(logout)}>
                    <label className='effecttext'>Logout</label>
                </Button>
            </Col>
        </div>

    );
}

export default Sidebar;