import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// สำหรับ css
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/style.css';
import 'react-calendar/dist/Calendar.css';

// ทั้งหมด
import Index from './page/all/index';
import Forgottenpassword from './page/all/forgottenpassword';
import Otpsend from './page/all/otpsend';
import Newpassword from './page/all/newpassword';
import AuthGuard from './page/component/authguard';

// ฝั่งของ User
import Home from './page/user/home';
import Self from './page/user/self';
import Manage from './page/user/manage';
import Staff from './page/user/staff';

// ฝั่งของ Admin
import ManageUser from './page/admin/manageuser';
import Adduser from './page/admin/adduser';
import Addcsvfileuser from './page/admin/addcsvfileuser';
import Edituser from './page/admin/edituser';
import Dashboard from './page/admin/dashboard';
import Manageevent from './page/admin/manageevent';
import Addevent from './page/admin/addevent';
import Editevent from './page/admin/editevent';
import Manageeval from './page/admin/manageeval';
import Manageemail from './page/admin/manageemail';

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Routes>
            {/* ทั้งหมด */}
            <Route element={<AuthGuard role='login' />}>
                <Route path='/' element={<Index />}></Route>
                <Route path='/forgottenpassword' element={<Forgottenpassword />}></Route>
                <Route path='/newpassword' element={<Newpassword />}></Route>
                <Route path='/otpsend' element={<Otpsend />}></Route>
            </Route>

            {/* ฝั่งของ User */}
            <Route element={<AuthGuard role='user' />}>
                <Route path='/home' element={<Home />}></Route>
                <Route path='/self' element={<Self />}></Route>
                <Route path='/manage' element={<Manage />}></Route>
                <Route path='/staff' element={<Staff />}></Route>
            </Route>

            {/* ฝั่งของ Admin */}
            <Route element={<AuthGuard role='admin' />}>
                <Route path='/manageuser' element={<ManageUser />}></Route>
                <Route path='/adduser' element={<Adduser />}></Route>
                <Route path='/addcsvfileuser' element={<Addcsvfileuser />}></Route>
                <Route path='/edituser' element={<Edituser />}></Route>
                <Route path='/dashboard' element={<Dashboard />}></Route>
                <Route path='/manageevent' element={<Manageevent />}></Route>
                <Route path='/addevent' element={<Addevent />}></Route>
                <Route path='/editevent' element={<Editevent />}></Route>
                <Route path='/manageeval' element={<Manageeval />}></Route>
                <Route path='/manageemail' element={<Manageemail />}></Route>
            </Route>
        </Routes>
    </BrowserRouter>
)
