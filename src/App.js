import React from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import { useSelector } from "react-redux";

import "antd/dist/antd.css";
import "./style/App.scss";

import Header from "./components/Header";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import Login from "./components/Login";
import Register from "./components/Register";
import Logout from "./components/Logout";
import Dashboard from "./components/Dashboard";

function App({ children }) {
	return (
		<div className="app">
			<Header />
			<main>{children}</main>
		</div>
	);
}

const ProtectedRoute = ({ component: Component, ...rest }) => {
	const user = useSelector(state => state.userReducer);
	return (
		<Route {...rest} render={(props) => (
			user.email
				? <Component {...props} />
				: <Redirect to='/login' />
		)} />
	);
};

const AppRouter = () => {
	return (
		<BrowserRouter>
			<App>
				<Switch>
					<Route exact path="/" component={Home}/>
					<Route exact path="/login" component={Login}/>
					<Route exact path="/register" component={Register}/>
					<ProtectedRoute exact path="/dashboard" component={Dashboard} />
					<ProtectedRoute exact path="/logout" component={Logout} />
					<Route component={NotFound} />
				</Switch>
			</App>
		</BrowserRouter>
	);
};

export default AppRouter;
