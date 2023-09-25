export const formatDate = (value) => {
    const date = new Date(value);
    let day = date.getDate(), month = date.getMonth() + 1, year = date.getFullYear();
    if (month < 10) month = `0${month}`;
    if (day < 10) day = `0${day}`;
    return `${day}-${month}-${year}`;
}

// export const formatDateReverse = (value) => {
//     const date = new Date(value);
//     let day = date.getDate(), month = date.getMonth() + 1, year = date.getFullYear();
//     if (month < 10) month = `0${month}`;
//     if (day < 10) day = `0${day}`;
//     return `${year}-${month}-${day}`;
// }

export const formatDateTime = (value) => {
    const date = new Date(value);
    let day = date.getDate(), month = date.getMonth() + 1, year = date.getFullYear(), hours = date.getHours(), minutes = date.getMinutes();
    if (month < 10) month = `0${month}`;
    if (day < 10) day = `0${day}`;
    if (hours < 10) hours = `0${hours}`;
    if (minutes < 10) minutes = `0${minutes}`;
    return `${hours} giờ ${minutes} phút, ngày ${day}-${month}-${year}`;
}

// export const formatDateTimeReverse = (value) => {
//     const date = new Date(value);
//     let day = date.getDate(), month = date.getMonth() + 1, year = date.getFullYear(), hours = date.getHours(), minutes = date.getMinutes();
//     if (month < 10) month = `0${month}`;
//     if (day < 10) day = `0${day}`;
//     if (hours < 10) hours = `0${hours}`;
//     if (minutes < 10) minutes = `0${minutes}`;
//     return `${hours} giờ ${minutes} phút, ngày ${day}-${month}-${year}`;
// }
export const formatCreatedAt = (value) => {
    const createdAtDate = new Date(value);
    const year = createdAtDate.getFullYear();
    const month = String(createdAtDate.getMonth() + 1).padStart(2, "0");
    const day = String(createdAtDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };
  