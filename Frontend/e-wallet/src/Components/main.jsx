import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Avatar, Button, List } from "antd";
import { Col, InputNumber, Row, Slider, Space } from "antd";

const Main = () => {
  const [inputValue, setInputValue] = useState(1);
  const onChange = (newValue) => {
    setInputValue(newValue);
  };
  const [data, setData] = useState([]);
  useEffect(() => {
    fetchData();
    console.log(data, "---> data");
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/getAllUsersInfo");
      const sanitizedData = response.data.map((user) => ({
        id: user._id,
        Name: user.Name,
        WalletHistory: user.WalletHistory,
        Wallet: user.Wallet
      }));
      setData(sanitizedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const changeWallet = async (id, value) => {
    console.log(inputValue, "inputValue")
    try {
      const response = await axios.patch(
        `http://localhost:8000/updatewallet/${id}`,
        inputValue
      );
      console.log(response);
      window.location.reload();
    } catch (error) {}
  };

  const gradientStyle = {
    background: "linear-gradient(135deg, #292929, #563d7c)",
    minHeight: "100vh",
    margin: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  };
  return (
    <div style={gradientStyle}>
      <h2
        style={{
          color: "#FFFFFF",
          fontFamily: "fantasy",
          fontSize: "40px",
          fontStyle: "italic",
          transform: "translateY(-15vh)",
        }}
      >
        User List
      </h2>
      <List
        style={{ minWidth: "100%" }}
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar
                  src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
                />
              }
              title={
                <label style={{ color: "#FFFFFF" }}>
                  {item.Name} {item.Wallet}
                  <label style={{ color: "#FFFFFF" }}>
                    <ul>
                      {item.WalletHistory.map((user) => (
                        <li key={user.id}>{user}</li>
                      ))}
                    </ul>
                  </label>
                  <Col span={12}>
                    <Slider
                      style={{ backgroundColor: "#000000" }}
                      min={0}
                      max={100}
                      onChange={onChange}
                      value={typeof inputValue === "number" ? inputValue : 0}
                    />
                    <Button
                      onClick={() =>
                        changeWallet(item.id)
                      }
                    >
                      Change Wallet Value
                    </Button>
                  </Col>
                </label>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};
export default Main;
