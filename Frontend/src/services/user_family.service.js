import createApiClient from "./api.service";

class UsrFamService {
    constructor(baseUrl = "/api/userfamilies") {
        this.api = createApiClient(baseUrl);
    }
    async getAll() {
        return (await this.api.get("/")).data;
    }
    async create(data) {
        return (await this.api.post("/", data)).data;
    }
    async get(id) {
        return (await this.api.get(`/${id}`)).data;
    }
    async update(id, data) {
        return (await this.api.post(`/${id}`, data)).data;
    }
    async getAllByUserId(userId) {
        return (await this.api.get(`/user/${userId}`)).data;
    }
    async getAllByFamilyId(familyId) {
        return (await this.api.get(`/family/${familyId}`)).data
    }
}

export default new UsrFamService();