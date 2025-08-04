import { Outlet } from 'react-router-dom';
import Header from '../../Pages/Header/Header.jsx';
import {Container} from "@mui/material";

export default function Layout() {
    return (
        <>
            <Header />
            <Container component="main" maxWidth="lg">
                <Outlet />
            </Container>
        </>
    );
}