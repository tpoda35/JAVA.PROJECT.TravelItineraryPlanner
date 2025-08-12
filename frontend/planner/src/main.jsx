import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {AuthProvider} from "./Contexts/AuthContext.jsx";
import {WebSocketProvider} from "./Contexts/WebSocketContext.jsx";

createRoot(document.getElementById('root')).render(
    // <StrictMode>
    <AuthProvider>
        <WebSocketProvider>
            <App />
        </WebSocketProvider>
    </AuthProvider>
    // </StrictMode>,
)
