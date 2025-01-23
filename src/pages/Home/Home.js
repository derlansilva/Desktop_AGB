import React from "react";
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom'

import logo from "../../assets/logo.png"
import Header from "../../Components/Header";
import { useNavigate } from "react-router-dom";
import HomeButtons from "../../Components/HomeButtons/HomeButtons";
import Manifest from "../Manifest/Manifest";
const Home = () => {
    const navigate = useNavigate();
    return(
       
      <div className="d-flex flex-column vh-100">
        <Header/>
        
        {/* Conteúdo central da página */}
        <section className="mt-4">
          <Outlet/>
        </section>
      </div>
    
    )
}

export default Home;