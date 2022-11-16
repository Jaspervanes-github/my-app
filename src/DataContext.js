import * as React from 'react'

const DataContext = React.createContext()

function dataReducer(state, action) {
  switch (action.type) {
    case 'setProvider': {
      // console.log("In setProvider");
      return {
        provider: action.value,
        signer: state.signer,
        accounts: state.accounts,
        selectedAccount: state.selectedAccount,
        posts: state.posts
      }
    } case 'setAccounts': {
      // console.log("In setAccounts");
      return {
        provider: state.provider,
        signer: state.signer,
        accounts: action.value,
        selectedAccount: state.selectedAccount,
        posts: state.posts
      }
    } case 'setSigner': {
      // console.log("In setSigner");
      return {
        provider: state.provider,
        signer: action.value,
        accounts: state.accounts,
        selectedAccount: state.selectedAccount,
        posts: state.posts
      }
    } case 'setSelectedAccount': {
      // console.log("In setSelectedAccount");
      return {
        provider: state.provider,
        signer: state.signer,
        accounts: state.accounts,
        selectedAccount: action.value,
        posts: state.posts
      }
    } case 'setPosts': {
      // console.log("In setPosts: " + action.value);
      return {
        provider: state.provider,
        signer: state.signer,
        accounts: state.accounts,
        selectedAccount: state.selectedAccount,
        posts: action.value
      }
    } case 'addPost': {
      // console.log("In addPost: " + action.value.toString());
      let currentPostList = state.posts;
      if (!currentPostList.includes(action.value)) {
        currentPostList.unshift(action.value);
        localStorage.setItem("posts", JSON.stringify(currentPostList));
        return {
          provider: state.provider,
          signer: state.signer,
          accounts: state.accounts,
          selectedAccount: state.selectedAccount,
          posts: currentPostList
        }
      } else{
        return{
          provider: state.provider,
          signer: state.signer,
          accounts: state.accounts,
          selectedAccount: state.selectedAccount,
          posts: state.posts
        }
      }
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function DataProvider({ children }) {
  const [state, dispatch] = React.useReducer(dataReducer, {
    provider: '',
    accounts: [],
    signer: '',
    selectedAccount: '',
    posts: []
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
