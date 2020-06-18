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

const validateMessages = {
	required: "${label} is required!",
	types: {
		email: "${label} is not validate email!",
		number: "${label} is not a validate number!",
	},
	number: {
		range: "${label} must be between ${min} and ${max}",
	},
};

const Component = () => {
	const dispatch = useDispatch();
    
	const [redirect, setRedirect] = useState(false);

	const onFinish = async (values) => {
		const { email, password, firstName, lastName } = values;

		const response = await fetch("/api/auth/register", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ email, password, firstName, lastName })
		});
		const data = await response.json();

		if (data.status === true) {
			notification["success"]({
				message: "Register Successfully",
				duration: 3
			});
			const { _id, firstName, lastName, email, role } = data.user;
			localStorage.setItem("user", JSON.stringify({ _id, firstName, lastName, email, role }));
			dispatch(changeUser(_id, firstName, lastName, email, role));
			setRedirect(true);
		} else {
			notification["error"]({
				message: "Register Failed",
				description: data.message,
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
				<h1>Signup</h1>
				<Form {...layout}  name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
					<Form.Item
						name="firstName"
						label="First Name"
						rules={[{
							required: true,
						}]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						name="lastName"
						label="Last Name"
						rules={[{
							required: true,
						}]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						name="email"
						label="Email"
						rules={[{
							type: "email",
							required: true,
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