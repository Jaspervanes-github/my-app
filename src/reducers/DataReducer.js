function dataReducer(state, action) {
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
            let currentPostList = state.posts;
            let currentPostDataList = state.postData;
            if (!currentPostList.includes(action.value)) {
                currentPostList.unshift(action.value);
                localStorage.setItem("posts", JSON.stringify(currentPostList));
                currentPostDataList.unshift(action.data);
                localStorage.setItem("postData", JSON.stringify(currentPostDataList));
                return { ...state, posts: currentPostList, postData: currentPostDataList }
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