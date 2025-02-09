

import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';


import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from "../pages/Home/Home";
import Manifest from "../pages/Manifest/Manifest";
import HomeButtons from "../Components/HomeButtons/HomeButtons";
import Conference from "../Components/Conference/Conference";
import Login from "../pages/Login/Login";


//const root = ReactDOM.createRoot(document.getElementById('root'));


const AppRoutes = () => {

    const [selectedManifests, setSelectedManifests] = useState([]);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login/>}/>
                <Route path="/home" element={<Home />}>
                    <Route index element={<HomeButtons />} />
                    <Route path="/home/manifest" element={<Manifest selectedManifests={selectedManifests} />} />
                    <Route path="/home/conference" element={<Conference selectedManifests={selectedManifests} />} />
                </Route>

            </Routes>
        </Router>
    )
}

export default AppRoutes;