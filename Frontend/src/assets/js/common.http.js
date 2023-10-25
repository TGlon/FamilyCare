export const http_getAll = async (objService) => {
    try {
        const documents = await objService.getAll();
        return documents;
    } catch (error) {
        console.log(error);
    }
}

export const http_getOne = async (objService, id) => {
    try {
        const document = await objService.get(id);
        return document;
    } catch (error) {
        console.log(error);
    }
}

export const http_deleteOne = async (objService, id) => {
    try {
        const document = await objService.delete(id);
        return document;
    } catch (error) {
        console.log(error);
    }
}

export const http_create = async (objService, data) => {
    try {
        const document = await objService.create(data);
        return document;
    } catch (error) {
        console.log(error);
    }
}

export const http_update = async (objService, id, data) => {
    try {
        const document = await objService.update(id, data);
        return document;
    } catch (error) {
        console.log(error);
    }
}

export const http_findById = async (objService, UserId) => {
    try {
        const document = await objService.findFamilyByUserId(UserId);
        return document;
    } catch (error) {
        console.log(error);
    }
}
//USer_Family
export const http_getAllByUserId = async (objService, userId) => {
    try {
        const documents = await objService.getAllByUserId(userId);
        return documents;
    } catch (error) {
        console.log(error);
    }
}
//Tìm 1 gia đình trong user_family dựa vào id user đc chọn
export const http_findUserFamilyByUserId = async (objService, userId) => {
    try {
        const documents = await objService.getOneByUserId(userId);
        return documents;
    } catch (error) {
        console.log(error);
    }
}
export const http_getAllByFamilyId = async (objService, familyId) => {
    try {
        const documents = await objService.findFamilyById(familyId);
        return documents;
    } catch (error) {
        console.log(error);
    }
}
//tìm tất cả userid dựa vào familyid
export const http_getAllUserIdByFamilyId = async (objService, familyId) => {
    try {
        const documents = await objService.getAllByFamilyId(familyId);
        return documents;
    } catch (error) {
        console.log(error);
    }
}
// tìm account dựa vào userid
export const http_findAccountByUserId = async (objService, UserId) => {
    try {
      const document = await objService.findByUserId(UserId);
      return document;
    } catch (error) {
      console.log(error);
    }
  }
// tìm account dựa vào passport và name
export const http_findAccountByPassportAndName = async (objService, name, passport) => {
    try {
        const document = await objService.findOneByPassport(name, passport);
        return document;
    } catch (error) {
        console.log(error);
    }
}

// xóa 1 usr_fam
export const http_deleteOneUsrFam = async (objService, UserId, FamilyId) => {
    try {
        const document = await objService.deleteOneUsrFam(UserId, FamilyId);
        return document;
    } catch (error) {
        console.log(error);
    }
}
//lấy thuốc có cùng id tiền sử bệnh
export const http_getAllByMedicalHistoryId = async (objService, MedicalHistoryId) => {
    try {
        const documents = await objService.getAllByMedicalHistoryId(MedicalHistoryId);
        return documents;
    } catch (error) {
        console.log(error);
    }
}
//Thêm name cho thuốc
export const http_createMedicineWithNameOnly = async (objService, name) => {
    try {
      const documents = await objService.createWithNameOnly(name);
      return documents;
    } catch (error) {
      console.error('Lỗi khi tạo thuốc chỉ với trường "name":', error);
    }
};
export const http_getAllMedicineByUserId = async (objService, userId) => {
    try {
      const documents = await objService.getAllMedicineByUserId(userId);
      return documents;
    } catch (error) {
      console.error('Lỗi khi tạo thuốc chỉ với trường "name":', error);
    }
};
// lấy bệnh tật theo userid
export const http_getAllMedicalByUserId = async (objService, UserId) => {
    try {
        const documents = await objService.findAllByUserId(UserId);
        return documents;
    } catch (error) {
        console.error('Error getting all medical by user ID:', error);
    }
};
