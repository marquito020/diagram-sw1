import { baseUrl } from "../constants/routes";
import { User } from "../interfaces/user.interface";

export const authUrl = baseUrl + "/api/usuario";

const register = async (url: string, { arg }: { arg: User }) => {
    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(arg),
        headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    console.log(data);
    return data;
}

export { register }