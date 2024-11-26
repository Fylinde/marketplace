import { createSlice } from "@reduxjs/toolkit";

const analyticsSlice = createSlice({
  name: "analytics",
  initialState: {
    chatbotResolved: 0,
    humanResolved: 0,
  },
  reducers: {
    incrementChatbotResolved: (state) => {
      state.chatbotResolved += 1;
    },
    incrementHumanResolved: (state) => {
      state.humanResolved += 1;
    },
  },
});

export const { incrementChatbotResolved, incrementHumanResolved } = analyticsSlice.actions;
export default analyticsSlice.reducer;
