export const CustomSelect = {
    control: (provided) => ({
        ...provided,
        borderRadius: '20px',
        border: '1px solid #ccc',
        boxShadow: 'none',
        display: 'flex',
        alignItems: 'center',
        padding: '5px',
    }),
    placeholder: (provided) => ({
        ...provided,
        color: '#888',
        fontSize: '14px',
    }),
    input: (provided) => ({
        ...provided,
        color: 'inherit',
        margin: 0,
        padding: 0,
        fontSize: '14px',
    }),
    indicatorSeparator: () => ({
        display: 'none', // ซ่อนเส้นคั่นระหว่าง input กับลูกศร
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        color: '#888', // สีของลูกศร
        padding: '5px',
    }),
};

export const CustomSelectSelf = {
    menu: (provided) => ({
        ...provided,
        backgroundColor: 'white', // เปลี่ยนสีพื้นหลัง dropdown
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? '#e6f7ff' : 'white', // สีพื้นหลังเมื่อ hover
        color: 'black', // สีตัวอักษร
        ':active': {
            backgroundColor: '#bae7ff', // สีเมื่อถูกคลิก
        },
    }),
};

export const CustomSelectStaff = {
    control: (provided) => ({
        ...provided,
        borderRadius: "20px",
        border: "1px solid #ccc",
        boxShadow: "none",
        display: "flex",
        justifyContent: 'flex-end',
        padding: "2px", // ลด padding เพื่อลดความสูง
        height: "35px", // ตั้งค่าความสูงของช่อง
        minHeight: "35px", // เพื่อความแน่นอนว่าไม่สูงเกิน
    }),
    placeholder: (provided) => ({
        ...provided,
        color: "#888",
        fontSize: "14px",
    }),
    input: (provided) => ({
        ...provided,
        color: "inherit",
        margin: 0,
        padding: 0, // ลด padding เพื่อให้ input เล็กลง
        fontSize: "14px",
    }),
    indicatorSeparator: () => ({
        display: "none", // ซ่อนเส้นคั่นระหว่าง input กับลูกศร
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        color: "#888", // สีของลูกศร
        padding: "2px", // ลด padding ของลูกศร
    }),
};