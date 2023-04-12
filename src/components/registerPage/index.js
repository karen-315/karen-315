import './index.less';
import React from "react";
import {Input, message} from "antd";
import axios from "axios";
import store from "../../store";
import SetPasswordPage from "../../components/setPasswordPage";


class RegisterPage extends React.Component{
    constructor(props) {
        super(props);
        this.tempTimer = null
        this.state = {
            accountNumber:"",
            verificationCode:"",
            isEffective:true,
            time:60,
            isRegisterSuccess:false
        };
    }
    render() {
        const {accountNumber,verificationCode,isEffective,time,isRegisterSuccess} = this.state
        return (
            <div style={{height:"100%"}}>
                <div className="RegisterPage" style={{display:isRegisterSuccess?'none':'block'}}>
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
                                <span className="LoginPage_right_font">手机号注册登录</span>
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
                            <div style={{display:"flex",alignItems:"center"}}>
                                <div className="LoginPage_right_agreementIcon"></div>
                                <div className="LoginPage_right_agreemen_txt">我已阅读并同意<a>《注册服务协议》</a>和<a>《隐私政策》</a></div>
                            </div>
                            <div className="LoginPage_right_button" onClick={this.onDoRegister.bind(this)}>进入系统</div>
                        </div>
                    </div>
                </div>
                <div style={{display:isRegisterSuccess?'block':'none'}}><SetPasswordPage></SetPasswordPage></div>
            </div>

        );
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
    onDoRegister(){
        axios.post(`${window.strHttp}/api/ai_prom/user/register`,
            {
                phone_number:'86'+this.state.accountNumber,
                register_type:1,
                verify_code:this.state.verificationCode,
            }
        ).then(res=>{
            switch (res.data.message) {
                case "err_verify_code":
                    message.warning("验证码错误",3);
                    this.setState({
                        isEffective:false
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
                    this.setState({
                        isRegisterSuccess:true
                    })
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
            }
        ).then(res=>{

        })
    }

}
export default RegisterPage;
