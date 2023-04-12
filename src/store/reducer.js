const defaultObj = {
    The_instance: 0, //示例
}
export default (state = defaultObj,action)=>{
    if(action.type === 'SaveToken') {
        let newState = JSON.parse(JSON.stringify(state))
        newState.The_instance = action.The_instance
        return newState
    }
    return state
}