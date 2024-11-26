import React, { useState, useEffect } from "react";
import Box from "components/Box";
import Button from "components/buttons/Button";
import Modal from "components/modal/Modal";
import Input from "components/input/Input";
import Table from "components/table/Table";

// Define the type for a single day's business hours
interface BusinessHour {
  day: string;
  openTime: string; // e.g., "09:00 AM"
  closeTime: string; // e.g., "05:00 PM"
  isClosed: boolean;
}

// Define the props for the component
interface BusinessHoursProps {
  data: BusinessHour[]; // Business hours for all days
  onUpdate: (updatedData: BusinessHour[]) => void; // Callback to update the parent component
}

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const BusinessHours: React.FC<BusinessHoursProps> = ({ data, onUpdate }) => {
  const [hours, setHours] = useState<BusinessHour[]>(data || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDay, setCurrentDay] = useState<string | null>(null);
  const [formData, setFormData] = useState<BusinessHour>({
    day: "",
    openTime: "",
    closeTime: "",
    isClosed: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync state with incoming `data` prop
  useEffect(() => {
    setHours(data);
  }, [data]);

  const handleInputChange = (field: keyof BusinessHour, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateBusinessHour = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.isClosed) {
      if (!formData.openTime) {
        newErrors.openTime = "Opening time is required.";
      }

      if (!formData.closeTime) {
        newErrors.closeTime = "Closing time is required.";
      }

      if (
        formData.openTime &&
        formData.closeTime &&
        new Date(`1970-01-01T${formData.openTime}`) >= new Date(`1970-01-01T${formData.closeTime}`)
      ) {
        newErrors.closeTime = "Closing time must be after opening time.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveHours = () => {
    if (!validateBusinessHour()) return;

    const updatedHours = hours.map((hour) =>
      hour.day === currentDay
        ? { ...hour, ...formData }
        : hour
    );

    setHours(updatedHours);
    onUpdate(updatedHours); // Notify the parent component
    setIsModalOpen(false);
    setFormData({ day: "", openTime: "", closeTime: "", isClosed: false });
  };

  const openModal = (day: string) => {
    const dayData = hours.find((hour) => hour.day === day);

    if (dayData) {
      setFormData(dayData);
      setCurrentDay(day);
    } else {
      setFormData({ day, openTime: "", closeTime: "", isClosed: false });
      setCurrentDay(day);
    }

    setIsModalOpen(true);
  };

  return (
    <Box>
      <h2>Business Hours</h2>
      <Table>
        <thead>
          <tr>
            <th>Day</th>
            <th>Opening Time</th>
            <th>Closing Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {hours.map((hour) => (
            <tr key={hour.day}>
              <td>{hour.day}</td>
              <td>{hour.isClosed ? "N/A" : hour.openTime || "Not Set"}</td>
              <td>{hour.isClosed ? "N/A" : hour.closeTime || "Not Set"}</td>
              <td>{hour.isClosed ? "Closed" : "Open"}</td>
              <td>
                <Button onClick={() => openModal(hour.day)}>Edit</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal
        title={`Edit Business Hours for ${currentDay || ""}`}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <Box display="flex" flexDirection="column" style={{ gap: "10px" }}>
          <label>
            <input
              type="checkbox"
              checked={formData.isClosed}
              onChange={(e) => handleInputChange("isClosed", e.target.checked)}
            />
            Mark as Closed
          </label>
          {!formData.isClosed && (
            <>
              <Input
                label="Opening Time"
                type="time"
                value={formData.openTime}
                onChange={(e) => handleInputChange("openTime", e.target.value)}
                error={errors.openTime}
              />
              <Input
                label="Closing Time"
                type="time"
                value={formData.closeTime}
                onChange={(e) => handleInputChange("closeTime", e.target.value)}
                error={errors.closeTime}
              />
            </>
          )}
          <Button onClick={handleSaveHours}>Save</Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default BusinessHours;
