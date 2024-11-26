import React, { useState } from "react";
import Box from "components/Box";
import Button from "components/buttons/Button";
import Input from "components/input/Input";
import Table from "components/table/Table";

const AutomatedOrderRules: React.FC = () => {
  const [rules, setRules] = useState<
    { id: string; name: string; condition: string; action: string }[]
  >([]);
  const [newRule, setNewRule] = useState({ name: "", condition: "", action: "" });

  const addRule = () => {
    if (!newRule.name || !newRule.condition || !newRule.action) {
      alert("All fields are required!");
      return;
    }
    setRules((prev) => [
      ...prev,
      { ...newRule, id: Date.now().toString() },
    ]);
    setNewRule({ name: "", condition: "", action: "" });
  };

  const deleteRule = (id: string) => {
    setRules((prev) => prev.filter((rule) => rule.id !== id));
  };

  return (
    <Box>
      <h2>Automated Order Rules</h2>
      <Box mb="20px">
        <h3>Add New Rule</h3>
        <Input
          label="Rule Name"
          value={newRule.name}
          onChange={(e) => setNewRule((prev) => ({ ...prev, name: e.target.value }))}
        />
        <Input
          label="Condition (e.g., Refund < $100)"
          value={newRule.condition}
          onChange={(e) => setNewRule((prev) => ({ ...prev, condition: e.target.value }))}
        />
        <Input
          label="Action (e.g., Auto Approve)"
          value={newRule.action}
          onChange={(e) => setNewRule((prev) => ({ ...prev, action: e.target.value }))}
        />
        <Button onClick={addRule}>Add Rule</Button>
      </Box>

      <h3>Existing Rules</h3>
      <Table>
        <thead>
          <tr>
            <th>Rule Name</th>
            <th>Condition</th>
            <th>Action</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule) => (
            <tr key={rule.id}>
              <td>{rule.name}</td>
              <td>{rule.condition}</td>
              <td>{rule.action}</td>
              <td>
                <Button onClick={() => deleteRule(rule.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Box>
  );
};

export default AutomatedOrderRules;
