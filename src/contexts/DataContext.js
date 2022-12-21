import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataReducer } from '../reducers/DataReducer';


const DataContext = React.createContext();

function DataProvider({ children }) {
    const [state, dispatch] = React.useReducer(dataReducer, {
        provider: '',
        accounts: [],
        signer: '',
        selectedAccount: '',
        posts: [],
        postData: []
    })
    const navigate = useNavigate();

    useEffect(() => {
        if (window.location.pathname === "/login")
            return;
        if (state.provider === '')
            navigate("/login");
    }, [state])

    const value = { state, dispatch }
    return <DataContext.Provider value={value}>
        {children}
    </DataContext.Provider>
}

//Deprecated
function DataConsumer({ children }) {
    return (
        <DataContext.Consumer>
            {context => {
                if (context === undefined) {
                    throw new Error('DataConsumer must be used within a DataProvider')
                }
                return children(context)
            }}
        </DataContext.Consumer>
    )
}

export { DataProvider, DataConsumer, DataContext };
