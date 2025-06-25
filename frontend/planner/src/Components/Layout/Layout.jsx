import { Outlet } from 'react-router-dom';
import Header from '../../Pages/Header/Header.jsx';
import './Layout.css'

export default function Layout() {
    return (
        <>
            <Header />
            <main className="layout-content">
                <Outlet />
            </main>
        </>
    );
}