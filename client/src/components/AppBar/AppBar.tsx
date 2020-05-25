/*
 * Lean tool - hypothesis testing application
 *
 * https://github.com/MikaelLazarev/lean-tool/
 * Copyright (c) 2020. Mikhail Lazarev
 *
 */

import React from 'react';
import {Nav, Navbar, NavDropdown} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {AppBarElement} from './AppBarElement';
import logo from '../../logo.png';

// import AppSearch from "./AppSearch"

export const AppBar = () => {

  return (
    <Navbar className="navbar-header navbar-header-fixed">
      <a href="#" id="mainMenuOpen" className="burger-menu">
        <i data-feather="menu" />
      </a>
      <Navbar.Brand>
        <Link to="/" className="df-logo">
          <img src={logo} height={35} alt={'Logo'} />
        </Link>
      </Navbar.Brand>
      <div id="navbarMenu" className="navbar-menu-wrapper">
        <div className="navbar-menu-header">
          <Link to="/" className="df-logo">
            TZ<span>factor</span>
          </Link>
          <a id="mainMenuClose" href="#">
            <i data-feather="x" />
          </a>
        </div>
        <Nav className="navbar-menu" style={{justifyContent: 'center'}}>
            <AppBarElement title="Feed" to="/" key="feed" />
            <AppBarElement title="Accounts" to="/accounts" key="accounts" />
        </Nav>
      </div>
    </Navbar>
  );
};

export default AppBar;
