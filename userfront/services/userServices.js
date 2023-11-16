import axios from "axios";

export async function save(user) {
    const fetchUrl = `${process.env.BACKEND_SERVICE}/api/user`;

    try {
        let response = await axios.post(fetchUrl, user);
        return response;
    } catch (error) {
        throw new Error("Could not create user !");
    }
}

export async function update(user) {
    const fetchUrl = `${process.env.BACKEND_SERVICE}/api/user`;

    try {
        let response = await axios.patch(fetchUrl, user);
        return response;
    } catch (error) {
        throw new Error("Could not create user !");
    }
}

export async function findAll() {
    const fetchUrl = `${process.env.BACKEND_SERVICE}/api/users`;

    try {
        let response = await axios.get(fetchUrl);
        return response.data;
        console.log(response.data);
    } catch (error) {
        throw new Error("Could not get all users !");
    }
}