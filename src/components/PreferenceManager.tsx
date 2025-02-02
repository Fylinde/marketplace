// src/components/PreferenceManager.tsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserPreferenceService from "../services/UserPreferenceService";
import Box from "./Box";
import Button from "./buttons/Button";
import Typography from "./Typography";
import { RootState } from "../redux/store";

const PreferenceManager: React.FC = () => {
  const dispatch = useDispatch();
  const [preferences, setPreferences] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const userId = useSelector((state: RootState) => state.auth.user?.id); // Fetch userId dynamically

  useEffect(() => {
    if (userId) {
      setLoading(true);
      UserPreferenceService.getUserPreferences(userId.toString()) // Convert to string
        .then((data) => {
          setPreferences(data);
        })
        .catch((err) => {
          console.error("Failed to load preferences:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userId]);

  const handleSavePreferences = () => {
    if (!userId) return; // Ensure userId exists
    setLoading(true);
    UserPreferenceService.updateUserPreferences(userId.toString(), preferences) // Convert to string
      .then(() => alert("Preferences saved successfully!"))
      .catch((err) => {
        console.error("Failed to save preferences:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Box>
      <Typography variant="h6" mb="1rem">
        Manage Your Preferences
      </Typography>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <form>
          <label>
            Favorite Categories:
            <input
              type="text"
              value={preferences.favoriteCategories || ""}
              onChange={(e) =>
                handlePreferenceChange("favoriteCategories", e.target.value)
              }
            />
          </label>

          <label>
            Excluded Brands:
            <input
              type="text"
              value={preferences.excludedBrands || ""}
              onChange={(e) =>
                handlePreferenceChange("excludedBrands", e.target.value)
              }
            />
          </label>

          <Button onClick={handleSavePreferences}>Save Preferences</Button>
        </form>
      )}
    </Box>
  );
};

export default PreferenceManager;