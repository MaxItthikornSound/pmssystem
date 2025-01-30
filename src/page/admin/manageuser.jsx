// การนำเข้าและประกาศ Object เมื่อนำมาใช้งานของ Framework สำหรับ React
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// การนำเข้าและประกาศ Object ให้กับไฟล์สำหรับ React Bootstrap 5
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';

// การนำเข้าหน้า Page เพื่อ Link ไปหน้าถัดไป และการ Include ไฟล์เสริมที่เราสร้างขึ้นมา
import Sidebar from '../component/sidebar/sidebar';
import { viewuser, viewuserall, deleteuser } from '../component/connectdatabase';
import { alertyesornocanceluser } from '../component/sweetalerttwo';
import { loading, alertsmall } from '../component/sweetalerttwo';
import OpenBtn from '../component/sidebar/openbtn';

// การนำเข้าและประกาศ Object ให้กับรูป Icon สำหรับ React  
import { BsSearch } from 'react-icons/bs';
import { FaUserPlus, FaUserEdit, FaUserTimes } from 'react-icons/fa';
import { CiExport } from 'react-icons/ci';

const Manageuser = () => {
    const navigate = useNavigate();
    
    // สำหรับ Sidebar
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    useEffect(() => {
        document.title = 'Manage User';
        get_database('loading');
    }, []);

    // ดึงข้อมูลจากฐานข้อมูลเพื่อทำการนำมาโชว์
    const [User, setUser] = useState('');
    const [UserAll, setUserAll] = useState('');
    const [FilterUser, setFilterUser] = useState('');
    const get_database = async (load) => {
        load ? loading() : null;
        const data_viewuser = await viewuser();
        const data_viewuserall = await viewuserall();
        if (data_viewuser !== 'no_user') {
            sort(data_viewuser);
            setUser(data_viewuser);
            setFilterUser(data_viewuser);
        }
        if (data_viewuserall !== 'no_user') {
            const newData = data_viewuserall.map(({ EmployeeID, EmployeePassword, EmployeeAnnotation, ...rest }) => rest);
            setUserAll(newData);
        }
        load ? loading('success') : null;
    }

    // อัพเดตการค้นหา
    const handleSearch = (event) => {
        const search = event.target.value;
        const user = User.filter(user => user.EmployeeCode.toLowerCase().startsWith(search.toLowerCase()) || user.EmployeeFullNameEN.toLowerCase().includes(search.toLowerCase()));
        setFilterUser(user);
    };

    // ทำการเรียงลำดับของ level
    const sort = (data) => {
        data.sort((a, b) => {
            const levelOrder = {
                level_5: 1, // ระบุลำดับ priority (ตัวเลขยิ่งต่ำยิ่งอยู่ด้านบน)
                level_4: 2,
                level_3: 3, 
                level_2: 4,
                level_1: 5,
            };
            return (levelOrder[a.EmployeeLevel] || 99) - (levelOrder[b.EmployeeLevel] || 99);
        });
    }

    // ฟังก์ชันแปลงข้อมูล JSON เป็น CSV
    const convertToCSV = (data) => {
        const headers = Object.keys(data[0]);
        const csvRows = [
            headers.join(','), // สร้าง header
            ...data.map(row => headers.map(header => `"${row[header] !== undefined ? row[header] : ''}"`).join(',')) // สร้าง rows
        ];
        return csvRows.join('\n');
    };

    // ฟังก์ชันดาวน์โหลดไฟล์ CSV
    const downloadCSV = (data, filename = 'Employee.csv') => {
        const csvContent = '\uFEFF' + convertToCSV(data); // เพิ่ม BOM (Byte Order Mark) ที่จุดเริ่มต้น
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }); // สร้าง Blob จาก CSV
        const link = document.createElement('a'); // สร้างลิงก์สำหรับดาวน์โหลด
        link.href = URL.createObjectURL(blob); // แปลง Blob เป็น URL
        link.download = filename; // กำหนดชื่อไฟล์ที่ต้องการดาวน์โหลด
        link.style.display = 'none'; // ซ่อนลิงก์ใน DOM
        document.body.appendChild(link); // เพิ่มลิงก์เข้าไปใน DOM
        link.click(); // จำลองการคลิกเพื่อดาวน์โหลด
        document.body.removeChild(link); // ลบลิงก์ออกจาก DOM หลังการดาวน์โหลด
    };

    // ลบข้อมูลพนักงาน
    const delete_user = async (id) => {
        const result_deleteuser = await deleteuser(id);
        if (result_deleteuser === 'delete_success') {
            alertsmall('success', 'Delete User Success');
            get_database();
        }
    }

    return (
        <Container fluid>
            <Row className='m-un h-100'>
                <div style={{width: '250px'}}></div> {/* ทดแทนที่ Sidebar เนื่องจากทำเป็น Position แบบ Fiexd */}
                <OpenBtn onClick={toggleSidebar} />
                <Sidebar namepage={1} isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)}/>
                <Container className='colbody pt-4'>
                    <Row>
                        <Col md={12} className='titletext'>
                            <label>User Management</label>
                        </Col>
                        <Col md={12} className='mt-5'>
                            <Table className='tables' size="sm">
                                <thead>
                                    <tr className='tablehead'>
                                        <th colSpan={3}>
                                            <Form style={{width: '80%'}}>
                                                <Form.Group>
                                                    <InputGroup id='inputgroups_password' className='searchtable'>
                                                        <InputGroup.Text className='inputicon'><BsSearch /></InputGroup.Text>
                                                        <Form.Control type='text' id='password_login' className='inputtextsearch' onChange={handleSearch} placeholder='Search' />
                                                    </InputGroup>
                                                </Form.Group>
                                            </Form>
                                        </th>
                                        <th colSpan={2} style={{textAlign: 'right'}}>
                                            {UserAll ? (<b style={{cursor: 'pointer', fontSize: '24px', paddingRight: '20px', fontWeight: 'bold'}} onClick={() => downloadCSV(UserAll)}><CiExport /></b>) : null}
                                            <label style={{cursor: 'pointer', fontSize: '24px', paddingRight: '20px'}} onClick={() => navigate('/adduser')}><FaUserPlus /></label>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {FilterUser && FilterUser.length ? (
                                        FilterUser.map((data, index) => (
                                            <tr key={index}>
                                                <td style={{width: '40px', backgroundColor: data.EmployeeLevel === 'level_3' || data.EmployeeLevel === 'level_4' || data.EmployeeLevel === 'level_5' ? 'red' : data.EmployeeLevel === 'level_2' ? '#ffcb0b' : '', fontWeight: 'bold', textAlign: 'center', verticalAlign: 'middle'}}>{data.EmployeeLevel === 'level_3' || data.EmployeeLevel === 'level_4' || data.EmployeeLevel === 'level_5' ? 'H' : data.EmployeeLevel === 'level_2' ? 'M' : ''}</td>
                                                <td style={{paddingLeft: '20px', verticalAlign: 'middle'}}><b>{data.EmployeeFullNameEN}</b></td>
                                                <td style={{width: '400px', verticalAlign: 'middle'}}>{data.DepartmentName}</td>
                                                <td style={{width: '300px', verticalAlign: 'middle'}}>{data.EmployeePosition}</td>
                                                <td style={{fontSize: '24px', textAlign: 'center', verticalAlign: 'middle'}}>
                                                    {data.EmployeeCode !== 'nok0000' ? (<FaUserEdit className='iconmanageuser' style={{cursor: 'pointer'}} onClick={() => navigate('/edituser', { state: data })} />) : null}
                                                    {data.EmployeeCode !== 'nok0000' ? (<FaUserTimes style={{cursor: 'pointer', color: 'red'}} onClick={() => alertyesornocanceluser(delete_user, data.EmployeeID)} />) : null}
                                                </td>
                                            </tr>
                                        ))
                                    ) : null}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Container>
            </Row>
        </Container>
    )
}

export default Manageuser;