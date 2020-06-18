import React from "react";
import { Row, Col } from "antd";
import { useSelector } from "react-redux";

const Component = () => {
	const user = useSelector(state => state.userReducer);

	return (
		<>
			<Row className="HomePageRow2" justify="center" align="center">
				<Col className="HomePageCol2" span={24}>
					<h1 className="HomePageRow2Title">Welcome, {user.firstName}</h1>
				</Col>
			</Row>
		</>
	);
};

export default Component;