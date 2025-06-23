import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Layout from "./Components/Layout/Layout.jsx";
import Home from "./Pages/Home/Home.jsx";
import {useKeycloak} from "./Hooks/useKeycloak.js";
import LoadingScreen from "./Components/LoadingScreen/LoadingScreen.jsx";
import TripManager from "./Pages/TripManager/TripManager.jsx";
import TripCreation from "./Pages/TripCreation/TripCreation.jsx";

function App() {
    const { loading, authenticated } = useKeycloak();

    if (loading) {
        return <LoadingScreen />
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout authenticated={authenticated} />}>
                    <Route index element={<Home />} />
                    <Route path="trip-manager" element={<TripManager />} />
                    <Route path="trip-creation/:folderId" element={<TripCreation />}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App