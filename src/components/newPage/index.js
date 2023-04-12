import './index.less';
import React from "react";
import {Input, message} from "antd";
import axios from "axios";
import store from "../../store";
import ReactDOM from "react-dom";
import {BrowserRouter} from "react-router-dom";
import App from "../../App";
import eventBus from '../../events'


class NewPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isStartDialogue:false,
            instructionText:"",
            selectOptionId:"",
            boxHeight:'',
            optionList:[
                {name:"自由发挥",link:"",id:""},
                {name:"IT专家",link:"provider name",id:"111"},
                {name:"小说家",link:"provider name",id:"20"},
                {name:"音乐推荐",link:"provider name",id:"147"},
                {name:"更多模板",link:"查看模板库",id:"5"},
            ],
            returnContent:[],
            newDialogueId:''
        };
    }
    sayHelloContent(a){
        if(a != "111" && a != "20" && a != "78" && a != "147" && a != "113"){
            a = a.toString()
        }
        this.setState({
            selectOptionId:a
        })
    }
    resizeUpdate=(e)=>{
        let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        this.setState({
            boxHeight:height+'px'
        })
    }
    componentDidMount() {
        window.addEventListener('resize',this.resizeUpdate)
        let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        eventBus.addListener('templatePageType', this.sayHelloContent.bind(this))
        let sData = new Date();
        let newDialogueId = sData.getTime();
        this.setState({
            isStartDialogue:false,
            instructionText:"",
            boxHeight:height+'px',
            newDialogueId:newDialogueId,
            returnContent:[]
        })
    }
    componentWillUnmount() {
        window.removeEventListener('resize',this.resizeUpdate)
    }
    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.dataUpdate == 1){
            let sData = new Date();
            let newDialogueId = sData.getTime();
            this.setState({
                isStartDialogue:false,
                instructionText:"",
                newDialogueId:newDialogueId,
                returnContent:[]
            })
        }
    }

    render() {
        const {isStartDialogue,instructionText,selectOptionId,optionList,returnContent,boxHeight} = this.state
        let renderOptionList = optionList && optionList.map((item,index)=>{
            return <div className={selectOptionId==item.id?'NewPage_option_sed':'NewPage_option_nor'} onClick={this.onSelectOption.bind(this,item)} >
                <div>{item.name}</div>
                <div style={{display:item.id==1?'none':'block'}}>
                    <div className="NewPage_display" style={{marginTop:"5px"}}>
                        <div className="NewPage_option_lineIcon"></div>
                        <span style={{fontSize:"12px"}}>{item.link}</span>
                    </div>
                </div>
            </div>
        })
        let contentList = returnContent && returnContent.map((item,index)=>{
            return <div style={{display:"flex",justifyContent:(index+1) % 2 == 0?'':'flex-end'}}>
                <div className="openDialogue_box_font">{item.content}</div>
            </div>

        })
        return (
            <div className={isStartDialogue?'notNewPage':'NewPage'} style={{height:boxHeight}}>
                <div style={{width:isStartDialogue?"100%":""}}>
                    <div style={{display:isStartDialogue?'block':'none',width:"100%"}}>
                        <div className="openDialogue_box">
                            <div style={{marginBottom:"10px"}}>{contentList}</div>
                            <div style={{display:"flex",justifyContent:"flex-end"}}>
                                <div className="NewPage_button" onClick={this.onResetParameter.bind(this)}>调参</div>
                            </div>
                        </div>
                    </div>
                    <div className={isStartDialogue?'NewPage_bottom':''} style={{margin:"0 auto",width:"90%"}}>
                        <div className="NewPage_display" style={{justifyContent:"space-between"}}>
                            <Input placeholder="请输入你希望AI完成的指令"
                                   className="css-InputOne"
                                   type="text"
                                   value={instructionText}
                                   onChange={e => {
                                       this.setState({
                                           instructionText: e.target.value,
                                       });
                                   }}
                            />
                            <div className="NewPage_button" onClick={this.onSendParameter.bind(this)}>发送</div>
                        </div>
                    </div>
                    <div style={{display:isStartDialogue?'none':'block'}}>
                        <div className="NewPage_tiptext">直接输入，也可以选择一个prompt模版，让AI的回答更准确</div>
                        <div>
                            <div className="NewPage_display" style={{justifyContent:"space-between",width:"102%"}}>{renderOptionList}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    onSelectOption(objItem){
        this.setState({
            selectOptionId:objItem.id
        })
        if(objItem.id == 5){
            this.props.onJumpComponent(objItem.id)
        }
    }
    onSendParameter(){
        let returnContent = this.state.returnContent
        let requestValue = JSON.parse(JSON.stringify(this.state.instructionText))
        let sessionRequest = {content:requestValue,use_balance:"",model:""}
        returnContent.push(sessionRequest)
        this.setState({
            instructionText:"",
            isStartDialogue:true
        })
        axios.post(`${window.strHttp}/api/ai_prom/api/chat`,
            {
                api_source:'chatgpt',
                content:this.state.instructionText,
                chat_id:JSON.stringify(this.state.newDialogueId),
                prompt_tem:this.state.selectOptionId
            }
        ).then(res=>{
            switch (res.data.message) {
                case "err_no_balance":
                    message.warning("账号无余额",3);
                    break;
                case "success":
                    returnContent.push(sessionRequest)
                    returnContent.push(res.data.data)
                   this.setState({
                       returnContent:returnContent,
                       isStartDialogue:true
                   })
                    this.props.onJumpComponent("success")
                    break;
            }
        })
    }
    onResetParameter(){
        this.setState({isStartDialogue:false})
    }
}

export default NewPage;
