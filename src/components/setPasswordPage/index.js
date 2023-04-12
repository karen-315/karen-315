import './index.less';
import {Input, message} from "antd";
import React from "react";
import App from "../../App"
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import store from "../../store";

class setPasswordPage extends React.Component {
    constructor(props) {
        super(props);
        this.passWordValue = ''  //密码
        this.tempTimer = null
        this.state = {
            passwordNumber:"",
            confirmPassword:"",
            nickname:"",
            isConsistent:true,
            tipName:""
        };
    }
    render() {
        const {passwordNumber,confirmPassword,nickname,isConsistent,tipName} = this.state
        return (
            <div className="setPasswordPage">
                <div className="setPasswordPage_top">
                    <div className="LoginPage_icon"></div>
                    <span>AI Prom</span>
                </div>
                <div style={{display:"flex",height:"100%"}}>
                    <div className="setPasswordPage_left">
                        <p className="LoginPage_left_font">强大的“prompt”提示库</p>
                        <p className="LoginPage_left_font" style={{color: "#5e5fd4",marginBottom:"26px"}}>让AI更懂你的心意</p>
                        <p className="LoginPage_left_font" style={{fontSize: "18px"}}>在与AI互动的过程中，为你提供一个prompt辅助提示，帮助AI更准确高效地完成你的指令</p>
                        <div style={{display:"flex"}}>
                            <div className="LoginPage_left_img"></div>
                            <div className="LoginPage_left_title">
                                <div className="LoginPage_left_title_box">新媒体文案</div>
                                <div className="LoginPage_left_title_box" style={{margin:"28px 0"}}>电商图片生成</div>
                                <div className="LoginPage_left_title_box">更多功能...</div>
                            </div>
                        </div>
                    </div>
                    <div className="setPasswordPage_right">
                        <div style={{display:"flex",alignItems:"center"}}>
                            <div className="LoginPage_right_arrow"></div>
                            <span className="LoginPage_right_font">完善账号信息</span>
                        </div>
                        <div className="LoginPage_right_font" style={{fontSize:"16px",marginTop:"36px"}}>设置密码</div>
                        <Input placeholder="请输入密码"
                               className="css-passwordInput"
                               type="password"
                               allowClear
                               value={passwordNumber}
                               onChange={e => {
                                   this.setState({
                                       passwordNumber: e.target.value,
                                   });
                               }}/>
                        <div className="setPasswordPage_right_confirm">
                            <Input placeholder="再次确认密码"
                                   className="css-confirmInput"
                                   type="password"
                                   value={confirmPassword}
                                   onChange={e => {
                                       this.setState({
                                           confirmPassword: e.target.value,
                                       });
                                   }}/>
                            <span className="setPasswordPage_right_confirm_txt" style={{display:isConsistent?'none':'block'}}>{tipName}</span>
                        </div>

                        <div className="LoginPage_right_font" style={{fontSize:"16px",marginBottom:"16px"}}>设置昵称</div>
                        <Input placeholder="设置昵称"
                               className="css-passwordInput"
                               type="text"
                               allowClear
                               value={nickname}
                               onChange={e => {
                                   this.setState({
                                       nickname: e.target.value,
                                   });
                               }}/>
                        <div className="setPasswordPage_right_button" onClick={this.onAccessSystem.bind(this)}>进入系统</div>
                    </div>
                </div>
            </div>
        );
    }
    onJudgmentPassword(){
        let bool = false
        let password1 = this.state.passwordNumber
        let password2 = this.state.confirmPassword
        if(password1 == "" || password2 == ""){
            this.setState({
                tipName:"密码为空",
                isConsistent:false
            })
        }
        if(password1 != password2){
            this.setState({
                tipName:"密码不一致",
                isConsistent:false
            })
        }
        if(password1 == password2 && password1 != '' && password2 != ''){
            bool = true
        }
        return bool;
    }
    onAccessSystem(){
        if(this.onJudgmentPassword()){
            axios.post(`${window.strHttp}/api/ai_prom/user/edit`,
                {
                    password:this.state.passwordNumber,
                    nick_name:this.state.nickname,
                }
            ).then(res=>{
                switch (res.data.message) {
                    case "success":
                        ReactDOM.render(
                            <BrowserRouter>
                                <App />
                            </BrowserRouter>,

                            document.getElementById('root')
                        );
                        break;
                }
            })
        }
    }
}

export default setPasswordPage;
