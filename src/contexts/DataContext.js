import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataReducer } from '../reducers/DataReducer';


const DataContext = React.createContext();

/**
 * This component stores all the global variables in the state variable, also initilizes the reducer.
 * @param {*} children Contains everything within the DataConsumer tag.
 * @returns The render components of the DataConsumer component.
 */
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

/**
 * This component handles the interaction with the DataProvider.
 * If calls to the DataProvider are made within a DataConsumer tag they are valid. Otherwise trows an exception (Deprecated)
 * @param {*} children Contains everything within the DataConsumer tag.
 * @returns The render components of the DataConsumer component.
 */
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
