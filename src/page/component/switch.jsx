// การนำเข้าและประกาศ Object เมื่อนำมาใช้งานของ Framework สำหรับ MUI
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';

export const Switch_Setting = styled((props) => {
    const { id, values, switchonchange, ...otherProps } = props; // รับค่า id จาก props
    return (
        <Switch
            {...otherProps}
            inputProps={{ id: id }}  // ส่ง id ไปใน inputProps
            checked={Boolean(values)}
            onChange={switchonchange}
        />
    );
    })(({ theme }) => ({
        padding: 8,
        '& .MuiSwitch-track': {
            borderRadius: 22 / 2,
            '&::before, &::after': {
                content: '""',
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                width: 16,
                height: 16,
        },
        '&::before': {
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' height='16' width='16' viewBox='0 0 24 24'><path fill='${encodeURIComponent(
                theme.palette.getContrastText(theme.palette.primary.main),
            )}' d='M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z'/></svg>')`,
            left: 12,
        },
    },
}));