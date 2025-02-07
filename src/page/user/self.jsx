// การนำเข้าและประกาศ Object เมื่อนำมาใช้งานของ Framework สำหรับ React
import { useEffect, useState } from 'react'
import Select from 'react-select';
import { jwtDecode } from 'jwt-decode';
import { Document, Page, pdfjs } from 'react-pdf';

// นำเข้า CSS ที่เกี่ยวข้องกับ TextLayer
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';  // เพิ่มคำสั่งนี้เพื่อแก้ปัญหาข้อความไม่แสดง

// ตั้งค่า URL ของ pdf.worker.min.js
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// การนำเข้าและประกาศ Object ให้กับไฟล์สำหรับ React Bootstrap 5
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

// การนำเข้าหน้า Page เพื่อ Link ไปหน้าถัดไป และการ Include ไฟล์เสริมที่เราสร้างขึ้นมา
import Navbar from '../component/navbar/navbaruser';
import { checkpms, checksupervisor, parttype, viewpart, criteria, view_eval_part, save_eval_part } from '../component/connectdatabase';
import { loading, alertsmall } from '../component/sweetalerttwo';
import { CustomSelectSelf } from '../../css/styles';
import Footer from '../component/footer';

// การนำเข้าและประกาศ Object ให้กับรูป Icon สำหรับ React
import { TbSquareRoundedPlusFilled, TbSquareRoundedMinusFilled } from 'react-icons/tb';
import { GrLinkPrevious, GrLinkNext } from 'react-icons/gr';

const Self = () => {
    const token = localStorage.getItem(import.meta.env.VITE_TOKEN);
    const decoded = jwtDecode(token);
    const username = { id: decoded.EmployeeCode, name: decoded.EmployeeFullNameEN, level: decoded.EmployeeLevel, position: decoded.EmployeePosition, department: decoded.DepartmentName, supervisor: decoded.SupervisorCode };
    useEffect(() => {
        document.title = 'Self Evaluation';
        checkpmssystem();
        get_database();
    }, []);

    // ดึงข้อมูลจากฐานข้อมูลออกมา
    const [Options, setOptions] = useState({}); // เก็บค่า select ของ part ว่ามี part อะไรบ้าง
    const [SelectedOption, setSelectedOption] = useState(''); // เก็บค่า select part แรก
    const resetSelectedOption = () => setSelectedOption(Options[0]); // เมื่อทำการเปลี่ยน tab แล้วให้เรียกใช้ function นี้เพื่อทำการ reset part ให้อยู่ part บนสุด
    const [SelectPart, setSelectPart] = useState(''); // เก็บค่าของ part เมื่อมีการเลือก part ค่าจะถูกอัพเดทที่นี่
    const get_database = async () => {
        const data_parttype = await parttype();
        const select_parttype = data_parttype.filter(item => username.level === 'level_1' ? item.PartTypeStatusStaff : username.level === 'level_2' ? item.PartTypeStatusManager : item.PartTypeStatusHeadOf === 1).map(item => ({ value: item.PartTypeID, label: item.PartTypeName }));
        if (select_parttype.length) {
            Evaluation_Part(select_parttype[0].value, username.level === 'level_5' || username.level === 'level_4' ? 'level_3' : username.level);
            setOptions(select_parttype);
            setSelectedOption(select_parttype[0]);
            setSelectPart(select_parttype[0].value);
        }
    }

    // เช็คว่ามีข้อมูลหรือไม่ภายใน element นั้น โดยถ้าไม่มีจะให้ขึ้นกรอบสีแดง แต่ถ้ามีข้อมูลให้กลับมาเป็นสีเดิม
    const checkvaluenull = (element, value) => !value ? element.style.border = '2px solid red' : element.style.border = '1px solid rgb(222, 226, 230)';

    // เมื่อมีการกดแท็บ (มีการเปลี่ยนเมื่อแท็บถูกกด)
    const [SelectedTab, setSelectedTab] = useState('one');
    useEffect(() => {
        setPart3([]);
        setPart4([]);
        checkpmssystem();
    }, [SelectedTab])

    // เช็ควันที่เปิด - ปิดการประเมิน
    const [Open, setOpen] = useState(false);
    const checkpmssystem = async () => {
        loading();
        const result_supervisor = await checksupervisor(username.supervisor);
        const statustab = result_supervisor[0].EmployeeLevel === 'level_2' ? 'Manager Evaluate Staff' : result_supervisor[0].EmployeeLevel === 'level_3' || result_supervisor[0].EmployeeLevel === 'level_4' || result_supervisor[0].EmployeeLevel === 'level_5' ? 'Head Of Evaluate Manager' : '';
        if (SelectedTab === 'one') {
            const result_checkpms = await checkpms('Evaluate Self');
            setOpen(result_checkpms);
        } else {
            const result_checkpms = await checkpms(SelectedTab === 'one' ? '' : SelectedTab === 'two' ? statustab : null);
            setOpen(result_checkpms);
        }
        loading('success');
    }

    // เมื่อข้อมูล Part มีการเปลี่ยนแปลง
    const [Part, setPart] = useState([]);
    const [ValueRating, setValueRating] = useState(null);
    const [ValueComment, setValueComment] = useState({});
    useEffect(() => {
        if (Part) {
            getfile_criteria();
            if (SelectPart === 'part1' || SelectPart === 'part2' || SelectPart === 'part5') {
                setValueRating(null);
                setValueComment('');
                let elementcomment = [];
                Part.map(data => {
                    const idrating = 'rating_' + SelectPart + '_' + data.PartLevel + '_' + data.PartID;
                    const idcomment = 'comment_' + SelectPart + '_' + data.PartLevel + '_' + data.PartID;
                    elementcomment.push(idcomment);
                    Open ? document.getElementById(idrating).style.border = '1px solid rgb(222, 226, 230)' : null;
                    Open ? document.getElementById(idcomment).style.border = '1px solid rgb(222, 226, 230)' : null;
                    setValueRating((prevValues) => ({ ...prevValues, [idrating]: 0 }));
                    setValueComment((prevValues) => ({ ...prevValues, [idcomment]: '' }));
                    SelectPart ? SelectedTab === 'one' ? get_eval(SelectPart, username.id, username.id, elementcomment) : SelectedTab === 'two' ? get_eval(SelectPart, username.id, username.supervisor, elementcomment) : null : null;
                });
            } else if (SelectPart === 'part3') {
                SelectPart ? SelectedTab === 'one' ? get_eval(SelectPart, username.id, username.id) : SelectedTab === 'two' ? get_eval(SelectPart, username.id, username.supervisor) : null : null;
            } else if (SelectPart === 'part4') {
                SelectPart ? SelectedTab === 'one' ? get_eval(SelectPart, username.id, username.id) : SelectedTab === 'two' ? get_eval(SelectPart, username.id, username.supervisor) : null : null;
            }
        }
    }, [Part]);

    // ดึงไฟล์เกณฑ์การให้คะแนน
    const [File, setFile] = useState(null); // URL ของไฟล์
    const [FileType, setFileType] = useState(null); // ประเภทไฟล์ (PDF หรือรูปภาพ)
    const [isPopupVisible, setPopupVisible] = useState(false); // แสดง Popup หรือไม่
    const [Criteria, setCriteria] = useState(''); // เก็บค่าของเกณฑ์การให้คะแนน
    const [pageNumber, setPageNumber] = useState(1); // กำหนดหน้าเริ่มต้นเป็นหน้า 1
    const [numPages, setNumPages] = useState(null); // กำหนดจำนวนหน้าของไฟล์ PDF
    const [scale, setScale] = useState(0.7); // การปรับขนาด (scale) ของ PDF
    const [Mode, setMode] = useState(true);
    const getfile_criteria = async () => {
        if (SelectPart) {
            const namefiles = username.level === 'level_1' ? 'PartTypeFileStaff' : username.level === 'level_2' ? 'PartTypeFileManager' : username.level === 'level_3' || username.level === 'level_4' || username.level === 'level_5' ? 'PartTypeFileHeadOf' : '';
            const data_criteria = await criteria(SelectPart, namefiles);
            setCriteria(data_criteria);
            const FileURL = URL.createObjectURL(data_criteria);
            data_criteria.type === 'application/pdf' ? setFileType('pdf') : data_criteria.type.startsWith('image/') ? setFileType('image') : null;
            setFile(FileURL);
        }
    }
    
    // เปิด-ปิด Popup
    const criteriafile = (status) => setPopupVisible(status);

    // ใช้ useEffect เพื่อตรวจสอบขนาดหน้าจอและตั้งค่า scale
    useEffect(() => {
        const updateScale = () => {
            // ตรวจสอบขนาดของหน้าจอและตั้งค่า scale
            if (window.innerWidth < 768) {
                setScale(0.7); // ถ้าเป็นมือถือให้ตั้งค่า scale เป็น 0.7
                setMode(false);
            } else {
                setScale(1); // ถ้าเป็นคอมพิวเตอร์ให้ตั้งค่า scale เป็น 1
                setMode(true);
            }
        };
        // เรียกใช้ฟังก์ชันทันทีที่เริ่มทำงาน
        updateScale();
        // เพิ่ม event listener เพื่อจับการเปลี่ยนขนาดหน้าจอ
        window.addEventListener('resize', updateScale);
        // ลบ event listener เมื่อ component ถูกทำลาย
        return () => window.removeEventListener('resize', updateScale);
    }, []); // useEffect นี้จะทำงานเพียงครั้งเดียวหลังจากที่ component ถูก render

    // เมื่อไฟล์ PDF โหลดสำเร็จ
    const onDocumentLoadSuccess = ({ numPages }) => setNumPages(numPages);

    // ดึงข้อมูลที่ประเมินแล้วออกมา
    const [Eval, setEval] = useState(false)
    const [Rating, setRating] = useState('');
    const get_eval = async (part, employeecode, evaluatorcode, element1) => {
        const newpart = part.charAt(0).toUpperCase() + part.slice(1);
        const score_eval = await view_eval_part(newpart, employeecode, evaluatorcode);
        if (score_eval !== 'no_score') {
            setEval(true);
            if (SelectPart === 'part1' || SelectPart === 'part2') {
                score_eval.map((data, index) => {
                    setRating((prevValues) => ({ ...prevValues, [index]: data.PartRating }));
                    document.getElementById(element1[index]) ? document.getElementById(element1[index]).value = data.PartComment : null;
                });
            } else if (SelectPart === 'part3') {
                score_eval.map(data => {
                    if (Part3.length === 0) {
                        add_part3(data.PartStrenght, data.PartTopic, data.PartHTCG, data.PartPeriod);
                    }
                });
            } else if (SelectPart === 'part4') {
                score_eval.map(data => {
                    if (Part4.length === 0) {
                        add_part4(data.PartImpact, data.PartPO, data.Period, data.PartProjectDetail);
                    }
                });
            } else if (SelectPart === 'part5') {
                score_eval.map((data, index) => {
                    document.getElementById(element1[index]).value = data.PartComment;
                });
            }
        } else {
            setEval(false);
            if (SelectPart === 'part1' || SelectPart === 'part2' || SelectPart === 'part5') {
                setRating({});
                Open ? element1.map(data => document.getElementById(data) ? document.getElementById(data).value = '' : null) : null;
            } else if (SelectPart === 'part3') {
                if (Part3.length === 0) {
                    add_part3('', '', '', '');
                }
            } else if (SelectPart === 'part4') {
                if (Part4.length === 0) {
                    add_part4('', '', '', '');
                }
            }
        }
    }

    const OptionsImpact = [{ value: 'Financial Impact (ผลกระทบด้านการเงิน)', label: 'Financial Impact (ผลกระทบด้านการเงิน)' }, { value: 'Customer Impact (ผลกระทบต่อลูกค้า)', label: 'Customer Impact (ผลกระทบต่อลูกค้า)' }, { value: 'Internal Process Impact (ผลกระทบต่อกระบวนการภายใน)', label: 'Internal Process Impact (ผลกระทบต่อกระบวนการภายใน)' }, { value: 'Learning and Growth Impact (ผลกระทบด้านการเรียนรู้และการเติบโต)', label: 'Learning and Growth Impact (ผลกระทบด้านการเรียนรู้และการเติบโต)' }]
    const Optionsnumber = [{ value: 1, label: 1 }, { value: 2, label: 2 }, { value: 3, label: 3 }, { value: 4, label: 4 }, { value: 5, label: 5 }];

    // เมื่อทำการเลือก Part จะทำการเปลี่ยนข้อมูลและรูปแบบ
    const [Level, setLevel] = useState(username.level === 'level_5' || username.level === 'level_4' ? 'level_3' : username.level);
    const selectonchangepart = (event, level) => { Evaluation_Part(event.value, level); setSelectedOption(event); };
    const Evaluation_Part = async (part, level) => {
        setSelectPart(part);
        if (part === 'part1' || part === 'part2' || part === 'part5') {
            const data_evaluation = await viewpart();
            const filteredData = data_evaluation.filter(data => data.PartLevel === level && data.PartTypeID === part);
            setPart(filteredData);
        } else if (part === 'part3' || part === 'part4') {
            setPart([{ strength: '', topic: '', gap: '', period: '' }]);
        }
    }
    
    // สำหรับ Part3
    const [Part3, setPart3] = useState([]);
    const add_part3 = (strenght, topic, htcg, period) => {
        setPart3((prevPart3) => {
            const newPartNo = prevPart3.length > 0 ? prevPart3[prevPart3.length - 1].PartNo + 1 : 1;
            return [...prevPart3, { PartNo: newPartNo, Strenght: strenght, Topic: topic, HTCG: htcg, Period: period }];
        });
    };
    const delete_part3 = (id) => setPart3((prevPart3) => prevPart3.filter((part) => part.PartNo !== id));

    // สำหรับ Part4
    const [Part4, setPart4] = useState([]);
    const add_part4 = (impact, PO, period, project) => {
        setPart4((prevPart4) => {
            const newPartNo = prevPart4.length > 0 ? prevPart4[prevPart4.length - 1].PartNo + 1 : 1;
            return [...prevPart4, { PartNo: newPartNo, Impact: impact, PO: PO, Period: period, Project: project }];
        });
    };
    const delete_part4 = (id) => setPart4((prevPart4) => prevPart4.filter((part) => part.PartNo !== id));

    // เช็คข้อมูลมีการเปลี่ยนแปลงเมื่อข้อมูลมีค่าว่างจะขึ้นกรอบแดงเพื่อให้รู้ว่ามีค่าว่างอยู่ในช่อง แต่ถ้ามีข้อมูลจะลบกรอบแดงออก สำหรับ Select
    const selectonchange = (event, id, val) => {
        const element = document.getElementsByClassName('css-t3ipsp-control');
        checkvaluenull(element[0], event);
        const number = parseInt(id.match(/\d+$/)[0], 10);
        if (SelectPart === 'part1' || SelectPart === 'part2' || SelectPart === 'part5') {
            event ? setValueRating((prevValues) => ({ ...prevValues, [id]: event.value })) : setValueRating((prevValues) => ({ ...prevValues, [id]: 0 }));
        } else if (SelectPart === 'part4') {
            event ? setPart4(Part4.map(row => row.PartNo === number ? { ...row, [val]: event} : row)) : setPart4(Part4.map(row => row.PartNo === number ? { ...row, [val]: '' } : row));
        }
    }
    
    // เช็คข้อมูลมีการเปลี่ยนแปลงเมื่อข้อมูลมีค่าว่างจะขึ้นกรอบแดงเพื่อให้รู้ว่ามีค่าว่างอยู่ในช่อง แต่ถ้ามีข้อมูลจะลบกรอบแดงออก สำหรับ Input
    const txtonchange = (event, val) => {
        const id = event.target.id;
        checkvaluenull(event.target, event.target.value);
        const number = parseInt(id.match(/\d+$/)[0], 10);
        val === 'comment' ? setValueComment((prevValues) => ({ ...prevValues, [id]: event.target.value })) : null
        if (SelectPart === 'part3') {    
            setPart3(Part3.map(row => row.PartNo === number ? { ...row, [val]: event.target.value } : row));
        } else if (SelectPart === 'part4') {
            setPart4(Part4.map(row => row.PartNo === number ? { ...row, [val]: event.target.value } : row));
        }
    }

    // ให้วนลูปใน object css-13cymwt-control
    const objectkey = (value) => {
        let number = 0;
        Object.keys(value).forEach((id, index) => {
            const TypePart = id.split("_");
            if (TypePart[0] === 'rating') {
                const element = document.getElementsByClassName('css-13cymwt-control');
                checkvaluenull(element[index + 1], value[id]);
            } else {
                const element = document.getElementById(id);
                checkvaluenull(element, value[id]);
            }
            !value[id] ? number = number + 1 : null;
        });
        return number;
    }

    // เช๊คค่าว่างสำหรับ Part3 และ Part4
    const checkvalue = (data) => {
        if (SelectPart === 'part3') {
            let numberstrenght = 0, numbertopic = 0, numberhtcg = 0, numberperiod = 0;
            data.map(item => {
                const idstrenght = 'strenght_' + SelectPart + '_' + item.PartNo;
                const idtopic = 'topic_' + SelectPart + '_' + item.PartNo;
                const idhtcg = 'htcg_' + SelectPart + '_' + item.PartNo;
                const idperiod = 'period_' + SelectPart + '_' + item.PartNo;
                checkvaluenull(document.getElementById(idstrenght), item.Strenght);
                checkvaluenull(document.getElementById(idtopic), item.Topic);
                checkvaluenull(document.getElementById(idhtcg), item.HTCG);
                checkvaluenull(document.getElementById(idperiod), item.Period);
                item.Strenght ? numberstrenght = 0 : numberstrenght = 1;
                item.Topic ? numbertopic = 0 : numbertopic = 1;
                item.HTCG ? numberhtcg = 0 : numberhtcg = 1;
                item.Period ? numberperiod = 0 : numberperiod = 1;
            });
            return numberstrenght + numbertopic + numberhtcg + numberperiod;
        } else if (SelectPart === 'part4') {
            let numberimpact = 0, numberpo = 0, numberperiod = 0, numberproject = 0;
            data.map((item, index) => {
                const idimpct = 'css-13cymwt-control';
                const idpo = 'po_' + SelectPart + '_' + item.PartNo;
                const idperiod = 'period_' + SelectPart + '_' + item.PartNo;
                const idproject = 'project_' + SelectPart + '_' + item.PartNo;
                checkvaluenull(document.getElementsByClassName(idimpct)[index + 1], item.Impact);
                checkvaluenull(document.getElementById(idpo), item.PO);
                checkvaluenull(document.getElementById(idperiod), item.Period);
                checkvaluenull(document.getElementById(idproject), item.Project);
                item.Impact ? numberimpact = 0 : numberimpact = 1;
                item.PO ? numberpo = 0 : numberpo = 1;
                item.Period ? numberperiod = 0 : numberperiod = 1;
                item.Project ? numberproject = 0 : numberproject = 1;
            });
            return numberimpact + numberpo + numberperiod + numberproject;
        }
    }

    // บันทึกข้อมูลใหม่และข้อมูลการแก่ไข
    const save_eval = async (part) => {
        let numberrating = 0, numbercomment = 0, numberpart3 = 0, numberpart4 = 0;
        const newpart = SelectPart.charAt(0).toUpperCase() + SelectPart.slice(1);
        if (part === 'part1' || part === 'part2') {
            numberrating = objectkey(ValueRating);
            numbercomment = objectkey(ValueComment);
            if (numberrating === 0 && numbercomment === 0) {
                loading();
                const data = { part: newpart, employeecode: username.id, evaluatorcode: username.id, rating: ValueRating, comment: ValueComment, type: 'self' }
                const result_save_eval_part = await save_eval_part(data);
                if (result_save_eval_part === 'saveeval_success') {
                    setEval(true);
                    const transformedObject = Object.values(ValueRating).reduce((acc, value, index) => {
                        acc[index] = value; // ใช้ index เป็นคีย์ใหม่
                        return acc;
                    }, {});
                    setRating(transformedObject);
                    alertsmall('success', 'Successfully completed the assessment.');
                }
            }
        } else if (part === 'part3') {
            numberpart3 = checkvalue(Part3);
            if (numberpart3 === 0) {
                loading();
                const data = { part: newpart, employeecode: username.id, evaluatorcode: username.id, strenght: Part3.map(row => row.Strenght), topic: Part3.map(row => row.Topic), htcg: Part3.map(row => row.HTCG), period: Part3.map(row => row.Period), type: 'self' }
                const result_save_eval_part = await save_eval_part(data);
                if (result_save_eval_part === 'saveeval_success') {
                    setEval(true);
                    alertsmall('success', 'Successfully completed the assessment.');
                }
                
            }
        } else if (part === 'part4') {
            numberpart4 = checkvalue(Part4);
            if (numberpart4 === 0) {
                loading();
                const data = { part: newpart, employeecode: username.id, evaluatorcode: username.id, impact: Part4.map(row => row.Impact), po: Part4.map(row => row.PO), period: Part4.map(row => row.Period), project: Part4.map(row => row.Project), type: 'self' }
                const result_save_eval_part = await save_eval_part(data);
                if (result_save_eval_part === 'saveeval_success') {
                    setEval(true);
                    alertsmall('success', 'Successfully completed the assessment.');
                }
                
            }
        } else if (part === 'part5') {
            numbercomment = objectkey(ValueComment);
            if (numbercomment === 0) {
                loading();
                const data = { part: newpart, employeecode: username.id, evaluatorcode: username.id, comment: ValueComment, type: 'self' };
                const result_save_eval_part = await save_eval_part(data);
                if (result_save_eval_part === 'saveeval_success') {
                    setEval(true);
                    alertsmall('success', 'Successfully completed the assessment.');
                }
            }
        }
    }


    return (
        <Container fluid>
            <Navbar />
            <Container style={{ flex: 1 }}>
                <Row>
                    <Col md={12}>
                        <b className='midpoint topichead'>Self-Evaluation</b>
                    </Col>
                    <div className='headname'>
                        <div className='detail'>
                            <b>Nok Id:</ b>
                            <div className='b-detail bid'><span>{username.id}</span></div>
                        </div>
                        <div className='detail'>
                            <b className='b-name'>Name:</ b>
                            <div className='b-detail bname'><span>{username.name}</span></div>
                        </div>
                        <div className='detail '>
                            <b>Position:</ b>
                            <div className='b-detail bposition'><span>{username.position}</span></div>
                        </div>
                        <div className='detail'>
                            <b className='b-depart'>Department:</ b>
                            <div className='b-detail bdepart'><span>{username.department}</span></div>
                        </div>
                    </div>

                    <Col md={12}>
                        <div className='mt-2'>
                            <div className='warpper'>
                                <input className='radio' id='one' name='group' type='radio' checked={SelectedTab === 'one'} onChange={() => { setSelectedTab('one'); Evaluation_Part('part1', username.level === 'level_5' || username.level === 'level_4' ? 'level_3' : username.level); resetSelectedOption(); }} />
                                <input className='radio' id='two' name='group' type='radio' checked={SelectedTab === 'two'} onChange={() => { setSelectedTab('two'); Evaluation_Part('part1', username.level === 'level_5' || username.level === 'level_4' ? 'level_3' : username.level); resetSelectedOption(); }} />
                                <div className='tabs'>
                                    <label className='tabself' id='one-tab' htmlFor='one'><b>Self-Evaluation </b></label>
                                    <label className='tabself' id='two-tab' htmlFor='two' style={{display: username.supervisor === '-' ? 'none' : '', marginLeft: '10px'}}><b>Manager</b></label>
                                </div>
                                <div className='panels' style={{marginBottom: '30px', padding: '20px', minHeight: '300px'}}>
                                    {Open ? (
                                        <div className='panel' id='self'>
                                            <Row>
                                                <Col md={12} style={{marginBottom: '10px'}}>
                                                    <Row>
                                                        <Col className='col-6'>
                                                            <Form>
                                                                <Form.Group className='pb-2'>
                                                                    <Select options={Options} className='selectpart' id='part' onChange={(e) => selectonchangepart(e, Level)} value={SelectedOption} placeholder='Part' />
                                                                </Form.Group>
                                                            </Form>
                                                        </Col>
                                                        <Col className='col-6' style={{textAlign: 'right'}}>
                                                            {Criteria.type !== 'text/html' && Criteria.type !== 'text/html;charset=utf-8' ? (<Button variant='warning' style={{width: '150px', borderRadius: '25px'}} onClick={() => criteriafile(true)}>เกณฑ์ประเมิน</Button>) : null}
                                                            {isPopupVisible && (
                                                                <div style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                                                    <div style={{width: '90%', height: '90%', borderRadius: '8px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                                                        {/* แสดง PDF หรือรูปภาพ */}
                                                                        {FileType === 'pdf' ? (
                                                                            <div className='pdf'>
                                                                                <button className='btnpdf' onClick={() => criteriafile(false)}>&times;</button>
                                                                                {Mode ? (
                                                                                     <iframe src={File} title='PDF Preview' style={{width: '100%', height: '100%', border: 'none'}} />
                                                                                ) : (
                                                                                    <>
                                                                                        <Document file={File} onLoadSuccess={onDocumentLoadSuccess}>
                                                                                            <Page pageNumber={pageNumber} renderTextLayer={false} scale={scale} />
                                                                                        </Document>
                                                                                        {/* ปุ่ม "ย้อนกลับไปหน้าแรก" และ "ถัดไป" อยู่ด้านล่าง */}
                                                                                        <div className='bodybtnpage'>
                                                                                            {/* ปุ่มย้อนกลับไปหน้าแรก */}
                                                                                            <Button variant='none' style={{padding: '10px 20px', color: 'white', fontSize: '20px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px'}} onClick={() => setPageNumber(pageNumber - 1)} disabled={pageNumber <= 1}><GrLinkPrevious /></Button>
                                                                                            <label style={{color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '10px'}}>{pageNumber}</label>
                                                                                            {/* ปุ่มไปหน้าถัดไป */}
                                                                                            <Button variant='none' style={{textAlign: 'center', padding: '10px 20px', color: 'white', fontSize: '20px', border: 'none', borderRadius: '5px', cursor: 'pointer'}}  onClick={() => setPageNumber(pageNumber + 1)} disabled={pageNumber >= numPages}><GrLinkNext /></Button>
                                                                                        </div>
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                        ) : (
                                                                            <>
                                                                                <button className='btnpdf' onClick={() => criteriafile(false)}>&times;</button>
                                                                                <img src={File} alt='Image Preview' style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block', aspectRatio: 'auto', ...(FileType === 'image' && { objectFit: 'cover', }), }} />
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                {Part && Part.length ?
                                                    SelectPart === 'part1' || SelectPart === 'part2' || SelectPart === 'part5' ? (
                                                        <div>
                                                            {Part.map((data, index) => (
                                                                <Row key={index} className='midpoint mt-3'>
                                                                    <Col className='col-6'>
                                                                        <b className='topic'>{data.PartTopic}</b><br />
                                                                        <label className='description'>{data.PartDescription}</label>
                                                                    </Col>
                                                                    <Col className='col-6'>
                                                                        <Row>
                                                                            <Col md={2} className='topcenter mt-3' style={{display: SelectPart === 'part5' ? 'none' : ''}}>
                                                                                <Form.Control type='text' style={{width: '90%', textAlign: 'center'}} value={data.PartWeight || ''} readOnly={true} placeholder='Weight' />
                                                                            </Col>
                                                                            <Col md={4} className='topcenter mt-3' style={{display: SelectPart === 'part5' ? 'none' : ''}}>
                                                                                {SelectedTab === 'two' || Eval ? (
                                                                                    <Form.Control type='text' style={{width: '90%'}} id={'rating_' + SelectPart + '_' + Level + '_' + data.PartID} value={Rating[index] || ''} readOnly={true} placeholder='Rating' />
                                                                                ) : (
                                                                                    <Select options={Optionsnumber} key={data.PartID} className='selectself' id={'rating_' + SelectPart + '_' + Level + '_' + data.PartID} onChange={(e) => selectonchange(e, 'rating_' + SelectPart + '_' + Level + '_' + data.PartID, 'rating', index)} value={ValueRating ? ValueRating[index] : null} isClearable='true' menuPortalTarget={document.body} placeholder='Select rating' />
                                                                                )}
                                                                            </Col>
                                                                            <Col  md={SelectPart === 'part5' ? 12 : 6} className='topcenter mt-3'>
                                                                                <Form className='selectself' onSubmit={(e) => e.preventDefault()}>
                                                                                    <Form.Group>
                                                                                        <InputGroup>
                                                                                            <Form.Control className='comment'as='textarea' id={'comment_' + SelectPart + '_' + Level + '_' + data.PartID} rows={3} style={{ resize: 'none', borderRadius: '10px' }} onChange={(e) => txtonchange(e, 'comment')} readOnly={SelectedTab === 'two' || Eval} placeholder='Comment' />
                                                                                        </InputGroup>
                                                                                    </Form.Group>
                                                                                </Form>
                                                                            </Col>
                                                                        </Row>
                                                                    </Col>
                                                                </Row>
                                                            ))}
                                                            <Row className='midpoint'>
                                                                <Col md={3} className='mt-4'>
                                                                    <Button variant='warning' className='btns' style={{display: SelectedTab === 'two' ? 'none' : !Eval ? 'block' : 'none'}} onClick={() => save_eval(SelectPart)}>Submit</Button>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    ) : SelectPart === 'part3' ? (
                                                        Part3 && Part3.length ? (
                                                            <div>
                                                                <Row>
                                                                    <Col md={12}>
                                                                        {Part3.map((data, index) => (
                                                                            <div key={index}>
                                                                                {index > 0 && (
                                                                                    <hr className='row-divider' />
                                                                                )}
                                                                                <div className='boxrow' key={index}>
                                                                                    <div className='gtopic1'>
                                                                                        <h6 className='hidden-text'><b>Area of Development</b></h6>
                                                                                        <Col md={4} style={{ padding: '10px' }} className='lineborder item1'>
                                                                                            <Form onSubmit={(e) => e.preventDefault()}>
                                                                                                <Form.Group style={{ textAlign: 'center' }}>
                                                                                                    <Form.Label><b>Strenght</b></Form.Label>
                                                                                                    <InputGroup className='no-shadow-box'>
                                                                                                        <Form.Control as='textarea' id={'strenght_part3_' + data.PartNo} value={data.Strenght} onChange={(e) => txtonchange(e, 'Strenght')} style={{resize:'none'}} className='topic-box' readOnly={SelectedTab === 'two' || Eval} placeholder='Strenght' />
                                                                                                    </InputGroup>
                                                                                                </Form.Group>
                                                                                            </Form>
                                                                                        </Col>
                                                                                    </div>
                                                                                    <div className='gtopic2'>
                                                                                        <h6 className='visibility-text'><b>Area of Development</b></h6>
                                                                                        <Col md={7} style={{  padding: '10px' }} className='lineborder item2'>
                                                                                            <Row>
                                                                                                <Col md={4}>
                                                                                                    <Form onSubmit={(e) => e.preventDefault()}>
                                                                                                        <Form.Group style={{ textAlign: 'center' }}>
                                                                                                            <Form.Label><b>Topic</b></Form.Label>
                                                                                                            <InputGroup id='' className='no-shadow-box auto-resize'>
                                                                                                                <Form.Control as='textarea' id={'topic_part3_' + data.PartNo} value={data.Topic} onChange={(e) => txtonchange(e, 'Topic')} row={1} className='topic-box auto-resize' readOnly={SelectedTab === 'two' || Eval} placeholder='Topic' />
                                                                                                            </InputGroup>
                                                                                                        </Form.Group>
                                                                                                    </Form>
                                                                                                </Col>
                                                                                                <Col md={4}>
                                                                                                    <Form onSubmit={(e) => e.preventDefault()}>
                                                                                                        <Form.Group style={{ textAlign: 'center' }}>
                                                                                                            <Form.Label><b>How to close the gap</b></Form.Label>
                                                                                                            <InputGroup id='' className='no-shadow-box'>
                                                                                                                <Form.Control as='textarea' id={'htcg_part3_' + data.PartNo} value={data.HTCG} onChange={(e) => txtonchange(e, 'HTCG')} style={{resize:'none'}} className='topic-box' readOnly={SelectedTab === 'two' || Eval} placeholder='How to close the gap' />
                                                                                                            </InputGroup>
                                                                                                        </Form.Group>
                                                                                                    </Form>
                                                                                                </Col>
                                                                                                <Col md={4}>
                                                                                                    <Form onSubmit={(e) => e.preventDefault()}>
                                                                                                        <Form.Group style={{ textAlign: 'center' }}>
                                                                                                            <Form.Label><b>Period</b></Form.Label>
                                                                                                            <InputGroup className='no-shadow-box d-flex justify-content-between align-items-center'>
                                                                                                                <Form.Control as='textarea' id={'period_part3_' + data.PartNo} value={data.Period} onChange={(e) => txtonchange(e, 'Period')} style={{resize:'none'}} className='topic-box' readOnly={SelectedTab === 'two' || Eval} placeholder='Period' />
                                                                                                            </InputGroup>

                                                                                                        </Form.Group>
                                                                                                    </Form>
                                                                                                </Col>
                                                                                                {Part3.length > 1 && (
                                                                                                    <label className='btn3' style={{display: !Eval ? 'block' : 'none', cursor: 'pointer', fontSize: '30px', marginLeft: '10px', textAlign: 'center'}} onClick={() => delete_part3(data.PartNo)}>
                                                                                                        <TbSquareRoundedMinusFilled />
                                                                                                    </label>
                                                                                                )}
                                                                                            </Row>
                                                                                        </Col>
                                                                                    </div> 
                                                                                </div> 
                                                                            </div>
                                                                        ))}
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col md={12} style={{textAlign: 'center'}}>
                                                                        <label variant='none' style={{display: SelectedTab === 'two' ? 'none' : !Eval ? 'block' : 'none', cursor: 'pointer', fontSize: '50px'}} onClick={() => add_part3('', '', '', '')}>
                                                                            <TbSquareRoundedPlusFilled />
                                                                        </label>
                                                                    </Col>
                                                                </Row>
                                                                <Row className='midpoint'>
                                                                    <Col md={3} className='mt-4'>
                                                                        <Button variant='warning' className='btns' style={{display: SelectedTab === 'two' ? 'none' : !Eval ? 'block' : 'none'}} onClick={() => save_eval(SelectPart)}>Submit</Button>
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        ) : null
                                                    ) : SelectPart === 'part4' ? (
                                                        <div>
                                                            <Row>
                                                                <Col md={12}>
                                                                    {Part4.map((data, index) => (
                                                                        <div key={index}>
                                                                            {index > 0 && (
                                                                                <hr className='row-divider1' />
                                                                            )}
                                                                            <div className='boxrow' key={index}>
                                                                                <div className='gtopic1'>
                                                                                    <Col md={4} className='lineborder item3'>
                                                                                        <Form onSubmit={(e) => e.preventDefault()}>
                                                                                            <Form.Group className='mb-3' style={{textAlign: 'center'}}>
                                                                                                <Form.Label><b>Impact</b></Form.Label>
                                                                                                <Form.Group className='pb-2'>
                                                                                                {SelectedTab === 'two' || Eval ? (
                                                                                                    <Form.Control type='text' id={'impact_part4_' + data.PartNo} value={data.Impact.value ? data.Impact.value : data.Impact} style={{fontSize: '14px'}}  className='lineborder' readOnly={true} placeholder='Impact' />
                                                                                                ) : (
                                                                                                    <Select options={OptionsImpact} id={'impact_part4_' + data.PartNo} onChange={(e) => selectonchange(e, 'impact_part4_' + data.PartNo, 'Impact')} value={data.Impact} className='selectsevalquest' menuPortalTarget={document.body} styles={CustomSelectSelf} placeholder='Impact' />
                                                                                                )}
                                                                                        </Form.Group>
                                                                                            </Form.Group>
                                                                                            <Form.Label><b>Planned Outcome</b></Form.Label>
                                                                                            <InputGroup>
                                                                                                <Form.Control type='text' id={'po_part4_' + data.PartNo} onChange={(e) => txtonchange(e, 'PO')} value={data.PO} readOnly={SelectedTab === 'two' || Eval} placeholder='Planned Outcome' />
                                                                                            </InputGroup>
                                                                                            <Form.Label><b>Period</b></Form.Label>
                                                                                            <InputGroup className='d-flex justify-content-between align-items-center'>
                                                                                                <Form.Control type='text' id={'period_part4_' + data.PartNo} value={data.Period} onChange={(e) => txtonchange(e, 'Period')} readOnly={SelectedTab === 'two' || Eval} placeholder='Period' />
                                                                                            </InputGroup>
                                                                                        </Form>
                                                                                    </Col>
                                                                                </div>
                                                                                <div className='gtopic2'>
                                                                                    <Col md={7} style={{padding: '10px'}} className='lineborder item4'>
                                                                                        <Row>
                                                                                            <Col>
                                                                                                <Form onSubmit={(e) => e.preventDefault()}>
                                                                                                    <Form.Group style={{textAlign: 'center'}}>
                                                                                                        <Form.Label><b>Project Details</b></Form.Label>
                                                                                                        <InputGroup className='no-shadow-box d-flex justify-content-between align-items-center'>
                                                                                                            <Form.Control as='textarea' id={'project_part4_' + data.PartNo} onChange={(e) => txtonchange(e, 'Project')} value={data.Project} readOnly={SelectedTab === 'two' || Eval} style={{paddingBottom:'170px', resize:'none'}} className=' topic-comment' placeholder='Topic' />
                                                                                                        </InputGroup>
                                                                                                    </Form.Group>
                                                                                                </Form>
                                                                                            </Col>
                                                                                            {Part4.length > 1 && (
                                                                                                <label className='btn3' style={{display: !Eval ? 'block' : 'none', cursor: 'pointer', fontSize: '30px', marginLeft: '10px', textAlign: 'center'}} onClick={() => delete_part4(data.PartNo)}>
                                                                                                    <TbSquareRoundedMinusFilled />
                                                                                                </label>
                                                                                            )}
                                                                                        </Row>
                                                                                    </Col>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md={12} style={{textAlign: 'center'}}>
                                                                    <label variant='none' style={{display: SelectedTab === 'two' ? 'none' : !Eval ? 'block' : 'none', cursor: 'pointer', fontSize: '50px'}} onClick={() => add_part4('', '', '', '')}>
                                                                        <TbSquareRoundedPlusFilled />
                                                                    </label>
                                                                </Col>
                                                            </Row>
                                                            <Row className='midpoint'>
                                                                <Col md={3} className='mt-4'>
                                                                    <Button variant='warning' className='btns' style={{display: SelectedTab === 'two' ? 'none' : !Eval ? 'block' : 'none'}} onClick={() => save_eval(SelectPart)}>Submit</Button>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    ) : null
                                                    : (
                                                        <Row style={{height: '130px', textAlign: 'center', verticalAlign: 'middle', fontSize: '30px'}}>
                                                            <Col md={12} className='midpoint' style={{display: SelectedTab === 'one' ? '' : 'none'}}>
                                                                <label>There are currently no assessment questions.</label>
                                                            </Col>
                                                            <Col md={12} className='midpoint' style={{display: SelectedTab === 'two' ? '' : 'none'}}>
                                                                <label>You have not been evaluated.</label>
                                                            </Col>
                                                        </Row>
                                                    )}
                                            </Row>
                                        </div>
                                    ) : (
                                        <Row style={{height: '250px', textAlign: 'center', verticalAlign: 'middle', fontSize: '30px'}}>
                                            <Col md={12} className='midpoint'>
                                                <label>This evaluation topic is currently not active.</label>
                                            </Col>
                                        </Row>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </Container>
    )
}
export default Self
