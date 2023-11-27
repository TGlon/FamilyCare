import createApiClient from "./api.service";

class MedicineService {
    constructor(baseUrl = "/api/medicines") {
        this.api = createApiClient(baseUrl);
    }
    async getAll() {
        return (await this.api.get("/")).data;
    }
    async create(data) {
        return (await this.api.post("/", data)).data;
    }
    async deleteAll() {
        return (await this.api.delete("/")).data;
    }
    async get(id) {
        return (await this.api.get(`/${id}`)).data;
    }
    async update(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }
    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }
    // Thêm phương thức để lấy tất cả thuốc theo MedicalHistoryId
    async getAllByMedicalHistoryId(MedicalHistoryId) {
        return (await this.api.get(`/medical-history/${MedicalHistoryId}`)).data;
    }
    async createWithNameOnly(name) {
        return (await this.api.post("/create", { name })).data;
    }
     // Thêm phương thức để lấy tất cả thuốc theo UserId
     async getAllMedicineByUserId(userId) {
        return (await this.api.get(`/user/${userId}/medicines`)).data;
    }
}

export default new MedicineService();