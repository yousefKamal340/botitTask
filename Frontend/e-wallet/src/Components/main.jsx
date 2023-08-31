import React, { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, Button, List } from "antd";
import { Col, Slider } from "antd";

const Main = () => {
  const [inputValues, setInputValues] = useState([]);
  const onChange = (index, newValue) => {
    const updatedInputValues = [...inputValues];
    updatedInputValues[index] = newValue;
    setInputValues(updatedInputValues);
  };

  const [data, setData] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/getAllUsersInfo");
      const sanitizedData = response.data.map((user) => ({
        id: user._id,
        Name: user.Name,
        WalletHistory: user.WalletHistory,
        Wallet: user.Wallet,
      }));
      setData(sanitizedData);
      setInputValues(new Array(sanitizedData.length).fill(0));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const changeWallet = async (id, value) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/updatewallet/${id}`,
        value
      );
      console.log(response);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
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
                      onChange={(newValue) => onChange(index, newValue)}
                      value={typeof inputValues[index] === "number" ? inputValues[index] : 0}
                    />
                    <Button onClick={() => changeWallet(item.id, inputValues[index])}>
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
