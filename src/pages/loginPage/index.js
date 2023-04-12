import React from 'react';
import './index.less';
import {Progress, Input, message} from 'antd';
import {push} from 'react-router-redux';
import {BrowserRouter, Route, Routes, useNavigate} from "react-router-dom";
import md5 from "js-md5";
import axios from "axios";
import store from '../../store';
import App from "../../App"
import RegisterPage from "../../components/registerPage"
import ReactDOM from "react-dom";


export const withNavigation = (Component) => {
    return (props) => <Component {...props} navigate={useNavigate()} />;
};

class LoginPage extends React.Component{
    constructor(props) {
        super(props);
        this.passWordValue = ''  //密码
        this.tempTimer = null
        this.state = {
            isSwichLogin:1,
            accountNumber:"",
            passwordNumber:"",
            loginNameType:true,
            isShowPassword:false,
            verificationCode:"",
            isEffective:true,
            time:60,
        };
    }
    render() {
        const {accountNumber,passwordNumber,loginNameType,isShowPassword,verificationCode,isEffective,time,isSwichLogin} = this.state
        return (
            <div style={{height:"100%"}}>
                <div style={{display:isSwichLogin==1?'block':'none'}} className="LoginPage">
                    <div className="LoginPage_top">
                        <div className="LoginPage_icon"></div>
                        <span>AI Prom</span>
                    </div>
                    <div style={{display:"flex",height:"100%"}}>
                        <div className="LoginPage_left">
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
                        <div className="LoginPage_right">
                            <div style={{display:"flex",alignItems:"center"}}>
                                <div className="LoginPage_right_arrow"></div>
                                <span className="LoginPage_right_font">{loginNameType?'手机号':'账号密码'}登录</span>
                            </div>
                            <div className="LoginPage_right_user">
                                <span className="LoginPage_right_font" style={{fontSize:"16px"}}>+86</span>
                                <div className="LoginPage_right_line"></div>
                                <Input placeholder="请输入手机号码"
                                       className="css-Input"
                                       type="text"
                                       allowClear
                                       value={accountNumber}
                                       onChange={e => {
                                           this.setState({
                                               accountNumber: e.target.value,
                                           });
                                       }}/>
                            </div>
                            <div style={{display:loginNameType?'none':'block'}}>
                                <div className="LoginPage_right_passwordOne">
                                    <input placeholder="请输入密码"
                                           className="css-passwordInput"
                                           type="text"
                                           value={passwordNumber}
                                           onCopy={(e)=>{e.preventDefault()}}
                                           onPaste={(e)=>{e.preventDefault()}}
                                           onInput={this.onPassWordInput.bind(this)}
                                    />
                                    <div className={isShowPassword?"css-loginUserPage-passwordIcon_close":"css-loginUserPage-passwordIcon"} onClick={this.onViewPassWord.bind(this)}></div>
                                </div>
                            </div>
                            <div style={{display:loginNameType?'block':'none'}}>
                                <div className="LoginPage_right_passwordTwo">
                                    <div className="LoginPage_right_passwordTwo_verification">
                                        <Input placeholder="请输入验证码"
                                               className="css-passwordInputOne"
                                               type="text"
                                               value={verificationCode}
                                               onChange={e => {
                                                   this.setState({
                                                       verificationCode: e.target.value,
                                                   });
                                               }}
                                        />
                                        <span className="LoginPage_right_passwordTwo_verificationFont" style={{display:isEffective?'none':'block'}}>无效</span>
                                    </div>
                                    <div className="LoginPage_right_passwordTwo_verificationStyle"><span style={{color:"#cf0b0b"}}>{this.tempTimer?time:''}</span>{this.tempTimer?<span>s 重发</span>:<span style={{cursor: "pointer"}} onClick={this.onGetVerification.bind(this)}>获取验证码</span>}</div>
                                </div>
                            </div>
                            <div style={{display:"flex",alignItems:"center"}}>
                                <div className="LoginPage_right_agreementIcon"></div>
                                <div className="LoginPage_right_agreemen_txt">我已阅读并同意<a>《注册服务协议》</a>和<a>《隐私政策》</a></div>
                            </div>
                            <div className="LoginPage_right_button" onClick={this.onDoLogin.bind(this)}>进入系统</div>
                            <div className="LoginPage_right_swichButton" onClick={this.onSwichLoginType.bind(this)}>{loginNameType?'账号密码':'手机号'}登录</div>
                        </div>
                    </div>
                </div>
                <div style={{display:isSwichLogin==2?'block':'none'}}><RegisterPage></RegisterPage></div>
            </div>
        )
    }
    onGetVerification(){
        let count = this.state.time
        this.onGetVerificationCode()
        this.tempTimer = setInterval(()=>{
            if(count == 0){
                clearInterval(this.tempTimer);
                this.tempTimer = null
                this.setState({
                    time:60
                })
                return
            }
            count--
            this.setState({
                time:count
            })
        },1000)
    }
    onSwichLoginType(){
        this.setState({
            loginNameType:!this.state.loginNameType,
            verificationCode:"",
            passwordNumber:"",
        },()=>{
            this.passWordValue = ''
        })
    }
    onViewPassWord(){
        let bool = !this.state.isShowPassword
        let current  = JSON.parse(JSON.stringify(this.passWordValue))
        let password = ''
        if(bool){
            password = this.passWordValue
        }else {
            if(this.passWordValue.length > 0){
                password = current.replace(/./g,'*')
            }
        }
        this.setState({
            passwordNumber:password,
            isShowPassword:bool
        })
    }
    onPassWordInput(objEvent){
        let passWordText = ''
        let password = objEvent.currentTarget.value;    //输入的时候获取输入框的值
        let passValue = JSON.parse(JSON.stringify(this.passWordValue))
        if(password.length < 1){
            this.setState({
                passwordNumber:passWordText
            })
            this.passWordValue = ""
            return;
        }
        if(passValue.length < password.length){
            if((password.substr(password.length-1,1)) != "*" && (password.substr(password.length-1,1)) != " "){
                this.passWordValue += password.substr(password.length-1,1); //获取最后一个字符加到到str,因为除了最后一个字符，其他的已经为*
                passWordText = (password.replace(/./g,'*')) //输入框内容全部变为*
            }else {
                passWordText = (passValue.replace(/./g,'*')) //输入框内容全部变为*
            }
        }else {
            this.passWordValue = this.passWordValue.slice(0,password.length)
            passWordText = (password.replace(/./g,'*')) //输入框内容全部变为*
        }

        this.setState({
            passwordNumber:passWordText
        })
    }
    onDoLogin(){
        let loginType = ''
        let password = this.passWordValue
        if(password != ''){
            md5(this.passWordValue)
        }
        if(this.state.loginNameType) {
            loginType = 1
        }else {
            loginType = 2
        }
        axios.post(`${window.strHttp}/api/ai_prom/user/login`,
            {
                phone_number:'86'+this.state.accountNumber,
                login_type:1,
                verify_code:this.state.verificationCode,
                verify_type:loginType,
                password:password
            }
        ).then(res=>{
            switch (res.data.message) {
                case "err_password":
                    message.warning("密码错误",3);
                    break;
                case "err_no_register":
                    message.warning("账号未注册",3);
                     this.setState({
                         isSwichLogin:2
                     })
                    break;
                case "err_internal":
                    message.warning("系统内部错误",3);
                    break;
                case "err_verify_code":
                    message.warning("验证码错误",3);
                    break;
                case "success":
                    store.dispatch({ type: 'SaveToken', The_instance: res.data.data });
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
    onGetVerificationCode(){
        axios.post(`${window.strHttp}/api/ai_prom/user/code_send`,
            {
                phone_number:'86'+this.state.accountNumber,
                code_type:1,
                operation:'send'
            },
        ).then(res=>{

        })
    }
}
export default LoginPage;
