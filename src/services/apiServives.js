import api from "./api";

const apiServices ={
    getManifestActive: async () => {
        const response = await api.get('/manifest/active');

        return response.data;
    },

    getManifestById: async (id) => {
        const response = await api.get(`/manifest/${id}`);

        return response.data;
    },

    createManifest: async (manifest) => {
        const response = await api.post('/manifest/create' , manifest);

        return response.data;
    }
}


export default apiServices;