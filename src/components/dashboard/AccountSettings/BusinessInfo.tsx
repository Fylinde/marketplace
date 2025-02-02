import React from "react";
import TextField from "../../../components/text-field/TextField";
import Box from "../../../components/Box";
import Grid from "../../../components/grid/Grid";
import Button from "../../../components/buttons/Button";

interface BusinessInfoProps {
  data: { businessName: string; taxId: string; hours: string };
  onUpdate: (updatedData: any) => void;
}

const BusinessInfo: React.FC<BusinessInfoProps> = ({ data, onUpdate }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState(data);

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  return (
    <Box mb="30px">
      <Grid container spacing={3}>
        <Grid item md={6} xs={12}>
          <TextField
            label="Business Name"
            name="businessName"
            value={formData.businessName}
            onChange={(e) =>
              setFormData({ ...formData, businessName: e.target.value })
            }
            disabled={!isEditing}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <TextField
            label="Tax ID"
            name="taxId"
            value={formData.taxId}
            onChange={(e) =>
              setFormData({ ...formData, taxId: e.target.value })
            }
            disabled={!isEditing}
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <TextField
            label="Operational Hours"
            name="hours"
            value={formData.hours}
            onChange={(e) =>
              setFormData({ ...formData, hours: e.target.value })
            }
            disabled={!isEditing}
          />
        </Grid>
      </Grid>
      <Button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? "Cancel" : "Edit"}
      </Button>
      {isEditing && <Button onClick={handleSave}>Save Changes</Button>}
    </Box>
  );
};

export default BusinessInfo;
