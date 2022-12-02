import Reducer from '../reducers/DataReducer';

const DataContext = React.createContext();

function DataProvider({ children }) {
    const [state, dispatch] = React.useReducer(Reducer, {
        provider: '',
        accounts: [],
        signer: '',
        selectedAccount: '',
        posts: [],
        postData: []
    })
    const value = { state, dispatch }
    return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

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

export { DataProvider, DataConsumer }