import React from "react";
import { Button, Form, Input } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const nav = useNavigate();
  const gradientStyle = {
    background: "linear-gradient(135deg, #292929, #563d7c)",
    minHeight: "100vh",
    margin: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  };

  const onFinish = async (values) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/register",
        values
      );
      // Change the URL if needed
      console.log("Registration successful:", response.data);
      nav("/login");
      window.location.reload()
      // Optionally, you can show a success message or navigate to a new page
    } catch (error) {
      console.error("Registration failed:", error);
      // Optionally, you can show an error message to the user
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div style={gradientStyle}>
      <p
        style={{
          color: "#FFFFFF",
          fontFamily: "fantasy",
          fontSize: "40px",
          fontStyle: "italic",
          transform: "translateY(-15vh)",
        }}
      >
        Welcome To E-Wallet
      </p>
      <p
        style={{
          color: "#FFFFFF",
          fontSize: "25px",
          transform: "translateY(-15vh)",
        }}
      >
        Please Register to Continue
      </p>
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
          transform: "translateY(-10vh)",
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label={<label style={{ color: "#FFFFFF" }}>Username</label>}
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={<label style={{ color: "#FFFFFF" }}>Password</label>}
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Landing;
