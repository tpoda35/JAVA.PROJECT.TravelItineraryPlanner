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
import TripPlanner from "./Features/Trips/TripPlanner/TripPlanner.jsx";
import {Bounce, ToastContainer} from "react-toastify";

function App() {
    useKeycloak();
    const {loading} = useContext(AuthContext);

    if (loading) {
        return <LoadingScreen />
    }

    return (
        <BrowserRouter>
            <ToastContainer
                position="top-left"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            />

            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="trip-manager" element={<TripManager />} />
                    <Route path="trip-creation/:folderId" element={<TripCreation />}/>
                    <Route path="trip-planner/:tripId" element={<TripPlanner />}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App