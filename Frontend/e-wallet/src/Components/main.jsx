import React, { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, Button, Card, Col, Row, Slider, Table, Tag } from "antd";
import {
  EyeOutlined,
  WalletOutlined,
  HistoryOutlined,
} from "@ant-design/icons";

const Main = () => {
  const [inputValues, setInputValues] = useState([]);
  const onChange = (index, newValue) => {
    const updatedInputValues = [...inputValues];
    updatedInputValues[index] = newValue;
    setInputValues(updatedInputValues);
  };

  const [data, setData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showWalletHistory, setShowWalletHistory] = useState(false);

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

  const columns = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar, record, index) => (
        <Avatar
          src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
    },
    {
      title: "Wallet",
      dataIndex: "Wallet",
      key: "Wallet",
      render: (Wallet) => (
        <Tag color={Wallet >= 0 ? "green" : "red"}>
          {Wallet >= 0 ? `$${Wallet}` : `-$${Math.abs(Wallet)}`}
        </Tag>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <div>
          <Button
            icon={<EyeOutlined />}
            onClick={() => setSelectedUser(data[record.key])}
          >
            View Card
          </Button>
          <Button
            icon={<WalletOutlined />}
            onClick={() => setShowWalletHistory(!showWalletHistory)}
          >
            View Wallet History
          </Button>
        </div>
      ),
    },
  ];

  const dataSource = data.map((item, index) => ({
    key: index,
    avatar: item.id,
    Name: item.Name,
    Wallet: item.Wallet,
  }));

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
      <div style={{ padding: "20px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px", color: "white" }}>User List</h2>
        <Table
          columns={columns}
          dataSource={dataSource}
          style={{ backgroundColor: "white" }}
          bordered
        />
        {selectedUser && (
          <Card
            style={{
              marginTop: "20px",
              padding: "20px",
              textAlign: "center",
              backgroundColor: "gray"
            }}
          >
            <Avatar
              size={100}
              src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${data.indexOf(
                selectedUser
              )}`}
            />
            <h2>{selectedUser.Name}</h2>
            <p>
              Wallet:{" "}
              <Tag color={selectedUser.Wallet >= 0 ? "green" : "red"}>
                {selectedUser.Wallet >= 0
                  ? `$${selectedUser.Wallet}`
                  : `-$${Math.abs(selectedUser.Wallet)}`}
              </Tag>
            </p>
            {showWalletHistory && (
              <div>
                <h3>Wallet History</h3>
                <ul>
                  {selectedUser.WalletHistory.map((historyItem, index) => (
                    <li key={index}>{historyItem}</li>
                  ))}
                </ul>
              </div>
            )}
            <Slider
              style={{ backgroundColor: "#000000" }}
              min={0}
              max={100}
              onChange={(newValue) =>
                onChange(data.indexOf(selectedUser), newValue)
              }
              value={
                typeof inputValues[data.indexOf(selectedUser)] === "number"
                  ? inputValues[data.indexOf(selectedUser)]
                  : 0
              }
            />
            <Button
              style={{ marginTop: "10px" }}
              onClick={() =>
                changeWallet(
                  selectedUser.id,
                  inputValues[data.indexOf(selectedUser)]
                )
              }
            >
              Change Wallet Value
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Main;
