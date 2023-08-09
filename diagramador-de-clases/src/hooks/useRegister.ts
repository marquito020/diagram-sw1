import useSWRMutation from "swr/mutation";

import { authUrl, register } from "../services/user.service";
import { UserInfo } from "../interfaces/user.interface";
import { User } from "../interfaces/user.interface";

const useRegister = () => {
    const { trigger, error, isMutating } = useSWRMutation<
        UserInfo,
        string,
        string,
        User
    >(authUrl, register);

    return { registerUser: trigger, error, isMutating };
};

export { useRegister };