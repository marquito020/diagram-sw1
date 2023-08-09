import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { UserInfo } from "../../interfaces/user.interface";

const EmptyUserState: UserInfo = {
  _id: "",
  email: "",
  firstName: "",
  lastName: "",
  token: "",
};

const persistLocalStorageUser = (user: UserInfo) => {
  localStorage.setItem("user", JSON.stringify(user));
};

const clearLocalStorageUser = () => {
  localStorage.removeItem("user");
};

export const userSlice = createSlice({
  name: "user",
  initialState: localStorage.getItem("user")
    ? (JSON.parse(localStorage.getItem("user") as string) as UserInfo)
    : EmptyUserState,
  reducers: {
    createUser: (_state, action: PayloadAction<UserInfo>) => {
      persistLocalStorageUser(action.payload);
      return action.payload;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    resetUser: (_state) => {
      clearLocalStorageUser();
      return EmptyUserState;
    },
  },
});

// Action creators are generated for each case reducer function
export const { createUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
