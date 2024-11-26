import React, { useState } from "react";
import styled from "styled-components";
import Box from "components/Box";
import Table from "components/table/Table";
import Button from "components/buttons/Button";
import Input from "components/input/Input";
import Dropdown from "components/dropdown/Dropdown";
import { getLocalizedText } from "../utils/localizationUtils";

interface RefundRule {
  id: string;
  condition: string;
  action: string;
  currency: string;
  paymentType: string;
}

const StyledBox = styled(Box)`
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  max-width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const StyledTable = styled(Table)`
  width: 100%;
  margin-top: 20px;

  th, td {
    text-align: left;
    padding: 10px;
  }

  @media (max-width: 768px) {
    th, td {
      font-size: 14px;
    }
  }
`;

const RefundAutomation: React.FC = () => {
  const [rules, setRules] = useState<RefundRule[]>([]);
  const [newRule, setNewRule] = useState({
    condition: "",
    action: "",
    currency: "USD",
    paymentType: "Fiat",
  });
  const [editRuleId, setEditRuleId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("");

  const addOrEditRule = () => {
    if (!newRule.condition || !newRule.action) {
      alert(getLocalizedText("allFieldsRequired"));
      return;
    }
    if (editRuleId) {
      setRules((prev) =>
        prev.map((rule) =>
          rule.id === editRuleId ? { ...newRule, id: rule.id } : rule
        )
      );
      setEditRuleId(null);
    } else {
      setRules((prev) => [
        ...prev,
        { ...newRule, id: Date.now().toString() },
      ]);
    }
    setNewRule({ condition: "", action: "", currency: "USD", paymentType: "Fiat" });
  };

  const previewRuleExecution = (rule: RefundRule) => {
    alert(
      getLocalizedText("ruleExecutionPreview", {
        condition: rule.condition,
        action: rule.action,
      })
    );
  };

  const filteredRules = rules.filter((rule) =>
    [rule.condition, rule.action]
      .join(" ")
      .toLowerCase()
      .includes(filter.toLowerCase())
  );

  return (
    <StyledBox>
      <h2>{getLocalizedText("refundAutomationTitle")}</h2>
      <Input
        label={getLocalizedText("filterLabel")}
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <Box>
        <Input
          label={getLocalizedText("conditionLabel")}
          value={newRule.condition}
          onChange={(e) =>
            setNewRule((prev) => ({ ...prev, condition: e.target.value }))
          }
        />
        <Input
          label={getLocalizedText("actionLabel")}
          value={newRule.action}
          onChange={(e) =>
            setNewRule((prev) => ({ ...prev, action: e.target.value }))
          }
        />
        <Dropdown
          label={getLocalizedText("currencyLabel")}
          options={["USD", "EUR", "BTC", "ETH"]}
          value={newRule.currency}
          onChange={(value) =>
            setNewRule((prev) => ({ ...prev, currency: value }))
          }
        />
        <Dropdown
          label={getLocalizedText("paymentTypeLabel")}
          options={["Fiat", "Crypto", "Escrow"]}
          value={newRule.paymentType}
          onChange={(value) =>
            setNewRule((prev) => ({ ...prev, paymentType: value }))
          }
        />
        <Button onClick={addOrEditRule}>
          {editRuleId
            ? getLocalizedText("editRuleButton")
            : getLocalizedText("addRuleButton")}
        </Button>
      </Box>
      <StyledTable>
        <thead>
          <tr>
            <th>{getLocalizedText("conditionColumn")}</th>
            <th>{getLocalizedText("actionColumn")}</th>
            <th>{getLocalizedText("currencyColumn")}</th>
            <th>{getLocalizedText("paymentTypeColumn")}</th>
            <th>{getLocalizedText("actionsColumn")}</th>
          </tr>
        </thead>
        <tbody>
          {filteredRules.map((rule) => (
            <tr key={rule.id}>
              <td>{rule.condition}</td>
              <td>{rule.action}</td>
              <td>{rule.currency}</td>
              <td>{rule.paymentType}</td>
              <td>
                <Button
                  onClick={() => {
                    setNewRule(rule);
                    setEditRuleId(rule.id);
                  }}
                >
                  {getLocalizedText("editButton")}
                </Button>
                <Button
                  onClick={() =>
                    setRules((prev) => prev.filter((r) => r.id !== rule.id))
                  }
                >
                  {getLocalizedText("deleteButton")}
                </Button>
                <Button onClick={() => previewRuleExecution(rule)}>
                  {getLocalizedText("previewButton")}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </StyledBox>
  );
};

export default RefundAutomation;
