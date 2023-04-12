import './index.less';
import ReactDOM from "react-dom";
import {BrowserRouter} from "react-router-dom";
import React from "react";
import LoginPage from "../../pages/loginPage";


class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    render() {
        return (
            <div className="Header">
                <div style={{display:"flex",alignItems: "center"}}>
                    <div className="Header_icon"></div>
                    <span className="Header_font">AI Prom</span>
                </div>
                <div className="Header_exit" onClick={this.ononExitAccount.bind()}>登出</div>
            </div>
        );
    }
    ononExitAccount(){
        ReactDOM.render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>,

            document.getElementById('root')
        );
    }
}

export default Header;
