import React, { useState } from "react";
import { Row, Col, Form, Input, Button, notification } from "antd";
import {Redirect} from "react-router-dom";

import { useDispatch } from "react-redux";
import { changeUser } from "../redux/actions/UserActions";

const layout = {
	labelCol: {
		span: 4,
	},
	wrapperCol: {
		span: 16,
	},
};

const tailLayout = {
	wrapperCol: {
		offset: 4,
		span: 16,
	},
};

const Component = () => {
	const dispatch = useDispatch();
    
	const [redirect, setRedirect] = useState(false);

	const onFinish = async (values) => {
		const { email, password } = values;

		const response = await fetch("/api/auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ email, password })
		});

		if (response.status === 200) {
			const data = await response.json();
			notification["success"]({
				message: "Login Successfully",
				description: data.message,
			});
			const { _id, firstName, lastName, email, role } = data.user;
			dispatch(changeUser(_id, firstName, lastName, email, role));
			setRedirect(true);
		} else if (response.status === 401) {
			notification["error"]({
				message: "Login Failed",
				description: "email or password incorrect",
				duration: 3
			});
		} else {
			notification["error"]({
				message: "Login Failed",
				description: "unknow error",
				duration: 3
			});
		}
	};
    
	if(redirect){
		return <Redirect to='/dashboard' />;
	}

	return (
		<Row className="LoginForm" justify="center">
			<Col span={12}>
				<h1>Login</h1>
				<Form
					{...layout}
					name="basic"
					initialValues={{
						remember: true,
					}}
					onFinish={onFinish}
				>
					<Form.Item
						label="Email"
						name="email"
						rules={[{
							required: true,
							message: "Please input your email!",
						}]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						label="Password"
						name="password"
						rules={[{
							required: true,
							message: "Please input your password!",
						}]}
					>
						<Input.Password />
					</Form.Item>

					<Form.Item {...tailLayout}>
						<Button type="primary" htmlType="submit">
                            Submit
						</Button>
					</Form.Item>
				</Form>
			</Col>
		</Row>
	);
};

export default Component;