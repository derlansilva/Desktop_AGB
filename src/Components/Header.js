import React from "react";

import logo from "../assets/logo.png"
const Header = () =>{
    return(
        <>
        <header className="navbar navbar-light  text-black px-4 shadow-sm">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          {/* Logo */}
          <div className="d-flex align-items-center">
            <img
              src={logo} // Substitua pelo caminho da sua logo
              alt="Logo"
              width="150"
              height="50"
              className="me-3"
            />
        
          </div>

          {/* User info and logout */}
          <div className="d-flex align-items-center">
            <span className="me-3">Hello, <strong>Username</strong></span>
            <button className="btn btn-danger btn-sm">Logout</button>
          </div>
        </div>
      </header>

        </>
    )
}

export default Header;