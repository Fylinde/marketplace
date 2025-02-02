import React, { useState, useEffect } from "react";
import Box from "../../../components/Box";
import Button from "../../../components/buttons/Button";
import Modal from "../../../components/modal/Modal";
import Input from "../../../components/input/Input";
import Table from "../../../components/table/Table";
import Pagination from "../../../components/pagination/Pagination";
import Chart from "../../../components/chart/Chart";
import { validateString, validateNumeric } from "../../../services/validationService";


interface AdCampaignManagerProps {
  data: any; // Replace `any` with the correct type
  onUpdate: (updatedData: any) => void; // Replace `any` with the correct type
}

// Define types for Ad Campaign
interface AdCampaign {
  id: string;
  name: string;
  budget: number;
  startDate: string;
  endDate: string;
  status: "Active" | "Paused" | "Ended";
  impressions: number;
  clicks: number;
  conversions: number;
}

const AdCampaignManagement: React.FC<AdCampaignManagerProps> = ({ data, onUpdate }) => {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState<AdCampaign>({
    id: "",
    name: "",
    budget: 0,
    startDate: "",
    endDate: "",
    status: "Active",
    impressions: 0,
    clicks: 0,
    conversions: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | "Active" | "Paused" | "Ended">("All");
  const [filterBudgetRange, setFilterBudgetRange] = useState<[number, number] | null>(null);
  const [filterDateRange, setFilterDateRange] = useState<[string, string] | null>(null);

  const itemsPerPage = 5;

  useEffect(() => {
    // Load initial data (this can be replaced with an API call)
    setCampaigns([
      {
        id: "1",
        name: "Spring Sale",
        budget: 500,
        startDate: "2023-01-01",
        endDate: "2023-01-31",
        status: "Active",
        impressions: 10000,
        clicks: 500,
        conversions: 50,
      },
      {
        id: "2",
        name: "Summer Campaign",
        budget: 1000,
        startDate: "2023-06-01",
        endDate: "2023-06-30",
        status: "Paused",
        impressions: 20000,
        clicks: 800,
        conversions: 70,
      },
    ]);
  }, []);

  const handleInputChange = (field: keyof AdCampaign, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateCampaign = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.trim().length < 3) {
      newErrors.name = "Campaign name must be at least 3 characters.";
    }

    if (formData.budget <= 0) {
      newErrors.budget = "Budget must be greater than 0.";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required.";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required.";
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = "End date must be after the start date.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveCampaign = () => {
    if (!validateCampaign()) return;

    if (isEdit) {
      setCampaigns((prev) =>
        prev.map((campaign) =>
          campaign.id === formData.id ? { ...formData } : campaign
        )
      );
    } else {
      const newCampaign: AdCampaign = {
        ...formData,
        id: Date.now().toString(),
        impressions: 0,
        clicks: 0,
        conversions: 0,
      };
      setCampaigns((prev) => [...prev, newCampaign]);
    }

    setIsModalOpen(false);
    setFormData({
      id: "",
      name: "",
      budget: 0,
      startDate: "",
      endDate: "",
      status: "Active",
      impressions: 0,
      clicks: 0,
      conversions: 0,
    });
  };

  const handleDeleteCampaign = (id: string) => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      setCampaigns((prev) => prev.filter((campaign) => campaign.id !== id));
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm("Are you sure you want to delete selected campaigns?")) {
      setCampaigns((prev) => prev.filter((campaign) => !selectedCampaigns.includes(campaign.id)));
      setSelectedCampaigns([]);
    }
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || campaign.status === filterStatus;
    const matchesBudget =
      !filterBudgetRange ||
      (campaign.budget >= filterBudgetRange[0] && campaign.budget <= filterBudgetRange[1]);
    const matchesDate =
      !filterDateRange ||
      (new Date(campaign.startDate) >= new Date(filterDateRange[0]) &&
        new Date(campaign.endDate) <= new Date(filterDateRange[1]));

    return matchesSearch && matchesStatus && matchesBudget && matchesDate;
  });

  const paginatedCampaigns = filteredCampaigns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Box>
      <h1>Ad Campaign Management</h1>

      {/* Analytics Dashboard */}
      <Box mb="30px">
        {["Impressions", "Clicks", "Conversions"].map((metric) => (
          <Chart
            key={metric}
            data={campaigns.map((campaign) => ({
              name: campaign.name,
              value: campaign[metric.toLowerCase() as keyof AdCampaign],
            }))}
            dataKeys={{ name: "name", value: "value" }}
            chartType="table"
            title={`Campaign ${metric} Overview`}
          />
        ))}
      </Box>


      {/* Search and Filters */}
      <Box display="flex" justifyContent="space-between" mb="20px">
        <Input
          label="Search Campaigns"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
        >
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Paused">Paused</option>
          <option value="Ended">Ended</option>
        </select>
        <Input
            label="Budget Range"
            type="text"
            placeholder="e.g., 100-500"
            value={filterBudgetRange ? `${filterBudgetRange[0]}-${filterBudgetRange[1]}` : ""}
            onChange={(e) => {
                const [min, max] = e.target.value.split("-").map(Number);
                setFilterBudgetRange([min, max]);
            }}
              />
         <Input
            label="Date Range"
            type="text"
            placeholder="e.g., 2023-01-01 to 2023-12-31"
            value={filterBudgetRange ? `${filterBudgetRange[0]}-${filterBudgetRange[1]}` : ""}
            onChange={(e) => {
                const [start, end] = e.target.value.split(" to ");
                setFilterDateRange([start, end]);
              }}
            />
      </Box>

      {/* Campaign Table */}
      <Table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={(e) =>
                  setSelectedCampaigns(
                    e.target.checked ? campaigns.map((c) => c.id) : []
                  )
                }
              />
            </th>
            <th>Name</th>
            <th>Budget</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Impressions</th>
            <th>Clicks</th>
            <th>Conversions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCampaigns.map((campaign) => (
            <tr key={campaign.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedCampaigns.includes(campaign.id)}
                  onChange={(e) =>
                    setSelectedCampaigns((prev) =>
                        e.target.checked
                          ? [...prev, campaign.id]
                          : prev.filter((id) => id !== campaign.id)
                      )
                    }
                  />
                </td>
                <td>{campaign.name}</td>
                <td>${campaign.budget.toFixed(2)}</td>
                <td>{campaign.startDate}</td>
                <td>{campaign.endDate}</td>
                <td>{campaign.status}</td>
                <td>{campaign.impressions}</td>
                <td>{campaign.clicks}</td>
                <td>{campaign.conversions}</td>
                <td>
                  <Button
                    onClick={() => {
                      setIsEdit(true);
                      setFormData(campaign);
                      setIsModalOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button onClick={() => handleDeleteCampaign(campaign.id)}>Delete</Button>
                  <Button onClick={() => {
                    setFormData(campaign);
                    setIsPreviewOpen(true);
                  }}>
                    Preview
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
  
        {/* Bulk Actions */}
        {selectedCampaigns.length > 0 && (
          <Box mt="20px">
            <Button onClick={handleBulkDelete}>Delete Selected Campaigns</Button>
          </Box>
        )}
  
        {/* Pagination */}
        <Pagination
            pageCount={Math.ceil(campaigns.length / itemsPerPage)}
            onChange={({ selected }) => setCurrentPage(selected + 1)}
            forcePage={currentPage - 1} // Sync active page with state
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            />

  
        <Button onClick={() => {
          setIsEdit(false);
          setFormData({
            id: "",
            name: "",
            budget: 0,
            startDate: "",
            endDate: "",
            status: "Active",
            impressions: 0,
            clicks: 0,
            conversions: 0,
          });
          setIsModalOpen(true);
        }}>
          Create New Campaign
        </Button>
  
        {/* Modal for Create/Edit */}
        {isModalOpen && (
          <Modal
            title={isEdit ? "Edit Campaign" : "Create New Campaign"}
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          >
            <Box display="flex" flexDirection="column" gap="10px">
              <Input
                label="Campaign Name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                error={errors.name}
              />
              <Input
                label="Budget"
                type="number"
                value={formData.budget}
                onChange={(e) =>
                  handleInputChange("budget", parseFloat(e.target.value))
                }
                error={errors.budget}
              />
              <Input
                label="Start Date"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                error={errors.startDate}
              />
              <Input
                label="End Date"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                error={errors.endDate}
              />
              <select
                value={formData.status}
                onChange={(e) =>
                  handleInputChange("status", e.target.value as "Active" | "Paused" | "Ended")
                }
              >
                <option value="Active">Active</option>
                <option value="Paused">Paused</option>
                <option value="Ended">Ended</option>
              </select>
              <Button onClick={handleSaveCampaign}>
                {isEdit ? "Update Campaign" : "Create Campaign"}
              </Button>
            </Box>
          </Modal>
        )}
  
        {/* Modal for Preview */}
        {isPreviewOpen && (
          <Modal
            title={`Preview Campaign: ${formData.name}`}
            open={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
          >
            <Box>
              <h3>Campaign Details</h3>
              <p><strong>Name:</strong> {formData.name}</p>
              <p><strong>Budget:</strong> ${formData.budget.toFixed(2)}</p>
              <p><strong>Start Date:</strong> {formData.startDate}</p>
              <p><strong>End Date:</strong> {formData.endDate}</p>
              <p><strong>Status:</strong> {formData.status}</p>
              <p><strong>Impressions:</strong> {formData.impressions}</p>
              <p><strong>Clicks:</strong> {formData.clicks}</p>
              <p><strong>Conversions:</strong> {formData.conversions}</p>
            </Box>
          </Modal>
        )}
      </Box>
    );
  };
  
  export default AdCampaignManagement;
  
