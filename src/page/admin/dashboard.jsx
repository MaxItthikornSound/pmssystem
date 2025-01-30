// การนำเข้าและประกาศ Object เมื่อนำมาใช้งานของ Framework สำหรับ React
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

// การนำเข้าและประกาศ Object ให้กับไฟล์สำหรับ React Bootstrap 5
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Collapse from 'react-bootstrap/Collapse';

// การนำเข้าหน้า Page เพื่อ Link ไปหน้าถัดไป และการ Include ไฟล์เสริมที่เราสร้างขึ้นมา
import Sidebar from '../component/sidebar/sidebar';
import { department, eval_score } from '../component/connectdatabase';
import { Curvechart } from '../component/chart/curvechart';
import { loading, alertsmall } from '../component/sweetalerttwo';
import OpenBtn from '../component/sidebar/openbtn';
import { CustomSelectStaff } from '../../css/styles';

// การนำเข้าและประกาศ Object ให้กับไฟล์สำหรับรูปภาพ
import XLS from '../../assets/image/xls.png';

// การนำเข้าและประกาศ Object ให้กับรูป Icon สำหรับ React
import { BsArrow90DegDown , BsSearch, BsArrowReturnLeft } from 'react-icons/bs';

const Dashboard = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
       setIsSidebarOpen(!isSidebarOpen);
     };
    useEffect(() => {
        document.title = 'Dashboard';
        loading();
        get_database();
    }, []);

    const [Department, setDepartment] = useState('');
    const [FilterDepartment, setFilterDepartment] = useState(0);
    const get_database = async () => {
        const data_eval_score = await eval_score('', '', '', 'dashboard');
        groupByCycle(data_eval_score);
        const data_viewdepartment = await department();
        setDepartment(data_viewdepartment);
        setFilterDepartment(data_viewdepartment);
        loading('success');
    }

    // อัพเดตการค้นหา
    const handleSearch = (event) => {
        const search = event.target.value;
        const departments = Department.filter(department => department.DepartmentID.toLowerCase().startsWith(search.toLowerCase()) || department.DepartmentName.toLowerCase().includes(search.toLowerCase()));
        setFilterDepartment(departments);
    };


    const [openRow, setOpenRow] = useState(null);
    const toggleRow = (rowIndex) => {
        setOpenRow(openRow === rowIndex ? null : rowIndex); // เปิด/ปิดแถว
    };

     // ฟังก์ชันจัดกลุ่มรอบ
     const [OptionCycle, setOptionCycle] = useState('');
     const [Cycle, setCycle] = useState('');
     const groupByCycle = (data) => {
        const cycles = {};
        data.forEach(item => {
            // ใช้ submit1 หากมีค่า ถ้าไม่มีให้ใช้ submit2
            const date = item.DateSelfPart1 || item.DateSelfPart2;
            if (date) {
                const [year, month] = date.split(' ')[0].split('-');
                const cycle = (['06', '07', '08'].includes(month) ? `01-${year}` :
                               ['11', '12'].includes(month) ? `02-${year}` :
                               month === '01' ? `02-${+year - 1}` : null);
                if (cycle) {
                    if (!cycles[cycle]) cycles[cycle] = [];
                    cycles[cycle].push(item);
                }
            }
        });
        // สร้างตัวเลือก options
        const options = Object.keys(cycles).map(cycle => ({
            label: 'รอบที่ ' + cycle,
            value: cycle,
        }));
        setCycle(cycles);
        setOptionCycle(options);
    };

    // ฟังก์ชันกรองข้อมูลในตาราง เมื่อเลือกรอบที่
    const [FilterData, setFilterData] = useState(null); // สถานะสำหรับเก็บรอบที่เลือก
    const [SelectedCycle, setSelectedCycle] = useState('เลือกทุกรอบ');
    const handleSelect = (selectedOption) => {
        if (!selectedOption || !Cycle[selectedOption.value]) {
            setSelectedCycle('เลือกทุกรอบ');
            return;
        }
        // ระบุช่วงวันที่ของรอบที่เลือก
        const [cycleType, year] = selectedOption.value.split('-'); // แยกรหัสรอบ
        const startDate = cycleType === '01' 
            ? new Date(`${year}-06-01`) // เริ่ม 1 มิถุนายน
            : new Date(`${year}-11-01`); // เริ่ม 1 พฤศจิกายน
        const endDate = cycleType === '01' 
            ? new Date(`${year}-08-31`) // สิ้นสุด 31 สิงหาคม
            : new Date(`${+year + 1}-01-31`); // สิ้นสุด 31 มกราคมปีถัดไป
        // กรองข้อมูลที่อยู่ในช่วงวันที่
        const filteredData = Cycle[selectedOption.value].filter(item => {
            const itemDate = new Date(item.DateSelfPart1 || item.DateSelfPart2);
            return itemDate >= startDate && itemDate <= endDate;
        });
        setFilterData(filteredData);
        setSelectedCycle('รอบที่ ' + selectedOption.value);
    };

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
    const downloadCSV = (data, filename = 'StaffSummeryExport.csv') => {
        const result_data = data.map(row => ({ EmployeeID: row.EmployeeID, EmployeeCode: row.EmployeeCode, EmployeeFullNameEN: row.EmployeeFullNameEN, EmployeeFullNameTH: row.EmployeeFullNameTH, EmployeePosition: row.EmployeePosition, Supervisor: row.NameSuperVisor, EmployeeDepartment: row.DepartmentName, EmployeeLevel: row.EmployeeLevel, EmployeeUserType: row.EmployeeUserType, Part1RatingSelf: row.PartRatingSelf1, Part2RatingSelf: row.PartRatingSelf2, Part1RatingManager: row.PartRatingManager1, Part2RatingManager: row.PartRatingManager2, EvaluationRound:  SelectedCycle}));
        const csvContent = '\uFEFF' + convertToCSV(result_data); // เพิ่ม BOM (Byte Order Mark) ที่จุดเริ่มต้น
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }); // สร้าง Blob จาก CSV
        const link = document.createElement('a'); // สร้างลิงก์สำหรับดาวน์โหลด
        link.href = URL.createObjectURL(blob); // แปลง Blob เป็น URL
        link.download = filename; // กำหนดชื่อไฟล์ที่ต้องการดาวน์โหลด
        link.style.display = 'none'; // ซ่อนลิงก์ใน DOM
        document.body.appendChild(link); // เพิ่มลิงก์เข้าไปใน DOM
        link.click(); // จำลองการคลิกเพื่อดาวน์โหลด
        document.body.removeChild(link); // ลบลิงก์ออกจาก DOM หลังการดาวน์โหลด
    };

    return (
        <Container fluid>
            <Row className='m-un h-100'>
                <div style={{width: '250px'}}></div> {/* ทดแทนที่ Sidebar เนื่องจากทำเป็น Position แบบ Fiexd */}
                <OpenBtn onClick={toggleSidebar} />
                <Sidebar namepage={2} isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)}/>
                <Container className='colbody pt-4'>
                    <Row>
                        <Col md={12} className='titletext'>
                            <label>Dashboard</label>
                        </Col>
                        <Col md={12} className='mt-5'>
                            <div className='flex-container'>
                                <div className='ic1 rightcenter'>
                                    <div className='dlyear'>
                                        <Select options={OptionCycle} className='selectyear' onChange={handleSelect} isClearable={true} placeholder='year' styles={CustomSelectStaff} />
                                    </div>
                                    <div className='ic2'>
                                        <img src={XLS} className='exportico' alt='xls' style={{cursor: 'pointer'}} onClick={() => SelectedCycle === 'เลือกทุกรอบ' ? alertsmall('warning', 'กรุณาเลือกรอบการประเมิน') : downloadCSV(FilterData)} />
                                    </div>
                                </div>
                            </div>
                            <Table className='tables' size="sm">
                                <thead>
                                    <tr className='tablehead'>
                                        <th colSpan={3}>
                                            <Form style={{width: '80%'}}>
                                                <Form.Group>
                                                    <InputGroup id='inputgroups_password' className='searchtable'>
                                                        <InputGroup.Text className='inputicon'><BsSearch /></InputGroup.Text>
                                                        <Form.Control type='text' id='search' className='inputtext' onChange={handleSearch} placeholder='Search' />
                                                    </InputGroup>
                                                </Form.Group>
                                            </Form>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {FilterDepartment && FilterDepartment.length ? (
                                        FilterDepartment.map((data, index) => (
                                            <React.Fragment key={index}>
                                                <tr style={{cursor: 'pointer'}} onClick={() => toggleRow(index)}>
                                                <td style={{paddingLeft: '20px', verticalAlign: 'middle'}}><b>{data.DepartmentID}</b></td>
                                                    <td style={{paddingLeft: '20px', verticalAlign: 'middle'}}><b>{data.DepartmentName}</b></td>
                                                     <td style={{fontSize: '24px', textAlign: 'right', verticalAlign: 'middle', paddingRight: '20px'}}><Button variant='link' id={index} style={{ textDecoration: 'none', fontSize: '20px' }}>{openRow === index ? <BsArrow90DegDown style={{transform: 'scaleX(-1)'}} /> : <BsArrowReturnLeft />}</Button></td>
                                                </tr>
                                                <tr>
                                                    <td colSpan='3' style={{ padding: '0', border: 'none' }}>
                                                        <Collapse in={openRow === index}>
                                                            <div style={{ backgroundColor: '#f8f9fa', padding: '10px' }}>
                                                                <div className='midpoint'>
                                                                    <label>กำลังปรับปรุง</label>
                                                                    {/* <Curvechart className='curvechart' /> */}
                                                                </div>
                                                            </div>
                                                        </Collapse>
                                                    </td>
                                                </tr>
                                            </React.Fragment>
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

export default Dashboard;