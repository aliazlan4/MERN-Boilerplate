import React, { useState } from "react";
import {Redirect} from "react-router-dom";
import { notification } from "antd";
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/actions/UserActions";

const Component = () => {
	const dispatch = useDispatch();
	const [redirect, setRedirect] = useState(false);

	fetch("/api/auth/logout", {
		method: "GET",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
	}).then(response => {
		if (response.status === 200) {
			dispatch(logoutUser());
			notification["success"]({
				message: "Logout Successful",
				duration: 3
			});
		}
		setRedirect(true);
	});

	if(redirect){
		return <Redirect to='/' />;
	}

	return <></>;
};

export default Component;