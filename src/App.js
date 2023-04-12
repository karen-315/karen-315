import React from 'react';
import './App.css';
import axios from "axios";
import { Progress } from 'antd';
import store from './store';
import Header from "./components/headerPage"
import HistoryPage from "./components/historyPage"
import NewPage from "./components/newPage"
import TemplatePage from "./components/templatePage"


class App extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            selectType:1,
            historyList:[{name:"抖音",key:1},{name:"亚马逊",key:2},{name:"耐克",key:3}],
            proportion:"35",
            runTime:0,
            isOpenTwoDimensionalCode:false,
        };
    }
    componentDidMount() {
        this.onGetUserInformation()
    }
    componentWillMount() {
        axios.interceptors.request.use((request) => {
            request.headers['Authorization'] = `Bearer ${store.getState().The_instance}`
            return request;
        }, function (error) {
            // Do something with request error
            return Promise.reject(error);
        });
    }

    render() {
        const {selectType,proportion,runTime,isOpenTwoDimensionalCode} = this.state
        let historyList = this.state.historyList && this.state.historyList.map((item,index)=>{
            return <div className="App_left_historyFont">{item.name}</div>
        })
        return (
            <div className="App">
                <Header></Header>
                <div style={{display:"flex"}}>
                    <div className="App_left">
                        <div className="App_left_titleBox" onClick={this.onSelectTypeMenu.bind(this,1)}>
                            <div className="App_left_title" style={{color:selectType==1?'#5e5fd4':'#131415'}}>新对话</div>
                            <div className={selectType==1?'App_left_iconSelect':'App_left_iconNor'}></div>
                        </div>
                        {/*<div className="App_left_titleBox" style={{marginBottom:selectType==2?'0':'24px'}} onClick={this.onSelectTypeMenu.bind(this,2)}>*/}
                        {/*    <div className="App_left_title" style={{color:selectType==2?'#5e5fd4':'#131415'}}>历史对话</div>*/}
                        {/*    <div className={selectType==2?'App_left_iconSelect':'App_left_iconNor'}></div>*/}
                        {/*</div>*/}
                        {/*<div style={{display:selectType==2?'block':'none'}}>*/}
                        {/*    <div>{historyList}</div>*/}
                        {/*    <div className="App_left_historyTip">当前版本仅保存3条历史记录</div>*/}
                        {/*</div>*/}
                        <div className="App_left_titleBox" onClick={this.onSelectTypeMenu.bind(this,3)}>
                            <div className="App_left_title" style={{color:selectType==3?'#5e5fd4':'#131415'}}>模板库</div>
                            <div className={selectType==3?'App_left_iconSelect':'App_left_iconNor'}></div>
                        </div>
                        <div className="App_left_titleBox" onClick={this.onSelectTypeMenu.bind(this,4)} style={{marginBottom:'5px'}}>
                            <div className="App_left_title" style={{color:'#5e5fd4'}}>资源</div>
                            <div className={selectType==4?'App_left_iconSelect':'App_left_iconNor'}></div>
                        </div>
                        <div>
                            <p className="App_left_fontOne">已运行</p>
                            <p className="App_left_fontTwo">{runTime}天</p>
                            <div className="App_left_fontThree">资源消耗：{proportion}%</div>
                            <div>
                                <Progress percent={proportion} size="small" strokeColor="#131415" showInfo={false}/>
                            </div>
                            <div className="App_contact_userBox" onMouseLeave={this.onHideTwoDimensionalCode.bind(this)} onMouseEnter={this.onShowTwoDimensionalCode.bind(this)}>
                                <div className="App_left_title">联系我们</div>
                                <div className="App_contactIcon"></div>
                            </div>
                            {/*<div className="App_left_button">续费</div>*/}
                        </div>
                    </div>
                    <div className="App_right">
                        <div style={{display:selectType==1?'block':'none'}}><NewPage dataUpdate={selectType} onJumpComponent={this.handleClickSwichPage()}></NewPage></div>
                        {/*<div style={{display:selectType==2?'block':'none'}}><HistoryPage></HistoryPage></div>*/}
                        <div style={{display:selectType==3?'block':'none'}}><TemplatePage></TemplatePage></div>
                        <div style={{position: "absolute",top: "265px",left: "0px",display:isOpenTwoDimensionalCode?'block':'none'}}>
                            <div className="Two-dimensional-code"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    onHideTwoDimensionalCode(){
        this.setState({
            isOpenTwoDimensionalCode:false
        })
    }
    onShowTwoDimensionalCode(){
        this.setState({
            isOpenTwoDimensionalCode:true
        })
    }
    handleClickSwichPage = ()=>{
        return(keywords)=>{
            if(keywords == 'success'){
                this.onGetUserInformation()
            }
            if(keywords == 5){
                this.setState({
                    selectType:3
                })
            }
        }
    }
    onSelectTypeMenu(key){
        if(key != 4){
            this.setState({
                selectType:key
            })
        }
    }
    onGetUserInformation(){
        axios.get(`${window.strHttp}/api/ai_prom/user/info?operation="base_info"`).then(res=>{
            // let surplusToken = (100 - ((8 / 1996) * 100)).toFixed(1)
            let surplusToken = (100 - ((res.data.data.token_balance / res.data.data.total_token) * 100)).toFixed(1)
            this.setState({
                proportion:surplusToken,
                runTime:"",
            })
        })
    }

}
export default App;
