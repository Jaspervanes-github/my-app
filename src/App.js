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

            <h1>
              Handpicked Media
              <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 20 32" class="c-logo__gripper">
                <path fill="#FFFFFF" fill-rule="evenodd" d="M10.35 0 5.47 2.17l4.95 10.33c-.18-.01-.36-.03-.55-.03-4.51 0-8.52 2.92-9.75 7.1l5.17 1.41a4.75 4.75 0 0 1 4.58-3.33 4.68 4.68 0 0 1 4.75 4.58 4.68 4.68 0 0 1-4.75 4.59 4.7 4.7 0 0 1-4.63-3.54L0 24.45A10.02 10.02 0 0 0 9.87 32C15.45 32 20 27.62 20 22.23c0-1.73-.56-3.34-1.28-4.78L10.35 0z" />
              </svg>
              {/* <img src={logo} width="50px" height="50px" /> */}
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
