// การนำเข้าและประกาศ Object เมื่อนำมาใช้งานของ Framework สำหรับ React
import { useEffect, useState } from 'react';
import Select from 'react-select';

// การนำเข้าและประกาศ Object ให้กับไฟล์สำหรับ React Bootstrap 5
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';

// การนำเข้าหน้า Page เพื่อ Link ไปหน้าถัดไป และการ Include ไฟล์เสริมที่เราสร้างขึ้นมา
import Sidebar from '../component/sidebar/sidebar';
import { Switch_Setting } from '../component/switch';;
import { parttype, changestatustype, viewpart, savefileeval, deletefileeval, add_eval, update_eval, delete_eval } from '../component/connectdatabase';
import { alertsmall, alertdeleteeval, alertdeletefile } from '../component/sweetalerttwo';
import OpenBtn from '../component/sidebar/openbtn';

// การนำเข้าและประกาศ Object ให้กับรูป Icon สำหรับ React
import { ImCross } from 'react-icons/im';
import { FaSave } from 'react-icons/fa';
import { TbSquareRoundedPlusFilled } from 'react-icons/tb';
import { MdOutlineDeleteForever } from 'react-icons/md';
import { LuUpload } from 'react-icons/lu';

const Manageeval = () => {
    // สำหรับ Sidebar
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    useEffect(() => {
        document.title = 'Manage Evaluation';
        get_database('one');
        Evaluation_Part('part1', 'level_1');
    }, []);

    // ดึงช้อมูลจากฐานข้อมูลออกมา
    const [Options, setOptions] = useState({}); // เก็บค่า select ของ part ว่ามี part อะไรบ้าง
    const [SelectedOption, setSelectedOption] = useState(Options[0]); // เก็บค่า select part แรก
    const resetSelectedOption = () => setSelectedOption(Options[0]); // เมื่อทำการเปลี่ยน tab แล้วให้เรียกใช้ function นี้เพื่อทำการ reset part ให้อยู่ part บนสุด
    const [SelectPart, setSelectPart] = useState('part1'); // เก็บค่าของ part เมื่อมีการเลือก part ค่าจะถูกอัพเดทที่นี่
    const get_database = async (tabs) => {
        const data_parttype = await parttype();
        const select_producttype = data_parttype.map(item => ({ value: item.PartTypeID, label: item.PartTypeName, status: tabs === 'one' ? item.PartTypeStatusStaff : tabs === 'two' ? item.PartTypeStatusManager : tabs === 'three' ? item.PartTypeStatusHeadOf : false, file: tabs === 'one' ? item.PartTypeFileStaff : tabs === 'two' ? item.PartTypeFileManager : tabs === 'three' ? item.PartTypeFileHeadOf : null }));
        setOptions(select_producttype);
        setSelectedOption(select_producttype[0]);
    }

    // เมื่อข้อมูล Part มีการเปลี่ยนแปลง
    const [Part, setPart] = useState('');
    const [PartTypeID, setPartTypeID] = useState('');
    const [ValCheck, setValCheck] = useState(false);
    const [Files, setFiles] = useState('');
    const [FilesCurrent, setFilesCurrent] = useState(null);
    useEffect(() => {
        show_txtinput();
        if (Options.length) {
            const SearchPart = Options.find(item => item.value === SelectPart);
            setPartTypeID(SearchPart.value);
            setValCheck(SearchPart.status);
            setFiles(SearchPart.file ? SearchPart.file : 'No file yet.');
            setFilesCurrent(SearchPart.file ? SearchPart.file : null);
            setDataFiles(null);
            setStatusFileChoose(false);
        }
    }, [Part, Options]);

    const [SelectedTab, setSelectedTab] = useState('one');

    // เมื่อทำการเลือก Part จะทำการเปลี่ยนข้อมูลและรูปแบบ
    const [Level, setLevel] = useState('level_1');
    const selectonchangepart = (event, level) => { Evaluation_Part(event.value, level); setSelectedOption(event); };
    const Evaluation_Part = async (part, level) => {
        setSelectPart(part);
        const data_evaluation = await viewpart();
        const filteredData = data_evaluation.filter(data => data.PartLevel === level && data.PartTypeID === part);
        setPart(filteredData);
    }

    // แสดงผลไปยัง input เพื่อทำการโชว์ข้อความ
    const show_txtinput = async () => {
        if (Part) {
            Part.map((data, index) => {
                document.getElementById('topic_' + data.PartLevel + '_' + (index + 1)).value = data.PartTopic;
                SelectPart !== 'part5' ? document.getElementById('weight_' + data.PartLevel + '_' + (index + 1)).value = data.PartWeight : null;
                document.getElementById(`description_` + data.PartLevel + '_' + (index + 1)).value = data.PartDescription;
            });
        }
    }

    // เพิ่ม Topic (เพิ่มแค่กล่องเปล่า ยังไม่ได้บันทึกข้อมูล)
    const [TopicID, setTopicID] = useState(-1);
    const add_topic = (level) => {
        setTopicID((prevTopicID) => prevTopicID - 1);
        const newEntry = {
            PartID: TopicID, // เพิ่ม ID ใหม่ (ไม่ซ้ำ)
            PartLevel: level,
            PartTopic: '',
            PartDescription: '',
        };
        setPart([...Part, newEntry]); // อัปเดต array ด้วยการเพิ่ม object ใหม่
    }

    // เช็คข้อมูลมีการเปลี่ยนแปลงเมื่อข้อมูลมีค่าว่างจะขึ้นกรอบแดงเพื่อให้รู้ว่ามีค่าว่างอยู่ในช่อง แต่ถ้ามีข้อมูลจะลบกรอบแดงออก
    const txtonchange = (event) => {
        const input = event.target.id;
        const parts = input.split('_');
        const word = parts[0];
        const levelAndNumber = parts.slice(1).join('_');
        !event.target.value ? document.getElementById('inputgroups_' + word + '_' + levelAndNumber).style.border = '2px solid red' : document.getElementById('inputgroups_' + word + '_' + levelAndNumber).style.border = '1px solid rgb(222, 226, 230)';
    }

     // อัพเดทคค่าปุ่มเปิด-ปิดในหน้าการตั้งค่า
    const switchonchange = async (event) => {
        const namestatus = SelectedTab === 'one' ? 'PartTypeStatusStaff' : SelectedTab === 'two' ? 'PartTypeStatusManager' : SelectedTab === 'three' ? 'PartTypeStatusHeadOf' : '';
        setValCheck(event.target.checked);
        const result_changestatustype = await changestatustype(SelectPart, namestatus, event.target.checked);
        result_changestatustype === 'updatetstatustype_success' ? alertsmall('success', 'Update Status Success') : null;
    }

    // อัพเดทคำถามของการประเมิน
    const update_evals = async (id, level, index) => {
        const topic = document.getElementById('topic_' + index);
        const weight = document.getElementById('weight_' + index);
        const description = document.getElementById('description_' + index);
        if (!topic.value || !description.value) {
            alertsmall('warning', 'Please fill out the information completely.');
            !topic.value ? document.getElementById('inputgroups_topic_' + index).style.border = '2px solid red' : null
            !weight.value ? document.getElementById('inputgroups_weight_' + index).style.border = '2px solid red' : null
            !description.value ? document.getElementById('inputgroups_description_' + index).style.border = '2px solid red' : null
        } else {
            if (id < 0) {
                // เพิ่มข้อมูลการประเมินใหม่
                const result_addtopic = await add_eval(level, topic.value, SelectPart === 'part5' ? 0 : weight.value, description.value, SelectPart);
                if (result_addtopic === 'addtopic_success') {
                    Evaluation_Part(SelectPart, level);
                    alertsmall('success', 'Add Topic Success');
                }
            } else {
                // อัพเดทข้อมูลการประเมิน
                const result_updatetopic = await update_eval(id, topic.value, SelectPart === 'part5' ? 0 : weight.value, description.value);
                if (result_updatetopic === 'updatetopic_success') {
                    Evaluation_Part(SelectPart, level);
                    alertsmall('success', 'Update Topic Success');
                }
            }
        }
    }

    // ลบคำถามของการประเมิน
    const delete_evals = async (id, level) => {
        if (id < 0) {
            setPart(Part.filter(item => item.PartID !== id));
            return 'success';
        } else {
            const result_delete = await delete_eval(id, SelectPart);
            if (result_delete === 'deletetopic_success') {
                Evaluation_Part(SelectPart, level);
                return 'success';
            }
        }
    }

    const [StatusFileChoose, setStatusFileChoose] = useState(false);
    const [DataFiles, setDataFiles] = useState(null);
    // ทำการเลือกไฟล์เกณฑ์การประเมินเข้ามา
    const choosedfilecsv = (event) => {
        if (event.target.files[0]) {
            setDataFiles(event.target.files[0]);
            setFiles(event.target.files[0].name);
            setStatusFileChoose(true);
        }
    }

    // ลบไฟล์ที่เลือกหรือลบไฟล์ที่มีอยู่
    const deletefile = (statusfile) => {
        if (statusfile) {
            setDataFiles(null);
            setFiles(FilesCurrent || 'No file yet.');
            setStatusFileChoose(false);
        } else {
            alertdeletefile(removefile, PartTypeID, FilesCurrent);
        }
    }

    const removefile = async (id, filename) => {
        const namefiles = SelectedTab === 'one' ? 'PartTypeFileStaff' : SelectedTab === 'two' ? 'PartTypeFileManager' : SelectedTab === 'three' ? 'PartTypeFileHeadOf' : '';
        const result_savefile = await deletefileeval(id, namefiles, filename);
        if (result_savefile === 'deletefileeval_success') {
            alertsmall('success', 'Delete File Criteria Success');
            setFiles('No file yet.')
            setFilesCurrent(null);
            setDataFiles(null);
            setStatusFileChoose(false);
        }
    }

    // บันทึกไฟล์ลงไปยังเซิร์ฟเวอร์และบันทึกชื่อไฟล์ลงไปยังฐานข้อมูล
    const savefile = async () => {
        const namefiles = SelectedTab === 'one' ? 'PartTypeFileStaff' : SelectedTab === 'two' ? 'PartTypeFileManager' : SelectedTab === 'three' ? 'PartTypeFileHeadOf' : '';
        const sendData = new FormData();
        sendData.append('parttypeid', PartTypeID);
        sendData.append('namefiles', namefiles);
        sendData.append('namefilescurrent', FilesCurrent);
        sendData.append('originalname', Files);
        sendData.append('files', DataFiles);
        const result_savefile = await savefileeval(sendData);
        if (result_savefile === 'updatefileeval_success') {
            alertsmall('success', 'Update File Criteria Success');
            setFilesCurrent(Files);
            setDataFiles(null);
            setStatusFileChoose(false);
        }
    }

    return (
        <Container fluid>
            <Row className='m-un h-100'>
                <div style={{width: '250px'}}></div> {/* ทดแทนที่ Sidebar เนื่องจากทำเป็น Position แบบ Fiexd */}
                <OpenBtn onClick={toggleSidebar} />
                <Sidebar namepage={4} isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
                <Container className='colbody pt-4'>
                    <Row>
                        <Col md={12} className='titletext'>
                            <label>Manage Evaluation</label>
                        </Col>
                        <Col md={12} className='mt-5'>
                            <Container>
                                <div className='warpper'>
                                    <input className='radio' id='one' name='group' type='radio' checked={SelectedTab === 'one'} onChange={() => { setSelectedTab('one'); Evaluation_Part('part1', 'level_1'); setLevel('level_1'); resetSelectedOption(); get_database('one'); }} />
                                    <input className='radio' id='two' name='group' type='radio' checked={SelectedTab === 'two'} onChange={() => { setSelectedTab('two'); Evaluation_Part('part1', 'level_2'); setLevel('level_2'); resetSelectedOption(); get_database('two'); }} />
                                    <input className='radio' id='three' name='group' type='radio' checked={SelectedTab === 'three'} onChange={() => { setSelectedTab('three'); Evaluation_Part('part1', 'level_3'); setLevel('level_3'); resetSelectedOption(); get_database('three'); }} />
                                    <div className='tabs'>
                                        <label className='tab' id='one-tab' htmlFor='one'><b>STAFF</b></label>
                                        <label className='tab' id='two-tab' htmlFor='two' style={{marginLeft: '10px'}}><b>MANAGER</b></label>
                                        <label className='tab' id='three-tab' htmlFor='three' style={{marginLeft: '10px'}}><b>HEAD OF</b></label>
                                    </div>
                                    <div className='panels' style={{marginBottom: '30px', padding: '20px', minHeight: '300px'}}>
                                        <div className='panel' id={Level}>
                                            <Row>
                                                <Col className='col-10' style={{marginBottom: '10px'}}>
                                                    <Form>
                                                        <Form.Group className='pb-2'>
                                                            <Select options={Options} className='selectseval' id='part' onChange={(e) => selectonchangepart(e, Level)} value={SelectedOption} placeholder='Part' />
                                                        </Form.Group>
                                                    </Form>
                                                </Col>
                                                <Col className='col-2 rightcenter'>
                                                    <Switch_Setting id={SelectPart} switchonchange={switchonchange} values={ValCheck} />
                                                </Col>
                                                <Col className='col-12 rightcenter mb-2'>
                                                    <div className='rightmid' style={{width: '400px'}}>
                                                        <label className='me-2' style={{textAlign: 'right'}}>{Files}</label>
                                                        <Form>
                                                            <Form.Group className='pb-2'>
                                                                <InputGroup>
                                                                    <Form.Control type='file' id='filecsv' className='choosedfilecsv' onChange={choosedfilecsv} accept='.pdf, .jpg, .jpeg, .png' />
                                                                </InputGroup>
                                                            </Form.Group>
                                                        </Form>
                                                        <Button variant='warning' className='me-2 pc' style={{width: '100px', borderRadius: '20px'}} onClick={() => document.getElementById('filecsv').click()}>Upload</Button>
                                                        <Button variant='warning' className='me-1 moblies' style={{borderRadius: '20px'}} onClick={() => document.getElementById('filecsv').click()}><span style={{fontSize: '18px'}}><LuUpload /></span></Button>
                                                        {StatusFileChoose ? <Button variant='success' className='me-1' style={{borderRadius: '20px'}} onClick={savefile}><span style={{fontSize: '18px'}}><FaSave /></span></Button> : null}
                                                        {Files === 'No file yet.' || !Files ? StatusFileChoose ? <Button variant='danger' style={{borderRadius: '20px'}} onClick={() => deletefile(StatusFileChoose)}><span style={{fontSize: '18px'}}><MdOutlineDeleteForever /></span></Button> : null : <Button variant='danger' style={{borderRadius: '20px'}} onClick={() => deletefile(StatusFileChoose)}><span style={{fontSize: '18px'}}><MdOutlineDeleteForever /></span></Button>}
                                                    </div>
                                                </Col>
                                                {Part && Part.length ? 
                                                    Part.map((data, index) => (
                                                        <Row key={index} className='midpoint'>
                                                            <Col md={12} className='borderbox' style={{width: '97%', height: '290px', borderRadius: '25px', marginBottom: (index + 1) !== Part.length ? '50px' : ''}}>
                                                                <Row className='midpoint' style={{height: '100px'}}>
                                                                    {SelectPart === 'part5' ? (
                                                                        <Col className='col-11'>
                                                                            <Form>
                                                                                <Form.Group>
                                                                                    <Form.Label><b>Topic</b></Form.Label>
                                                                                    <InputGroup id={'inputgroups_topic_' + data.PartLevel + '_' + (index + 1)} className='inputgroups_eval'>
                                                                                        <Form.Control type='text' id={'topic_' + data.PartLevel + '_' + (index + 1)} defaultValue='' onChange={txtonchange} placeholder='Topic' />
                                                                                    </InputGroup>
                                                                                </Form.Group>
                                                                            </Form>
                                                                        </Col>
                                                                    ) : (
                                                                        <>
                                                                            <Col className='col-8'>
                                                                                <Form>
                                                                                    <Form.Group>
                                                                                        <Form.Label><b>Topic</b></Form.Label>
                                                                                        <InputGroup id={'inputgroups_topic_' + data.PartLevel + '_' + (index + 1)} className='inputgroups_eval'>
                                                                                            <Form.Control type='text' id={'topic_' + data.PartLevel + '_' + (index + 1)} defaultValue='' onChange={txtonchange} placeholder='Topic' />
                                                                                        </InputGroup>
                                                                                    </Form.Group>
                                                                                </Form>
                                                                            </Col>
                                                                            <Col className='col-3'>
                                                                                <Form>
                                                                                    <Form.Group>
                                                                                        <Form.Label><b>Weight (%)</b></Form.Label>
                                                                                        <InputGroup id={'inputgroups_weight_' + data.PartLevel + '_' + (index + 1)} className='inputgroups_eval'>
                                                                                            <Form.Control type='number' id={'weight_' + data.PartLevel + '_' + (index + 1)} defaultValue='' onChange={txtonchange} placeholder='Weight' />
                                                                                        </InputGroup>
                                                                                    </Form.Group>
                                                                                </Form>
                                                                            </Col>
                                                                        </>
                                                                    )}
                                                                </Row>
                                                                <Row className='midpoint' style={{height: '100px'}}>
                                                                    <Col className='col-11'>
                                                                        <Form>
                                                                            <Form.Group>
                                                                                <Form.Label><b>Description</b></Form.Label>
                                                                                <InputGroup id={'inputgroups_description_' + data.PartLevel + '_' + (index + 1)} className='inputgroups_eval'>
                                                                                    <Form.Control as='textarea' id={'description_' + data.PartLevel + '_' + (index + 1)} rows={3} style={{resize: 'none'}} defaultValue='' onChange={txtonchange} placeholder='Description' />
                                                                                </InputGroup>
                                                                            </Form.Group>
                                                                        </Form>
                                                                    </Col>
                                                                </Row>
                                                                <Row >
                                                                    <Col md={12} className='rightcenter' style={{marginTop: '35px'}}>
                                                                        <label style={{cursor: 'pointer', fontSize: '24px', marginRight: '20px'}} onClick={() => update_evals(data.PartID, data.PartLevel, data.PartLevel + '_' + (index + 1))}><b><FaSave /></b></label>
                                                                        <label style={{cursor: 'pointer', fontSize: '24px', marginLeft: '20px', marginRight: '15px'}}><b style={{color: 'red'}} onClick={() => alertdeleteeval(delete_evals, data.PartID, data.PartLevel)}><ImCross /></b></label>  
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    ))
                                                    : (
                                                        <Row style={{height: '130px', textAlign: 'center', verticalAlign: 'middle', fontSize: '30px'}}>
                                                            <Col md={12} className='midpoint'>
                                                                <label>There are currently no assessment questions.</label>
                                                            </Col>
                                                        </Row>
                                                    )
                                                }
                                                <Row>
                                                    <Col md={12} style={{display: SelectPart === 'part3' || SelectPart === 'part4' ? 'none' : 'block', textAlign: 'center'}}>
                                                        <label variant='none' style={{cursor: 'pointer', fontSize: '50px'}} onClick={() => add_topic(Level, SelectPart)}><TbSquareRoundedPlusFilled /></label>
                                                    </Col>
                                                </Row>
                                            </Row>
                                        </div>
                                    </div>
                                </div>
                            </Container>
                        </Col>
                    </Row>
                </Container>
            </Row>
        </Container>
    )
}

export default Manageeval;