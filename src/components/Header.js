import React from "react";
import { Link } from "react-router-dom";
import { Menu, Row, Col } from "antd";
import { useSelector } from "react-redux";

const Component = () => {
	const user = useSelector(state => state.userReducer);
	
	return (
		<Row className="menuRow" justify="center" align="middle">
			<Col span={18}>
				<Row align="middle">
					<Col span={4}>
						<b>MERN-Boilerplate</b>
					</Col>
					<Col span={20}>
						<div className="Menu">
							{ user.email ?
								<Menu mode="horizontal" style={{float: "right"}}>
									<Menu.Item key="home">
										<Link to="/dashboard">Dashboard</Link>
									</Menu.Item>
									<Menu.Item key="logout">
										<Link to="/logout">Logout</Link>
									</Menu.Item>
								</Menu>
								:
								<Menu mode="horizontal" style={{float: "right"}}>
									<Menu.Item key="login">
										<Link to="/login">Login</Link>
									</Menu.Item>
									<Menu.Item key="register">
										<Link to="/register">Register</Link>
									</Menu.Item>
								</Menu>
							}
						</div>
					</Col>
				</Row>
			</Col>
		</Row>
	);
};

export default Component;