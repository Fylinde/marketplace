// Guidelines for safe packaging
import React, { useState, useEffect } from "react";
import Box from "components/Box";
import Table from "components/table/Table";
import Button from "components/buttons/Button";
import Modal from "components/modal/Modal";
import Input from "components/input/Input";
import Pagination from "components/pagination/Pagination";
import { useAppDispatch, useAppSelector } from "redux/slices/reduxHooks";
import { fetchPackagingGuidelines, createGuideline, deleteGuideline, updateGuideline } from "redux/slices/enhancementsSlice";
import { validateString } from "services/validationService";

interface PackagingGuideline {
  id: string;
  title: string;
  description: string;
  complianceLevel: "Mandatory" | "Recommended";
  region: string;
}

const PackagingGuidelines: React.FC = () => {
  const dispatch = useAppDispatch();
  const guidelinesFromRedux = useAppSelector((state) => state.enhancements.guidelines) as PackagingGuideline[];
  const isLoading = useAppSelector((state) => state.enhancements.loading);

  const [guidelines, setGuidelines] = useState<PackagingGuideline[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentGuideline, setCurrentGuideline] = useState<Partial<PackagingGuideline>>({
    title: "",
    description: "",
    complianceLevel: "Mandatory",
    region: "",
  });

  useEffect(() => {
    dispatch(fetchPackagingGuidelines());
  }, [dispatch]);

  useEffect(() => {
    setGuidelines(guidelinesFromRedux);
  }, [guidelinesFromRedux]);

  const handleSaveGuideline = () => {
    // Validate title and description
    const titleError = validateString(currentGuideline.title || "", "Title", 3);
    const descriptionError = validateString(currentGuideline.description || "", "Description", 1);
  
    if (titleError) {
      alert(titleError); // Show the title error if validation fails
      return;
    }
  
    if (descriptionError) {
      alert(descriptionError); // Show the description error if validation fails
      return;
    }
  
    // Handle updates or creation
    if (editMode && currentGuideline.id) {
      dispatch(
        updateGuideline({
          id: currentGuideline.id,
          updates: { ...currentGuideline },
        })
      )
        .unwrap()
        .then(() => {
          alert("Guideline updated successfully.");
          setModalOpen(false);
          setCurrentGuideline({});
        })
        .catch(() => alert("Failed to update the guideline."));
    } else {
      dispatch(createGuideline(currentGuideline as PackagingGuideline))
        .unwrap()
        .then(() => {
          alert("Guideline added successfully.");
          setModalOpen(false);
          setCurrentGuideline({});
        })
        .catch(() => alert("Failed to add the guideline."));
    }
  };
  
  

  const handleDeleteGuideline = (id: string) => {
    if (window.confirm("Are you sure you want to delete this guideline?")) {
      dispatch(deleteGuideline(id))
        .then(() => alert("Guideline deleted successfully."))
        .catch(() => alert("Failed to delete the guideline."));
    }
  };

  const filteredGuidelines = guidelines.filter((guideline) =>
    guideline.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedGuidelines = filteredGuidelines.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Box>
      <h2>Packaging Guidelines</h2>

      {/* Search Bar */}
      <Box display="flex" justifyContent="space-between" mb="20px">
        <Input
          label="Search Guidelines"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by title"
        />
        <Button onClick={() => {
          setEditMode(false);
          setCurrentGuideline({ title: "", description: "", complianceLevel: "Mandatory", region: "" });
          setModalOpen(true);
        }}>
          Add Guideline
        </Button>
      </Box>

      {/* Guidelines Table */}
      {isLoading ? (
        <p>Loading guidelines...</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Compliance Level</th>
              <th>Region</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedGuidelines.map((guideline) => (
              <tr key={guideline.id}>
                <td>{guideline.title}</td>
                <td>{guideline.description}</td>
                <td>{guideline.complianceLevel}</td>
                <td>{guideline.region}</td>
                <td>
                  <Button onClick={() => {
                    setEditMode(true);
                    setCurrentGuideline(guideline);
                    setModalOpen(true);
                  }}>Edit</Button>
                  <Button onClick={() => handleDeleteGuideline(guideline.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Pagination */}
      <Pagination
        pageCount={Math.ceil(filteredGuidelines.length / itemsPerPage)}
        onChange={({ selected }) => setCurrentPage(selected + 1)}
        forcePage={currentPage - 1}
      />

      {/* Add/Edit Guideline Modal */}
      {modalOpen && (
        <Modal
          title={editMode ? "Edit Guideline" : "Add New Guideline"}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        >
          <Box>
            <Input
              label="Title"
              value={currentGuideline.title || ""}
              onChange={(e) => setCurrentGuideline({ ...currentGuideline, title: e.target.value })}
            />
            <Input
              label="Description"
              value={currentGuideline.description || ""}
              onChange={(e) => setCurrentGuideline({ ...currentGuideline, description: e.target.value })}
            />
            <select
              value={currentGuideline.complianceLevel}
              onChange={(e) =>
                setCurrentGuideline({ ...currentGuideline, complianceLevel: e.target.value as "Mandatory" | "Recommended" })
              }
            >
              <option value="Mandatory">Mandatory</option>
              <option value="Recommended">Recommended</option>
            </select>
            <Input
              label="Region"
              value={currentGuideline.region || ""}
              onChange={(e) => setCurrentGuideline({ ...currentGuideline, region: e.target.value })}
            />
            <Button onClick={handleSaveGuideline}>{editMode ? "Update" : "Add"}</Button>
          </Box>
        </Modal>
      )}
    </Box>
  );
};

export default PackagingGuidelines;
