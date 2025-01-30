// การนำเข้าและประกาศ Object เมื่อนำมาใช้งานของ Framework สำหรับ React
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { jwtDecode } from 'jwt-decode';

// การนำเข้าและประกาศ Object ให้กับไฟล์สำหรับ React Bootstrap 5
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import InputGroup from 'react-bootstrap/InputGroup';

// การนำเข้าหน้า Page เพื่อ Link ไปหน้าถัดไป และการ Include ไฟล์เสริมที่เราสร้างขึ้นมา
import Navbar from '../component/navbar/navbaruser';
import { loading } from '../component/sweetalerttwo';
import { CustomSelectStaff } from '../../css/styles';
import { eval_score } from '../component/connectdatabase';
import Footer from '../component/footer';

// การนำเข้าและประกาศ Object ให้กับรูป Icon สำหรับ React
import { BsSearch } from 'react-icons/bs';

const staff = () => {
    const token = localStorage.getItem(import.meta.env.VITE_TOKEN);
    const decoded = jwtDecode(token);
    const username = { id: decoded.EmployeeCode, name: decoded.EmployeeFullNameEN, level: decoded.EmployeeLevel, position: decoded.EmployeePosition, departmentid: decoded.DepartmentID, departmentname: decoded.DepartmentName, supervisor: decoded.SupervisorCode };
    useEffect(() => {
        document.title = 'Staff Summary';
        get_database();
    }, []);

    // ดึงข้อมูลออกมาจากฐานข้อมูล
    const [Employee, setEmployee] = useState({});
    const [FilterEmployee, setFilterEmployee] = useState('');
    const get_database = async () => {
        loading();
        const data_eval_score = await eval_score(username.id, username.level, username.departmentid, 'staff');
        sort(data_eval_score);
        groupByCycle(data_eval_score);
        setEmployee(data_eval_score);
        setFilterEmployee(data_eval_score);
        setFilterData(data_eval_score);
        loading('success');
    }

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

    // ฟังก์ชันกรองข้อมูลในตาราง เมื่อเลือกรอบที่
    const [FilterData, setFilterData] = useState(null); // สถานะสำหรับเก็บรอบที่เลือก
    const handleSelect = (selectedOption) => {
        if (!selectedOption || !Cycle[selectedOption.value]) {
            setFilterData(Employee); // หากไม่มีรอบที่เลือก ให้เคลียร์ข้อมูล
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
        setFilterEmployee(filteredData); // อัปเดตข้อมูลที่กรองแล้ว
        setFilterData(filteredData);
    };

    // อัพเดตการค้นหา
    const handleSearch = (event) => {
        const search = event.target.value;
        const user = FilterEmployee.filter(employee => employee.EmployeeCode.toLowerCase().startsWith(search.toLowerCase()) || employee.EmployeeFullNameEN.toLowerCase().includes(search.toLowerCase()));
        setFilterData(user);
    };

    return (
        <Container fluid>
            <Navbar />
            <Container className='staff-page' style={{flex: 1}}>
                <Row style={{ flex: 1 }}>
                    <Container className='container-fluid'>
                        <Col md={12}>
                            <b className='midpoint topichead' style={{marginBottom: '10px'}}>Staff Summary</b>
                            <div className='flex-container'>
                                <div className='ic1 rightcenter'>
                                    <div className='dlyear'>
                                        <Select options={OptionCycle} className='selectyear' onChange={handleSelect} isClearable={true} placeholder='year' styles={CustomSelectStaff} />
                                    </div>
                                </div>
                            </div>
                            <Table className='table-eval'>
                                <thead>
                                    <tr className='tablehead'>
                                        <th  colSpan= '2' style={{verticalAlign:'middle'}}>
                                            <InputGroup id='inputgroups_password' className='searchtable'>
                                                <InputGroup.Text className='inputicon'><BsSearch className='searchicon'/></InputGroup.Text>
                                                <Form.Control type='text' className='inputtextsearch' onChange={handleSearch} placeholder='Search' />
                                            </InputGroup>
                                        </th>
                                        <th className='th-staff'>position</th>
                                        <th className='th-staff'>Evaluator's</th>
                                        <th className='th-staff'> Self-Apperaisal
                                            <div className='th-staff-self'>
                                                <label className='th-part'>Part 1</label>
                                                <label className='th-part'>Part 2</label>
                                            </div>
                                        </th>
                                        <th className='th-staff'>Manager Apperaisal
                                            <div className='th-staff-manage'>
                                                <label className='th-part'>Part 1</label>
                                                <label className='th-part'>Part 2</label>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {FilterData && FilterData.length ? (
                                        FilterData.map((data, index) => (
                                            <tr key={index} className='tablebody'>
                                                <td style={{width: '40px', backgroundColor: data.EmployeeLevel === 'level_3' || data.EmployeeLevel === 'level_4' || data.EmployeeLevel === 'level_5' ? 'red' : data.EmployeeLevel === 'level_2' ? '#ffcb0b' : '', fontWeight: 'bold', textAlign: 'center', verticalAlign: 'middle'}}>{data.EmployeeLevel === 'level_3' || data.EmployeeLevel === 'level_4' || data.EmployeeLevel === 'level_5' ? 'H' : data.EmployeeLevel === 'level_2' ? 'M' : ''}</td>
                                                <td className='td-staff-n'>{data.EmployeeFullNameEN}</td>
                                                <td className='td-staff'>{data.EmployeePosition}</td>
                                                <td className='td-staff'>{data.NameSupervisor || '-'}</td>
                                                <td>
                                                    <div className='th-staff-self'>
                                                        <label className='td-part' style={{color: data.PartRatingSelf1 ? 'black' : 'red'}}>{data.PartRatingSelf1.toFixed(1)}/{data.FullRatingSelf1.toFixed(1)}</label>
                                                        <label className='td-part' style={{color: data.PartRatingSelf2 ? 'black' : 'red'}}>{data.PartRatingSelf2.toFixed(1)}/{data.FullRatingSelf2.toFixed(1)}</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className='th-staff-manage'>
                                                        <label className='td-part' style={{color: data.PartRatingManager1 ? 'black' : data.SupervisorCode === '-' ? 'black' : 'red'}}>{data.SupervisorCode === '-' ? '-' : data.PartRatingManager1.toFixed(1) + '/' + data.FullRatingManager1.toFixed(1)}</label>
                                                        <label className='td-part' style={{color: data.PartRatingManager2 ? 'black' : data.SupervisorCode === '-' ? 'black' : 'red'}}>{data.SupervisorCode === '-' ? '-' : data.PartRatingManager2.toFixed(1) + '/' + data.FullRatingManager2.toFixed(1)}</label>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : null}
                                </tbody>
                            </Table>
                        </Col> 
                    </Container>
                </Row>
            </Container>
            <Footer />
        </Container>
    )
}
export default staff;