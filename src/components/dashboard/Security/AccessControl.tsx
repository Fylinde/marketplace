import React, { useEffect } from "react";
import { Table, Switch, Spin, Alert } from "antd";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { fetchAccessControlList, updateAccessStatus } from "@/redux/slices/security/securitySlice";
import { RootState, AppDispatch } from "@/redux/store";
import { getLocalizedText } from "utils/localizationUtils";

const Container = styled.div`
  padding: 20px;

  .unauthorized-message {
    text-align: center;
    padding: 20px;
    color: red;
    font-size: 1.5rem;
  }
`;

interface AccessControlProps {
  requiredRole?: string;
  children?: React.ReactNode;
}

const AccessControl: React.FC<AccessControlProps> = ({ requiredRole, children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { accessControlList, loading, error } = useSelector((state: RootState) => state.security);
  const userRole = useSelector((state: RootState) => state.auth.role);

  useEffect(() => {
    dispatch(fetchAccessControlList());
  }, [dispatch]);

  const handleToggleAccess = (userId: string, status: boolean) => {
    dispatch(updateAccessStatus({ userId, status }));
  };

  const columns = [
    {
      title: getLocalizedText("User Name", "accessControl"),
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: getLocalizedText("Role", "accessControl"),
      dataIndex: "role",
      key: "role",
    },
    {
      title: getLocalizedText("Access Status", "accessControl"),
      key: "status",
      render: (_: any, record: any) => (
        <Switch
          checked={record.status}
          onChange={(checked) => handleToggleAccess(record.userId, checked)}
        />
      ),
    },
  ];

  if (requiredRole && userRole !== requiredRole) {
    return (
      <Container>
        <div className="unauthorized-message">
          {getLocalizedText("You are not authorized to view this page.", "accessControl")}
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <h2>{getLocalizedText("Access Control", "accessControl")}</h2>
      {loading && <Spin />}
      {error && <Alert message={error} type="error" />}
      {!loading && !error && <Table dataSource={accessControlList} columns={columns} rowKey="userId" />}
      {children}
    </Container>
  );
};

export default AccessControl;
