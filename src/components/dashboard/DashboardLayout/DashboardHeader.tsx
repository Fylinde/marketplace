import React from "react";
import styled from "styled-components";
import { Breadcrumb, Button, Space } from "antd";
import { BellOutlined, SettingOutlined, LogoutOutlined } from "@ant-design/icons";

const HeaderContainer = styled.div`
  background-color: #fff;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  height: 64px;
`;

const DashboardHeader: React.FC<{ breadcrumb: string[] }> = ({ breadcrumb }) => (
  <HeaderContainer>
    <Breadcrumb>
      {breadcrumb.map((item, index) => (
        <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>
      ))}
    </Breadcrumb>
    <Space>
      <Button icon={<BellOutlined />} type="text" />
      <Button icon={<SettingOutlined />} type="text" />
      <Button icon={<LogoutOutlined />} type="text" />
    </Space>
  </HeaderContainer>
);

export default DashboardHeader;
