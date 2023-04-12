// import { Route, Routes, useNavigate } from "react-router-dom";
//
//
// export const withNavigation = (Component) => {
//     return (props) => <Component {...props} navigate={useNavigate()} />;
// };
//
// class Home extends Component {
//     state = {
//         activeKey: "/index",
//         tabs: [
//             {
//                 key: "/index",
//                 title: "首页",
//                 icon: <AppOutline />,
//             },
//             {
//                 key: "/list",
//                 title: "找房",
//                 icon: <UnorderedListOutline />,
//             },
//             {
//                 key: "/news",
//                 title: "咨询",
//                 icon: <MessageOutline />,
//             },
//             {
//                 key: "/profile",
//                 title: "我的",
//                 icon: <UserOutline />,
//             },
//         ],
//     };
//     setActiveKey = (e) => {
//         let path = "/home" + e;
//         this.setState({
//             activeKey: e,
//         });
//         //跳转  不能用this.props.history.push()报错
//         this.props.navigate(path);
//     };
//
//     setActiveKey(params) {}
//     render() {
//         return (
//             <div className="homeCss">
//                 {/* 路由规则 */}
//                 <Routes>
//                     <Route path="/*" element={<Index />}></Route>
//                     <Route path="/home/news" element={<News />}></Route>
//                     <Route path="/home/list" element={<HouseList />}></Route>
//                     <Route path="/home/profile" element={<Profile />}></Route>
//                 </Routes>
//                 {/* 路由规则 */}
//                 <div className="tabbar">
//                     <TabBar activeKey={this.state.activeKey} onChange={this.setActiveKey}>
//                         {this.state.tabs.map((item) => (
//                             <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
//                         ))}
//                     </TabBar>
//                 </div>
//             </div>
//         );
//     }
// }
// //使用 withNavigation包裹类组件名称
// export default withNavigation(Home);