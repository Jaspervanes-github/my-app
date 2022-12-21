/**
 * This function handles the data changes of the state variable from the DataProvider
 * @param {*} state Variable in which the data of the application gets stored globally.
 * @param {*} action Represents the action which needs to be excecuted to update the correct variable(s).
 * @returns The updated state variable containing every global variable of the application.
 */
export function dataReducer(state, action) {
    switch (action.type) {
        case 'setProvider': {
            return { ...state, provider: action.value }
        } case 'setAccounts': {
            return { ...state, accounts: action.value }
        } case 'setSigner': {
            return { ...state, signer: action.value }
        } case 'setSelectedAccount': {
            return { ...state, selectedAccount: action.value }
        } case 'setPosts': {
            return { ...state, posts: action.value }
        } case 'addPost': {
            console.log("In addPost in DataReducer");
            let currentPostList = state.posts;
            let currentPostDataList = state.postData;
            if (!currentPostList.includes(action.value)) {
                currentPostList.unshift(action.value);
                localStorage.setItem("posts", JSON.stringify(currentPostList));
                currentPostDataList.unshift(action.data);
                localStorage.setItem("postData", JSON.stringify(currentPostDataList));
                return { ...state, posts: currentPostList, postData: currentPostDataList }
            }else{
                return{...state}
            }
            break;
        }
        case 'setPostData': {
            return { ...state, postData: action.value }
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`)
        }
    }
}