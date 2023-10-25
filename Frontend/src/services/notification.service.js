import createApiClient from "./api.service";

class NotificationService {
    constructor(baseUrl = "/api/notifications") {
        this.api = createApiClient(baseUrl);
    }
    async getAll() {
        return (await this.api.get("/")).data;
    }
    async create(data) {
        return (await this.api.post("/", data)).data;
    }
    async deleteAll(id) {
        return (await this.api.delete(`/delete-notification-by-id/${id}`)).data;
    }
    async get(id) {
        return (await this.api.get(`/${id}`)).data;
    }
    async update(id) {
        return (await this.api.put(`/${id}`)).data;
    }
    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }
}

export default new NotificationService();