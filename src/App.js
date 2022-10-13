import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { Route, Routes } from "react-router-dom";
import './App.css';

import React, { Component } from 'react';
import Home from "./pages/Home";
import Login from "./pages/Login";
import NoPage from "./pages/NoPage";


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
    fontFamily: [
      'Roboto'
    ],
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
          <div className="App">
            <Routes>
              <Route exact path="/" element={<Login />} />
              <Route path="/home" element={<Home />} />
              <Route path="*" element={<NoPage />} />
            </Routes>
          </div>
        </ThemeProvider>
    );
  }
}
