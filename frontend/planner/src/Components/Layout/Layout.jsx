import { Outlet } from 'react-router-dom';
import Header from '../Header/Header.jsx';

export default function Layout({ authenticated }) {
    return (
        <div className="layout">
            <Header authenticated={authenticated} />
            <Outlet />
        </div>
    );
}