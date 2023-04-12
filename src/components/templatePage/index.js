import './index.less';
import React from "react";
import axios from "axios";
import {Pagination,Select,Input} from "antd";
import eventBus from '../../events'

class TemplatePage extends React.Component {
    constructor(props) {
        super(props);
        this.pageSize = 25;
        this.state = {
            boxHeight:'',
            swichTemplateId:1,
            themeType:"",
            themeName:"",
            commonlyUsed:[{name:"IT专家",id:"111",tags:""},{name:"小说家",id:"20",tags:""},{name:"自媒体创作者",id:"78",tags:""},{name:"音乐推荐",id:"147",tags:""},{name:"mdjourney prompt生成器",id:"113",tags:""}],
            allTemplate:[],
            pagenumber:1,
            allCount:''
        };
    }
    resizeUpdate=(e)=>{
        let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        this.setState({
            boxHeight:height-400+'px'
        })
    }
    componentDidMount() {
        this.onGetTemplateData(1)
        window.addEventListener('resize',this.resizeUpdate)
        let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        this.setState({
            boxHeight:height-400+'px'
        })
    }
    componentWillUnmount() {
        window.removeEventListener('resize',this.resizeUpdate)
    }
    render() {
        const {boxHeight,swichTemplateId,commonlyUsed,allTemplate,pagenumber,allCount,themeType,themeName} = this.state
        let commonlyUsedList = commonlyUsed && commonlyUsed.map((item,index)=>{
            return <div className={swichTemplateId==item.id?'TemplatePage_commonlyUsed_sed':'TemplatePage_commonlyUsed'} onClick={this.onSwichTemplate.bind(this,item)}>
                <div className="TemplatePage_commonlyUsed_tages"></div>
                <div className="TemplatePage_font_text TemplatePage_font_over">{item.name}</div>
                <div className="TemplatePage_display" style={{marginTop:"5px"}}>
                    <div className="TemplatePage_option_lineIcon"></div>
                    <span className="TemplatePage_font_text" style={{fontSize:"12px"}}>{item.link}</span>
                </div>
            </div>
        })
        let allTemplateList = allTemplate && allTemplate.map((item,index)=>{
            return <div className={swichTemplateId==item.id?'TemplatePage_theme_sed':'TemplatePage_theme_nor' } onClick={this.onSwichTemplate.bind(this,item)}>
                <div className="TemplatePage_commonlyUsed_tagesTwo"></div>
                <div className="TemplatePage_font_text">{item.name}</div>
                <div className="TemplatePage_display" style={{marginTop:"5px"}}>
                    <div className="TemplatePage_option_lineIcon"></div>
                    <span className="TemplatePage_font_text" style={{fontSize:"12px"}}>{item.tags}</span>
                </div>
            </div>
        })
        return (
            <div className="TemplatePage">
                <div className="TemplatePage_top" style={{width:"80%"}}>
                    <div className="TemplatePage_font_title">常用模板</div>
                    <div className="TemplatePage_display" style={{justifyContent:"space-between",width:"75%",margin:"25px 0 40px 0"}}>{commonlyUsedList}</div>
                </div>
                <div style={{width:"80%",margin:"0 auto"}}>
                    <div className="TemplatePage_display" style={{justifyContent:"space-between",marginBottom:"24px",width:"75%"}}>
                        <div style={{width:"320px",height:"40px",borderRadius:"8px",border:"solid 1px #131415"}}>
                            <Select
                                className="css-selectInput"
                                placeholder="所有主题"
                                value={themeType}
                                options={[
                                    // { label: '', value: '' },
                                ]}
                                onChange={e => {
                                    this.setState({
                                        themeType: e,
                                    });
                                }}
                            />
                        </div>
                        <div className="TemplatePage_searchBox">
                            <div className="TemplatePage_searchBox_icon"></div>
                            <Input
                                placeholder="搜索主题"
                                className="css-Input"
                                type="text"
                                allowClear
                                value={themeName}
                                onChange={e => {
                                    this.setState({
                                        themeName: e.target.value,
                                    });
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div style={{width:"80%",margin:"0 auto"}}>
                    <div className="TemplatePage_themeBox" style={{height:boxHeight}}>{allTemplateList}</div>
                    <div className="TemplatePage_pagetion">
                        <Pagination defaultCurrent={pagenumber} current={pagenumber} showTitle={false} showSizeChanger={false} total={allCount} pageSize={this.pageSize} onChange={this.onSelectPage.bind(this)}/>
                    </div>
                </div>
            </div>
        );
    }
    onSwichTemplate(objItem){
        this.setState({
            swichTemplateId:objItem.id
        })
        eventBus.emit('templatePageType', objItem.id)
    }
    onSelectPage(page){
        this.onGetTemplateData(page)
        this.setState({
            pagenumber:page
        })
    }
    onGetTemplateData(page){
        axios.get(`${window.strHttp}/api/ai_prom/prompt/list?page_size=${this.pageSize}&page=${page}&operation="base_info"&lang="zh`).then(res=>{
            this.setState({
                allTemplate:res.data.data.conds,
                pagenumber:res.data.data.current_page,
                allCount:res.data.data.total_count
            })
        })
    }
}

export default TemplatePage;
