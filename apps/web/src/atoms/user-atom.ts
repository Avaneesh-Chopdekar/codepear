import { atomWithStorage } from "jotai/utils";

export const userAtom = atomWithStorage("user", {
  token: "",
  user: {
    id: "",
    name: "",
    email: "",
    role: "",
  },
});
