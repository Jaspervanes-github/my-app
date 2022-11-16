import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { Route, Routes } from "react-router-dom";
import './App.css';
import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from "./pages/Home";
import Login from "./pages/Login";
import NoPage from "./pages/NoPage";
import { DataProvider } from './DataContext';
import logo from "./HP_logo.png";


const theme = createTheme({
  palette: {
    primary: {
      main: "#2e1667",
    },
    secondary: {
      main: "#c7d8ed",
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
      fontSize: 28,
      lineHeight: '2rem',
    },
    h5: {
      fontWeight: 100,
      lineHeight: '2rem',
    },
  }
});

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <DataProvider>
          <div className="App">
            <ToastContainer
              position="top-center"
              autoClose={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss={false}
              draggable={false}
              theme="dark"
            />

              <h1 style={{
                fontSize: "250%",
              }}>Handpicked Media
                <img src={logo} width="50px" height="50px" />
              </h1>

            <Routes>
              <Route exact path="/" element={<Login />} />
              <Route path="/home" element={<Home />} />
              <Route path="*" element={<NoPage />} />
            </Routes>
          </div>
        </DataProvider>
      </ThemeProvider>
    );
  }
}
