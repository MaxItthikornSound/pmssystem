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
    const get_database = async () => {
        const data_eval_score = await eval_score('', '', '', 'dashboard');
        groupByCycle(data_eval_score)
        const result = data_eval_score.map(arr => arr.length > 0 ? arr[0] : null);;
        const data_viewdepartment = await department();
        setDepartment(data_viewdepartment);
        loading('success');
    }

    // ฟังก์ชันจัดกลุ่มรอบ
    const [OptionCycle, setOptionCycle] = useState('');
    const [Cycle, setCycle] = useState('');
    const groupByCycle = (data) => {
        const cycles = {};
        data.forEach(item => {
            if (item.length) {
                item.forEach(data => {
                    // ใช้ submit1 หากมีค่า ถ้าไม่มีให้ใช้ submit2
                    const date = data.PartSubmit1 || data.PartSubmit2;
                    if (date) {
                        const [year, month] = date.split(' ')[0].split('-');
                        const cycle = (['04', '05', '06', '07', '08', '09'].includes(month) ? `01-${year}` : ['10', '11', '12', '01', '02', '03'].includes(month) ? `02-${month === '01' || month === '02' || month === '03' ? +year - 1 : year}` : null);
                        if (cycle) {
                            if (!cycles[cycle]) cycles[cycle] = [];
                            cycles[cycle].push(data);
                        }
                    }
                });

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
    const [SelectedCycle, setSelectedCycle] = useState('no_pmssystem');
    const [Round, setRound] = useState(''); 
    const handleSelect = (selectedOption) => {
        if (!selectedOption || !Cycle[selectedOption.value]) {
            setSelectedCycle('no_pmssystem');
            return;
        }
        // ระบุช่วงวันที่ของรอบที่เลือก
        const [cycleType, year] = selectedOption.value.split('-'); // แยกรหัสรอบ
        const startDate = cycleType === '01' 
            ? new Date(`${year}-04-01`) // เริ่ม 1 เมษายน
            : new Date(`${year}-10-01`); // เริ่ม 1 ตุลาคม
        const endDate = cycleType === '01' 
            ? new Date(`${year}-09-30`) // สิ้นสุด 31 กันยายน
            : new Date(`${+year + 1}-03-31`); // สิ้นสุด 31 มีนาคมปีถัดไป
        // กรองข้อมูลที่อยู่ในช่วงวันที่
        const filteredData = Cycle[selectedOption.value].filter(item => {
            const itemDate = new Date(item.PartSubmit1 || item.PartSubmit2);
            return itemDate >= startDate && itemDate <= endDate;
        });
        setRound(selectedOption.value)
        setSelectedCycle('รอบที่ ' + selectedOption.value);
        setFilterData(filteredData);
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
    const downloadCSV = (data, filename = 'StaffSummeryExport_' + Round + '.csv') => {
        console.log(data);
        const result_data = data.map(row => ({ EmployeeID: row.EmployeeID, EmployeeCode: row.EmployeeCode, EmployeeFullNameEN: row.EmployeeFullNameEN, EmployeeFullNameTH: row.EmployeeFullNameTH, EmployeePosition: row.EmployeePosition, Supervisor: row.NameSuperVisor, EmployeeDepartment: row.DepartmentName, EmployeeLevel: row.EmployeeLevel, EmployeeUserType: row.EmployeeUserType, TotalPart1Self: parseFloat(row.TotalPart1Self).toFixed(1), TotalPart2Self: parseFloat(row.TotalPart2Self).toFixed(1), TotalPart1Manager: parseFloat(row.TotalPart2Manager).toFixed(1), TotalPart2Manager: parseFloat(row.TotalPart2Manager).toFixed(1), EvaluationRound: SelectedCycle, PartStrenght: row.PartStrenght, PartTopic: row.PartTopic, PartHTCG: row.PartHTCG, PartPeriod: row.PartPeriod, Part5Comment: row.PartComment}));
        console.log(result_data);
        const csvContent = '\uFEFF' + convertToCSV(result_data); // เพิ่ม BOM (Byte Order Mark) ที่จุดเริ่มต้น
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }); // สร้าง Blob จาก CSV
        const link = document.createElement('a'); // สร้างลิงก์สำหรับดาวน์โหลด
        link.href = URL.createObjectURL(blob); // แปลง Blob เป็น URL
        link.download = filename; // กำหนดชื่อไฟล์ที่ต้องการดาวน์โหลด
        link.style.display = 'none'; // ซ่อนลิงก์ใน DOM
        document.body.appendChild(link); // เพิ่มลิงก์เข้าไปใน DOM
        link.click(); // จำลองการคลิกเพื่อดาวน์โหลด
        document.body.removeChild(link); // ลบลิงก์ออกจาก DOM หลังการดาวน์โหลด
    }

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
                                        <img src={XLS} className='exportico' alt='xls' style={{cursor: 'pointer'}} onClick={() => SelectedCycle === 'no_pmssystem' ? alertsmall('warning', 'กรุณาเลือกรอบการประเมิน') : downloadCSV(FilterData)} />
                                    </div>
                                </div>
                            </div>
                            <Row>
                                {SelectedCycle === 'no_pmssystem' ? ( 
                                    <Col md={12} className='mt-4 midpoint' style={{height: '200px', backgroundColor: 'white', fontSize: '30px', borderRadius: '25px', boxShadow: '0px 0px 50px 5px rgba(128, 128, 128, 0.3)'}}>
                                        <label>รอบการประเมินยังไม่ถูกเลือก กรุณาเลือกรอบการประเมิน</label>
                                    </Col>
                                ) : (
                                    <Col md={12} className='mb-4'>
                                        <Row>
                                            <Col md={12} className='mt-4 leftcenter' style={{height: '50px', backgroundColor: 'white', fontSize: '20px', borderRadius: '10px', boxShadow: '0px 0px 50px 5px rgba(128, 128, 128, 0.3)'}}>
                                                <label>ข้อมูลการประเมินสำหรับ{SelectedCycle}</label>
                                            </Col>
                                            {Department.length ? (
                                                Department.map((data, index) => (
                                                    <Col key={index} md={6} className='mt-3'>
                                                        <div className='p-3' style={{backgroundColor: 'white', textAlign: 'center', borderRadius: '25px', boxShadow: '0px 0px 50px 5px rgba(128, 128, 128, 0.3)'}}>
                                                            <label>{data.DepartmentName}</label>
                                                            <Curvechart DepartmentID={data.DepartmentID} Data={FilterData} />
                                                        </div>
                                                    </Col>
                                                ))
                                            ) : null}
                                        </Row>
                                    </Col>
                                )}
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </Row>
        </Container>
    )
}

export default Dashboard;
