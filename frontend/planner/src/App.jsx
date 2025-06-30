import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Layout from "./Components/Layout/Layout.jsx";
import Home from "./Pages/Home/Home.jsx";
import {useKeycloak} from "./Hooks/useKeycloak.js";
import LoadingScreen from "./Components/LoadingScreen/LoadingScreen.jsx";
import TripManager from "./Features/Trips/TripManager/TripManager.jsx";
import TripCreation from "./Features/Trips/TripCreation/TripCreation.jsx";
import {useContext} from "react";
import {AuthContext} from "./Contexts/AuthContext.jsx";

function App() {
    useKeycloak();
    const {loading} = useContext(AuthContext);

    if (loading) {
        return <LoadingScreen />
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="trip-manager" element={<TripManager />} />
                    <Route path="trip-creation/:folderId" element={<TripCreation />}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App