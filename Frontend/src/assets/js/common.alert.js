import Swal from 'sweetalert2';

export const alert_success = (title, text) => {
    Swal.fire({
      icon: "success",
      title: title,
      text: text,
      background: "#fff",
      didOpen: () => {
        const popup = Swal.getPopup();
        popup.style.border = "2px solid #fff";
        popup.style.zIndex = "99999999";
      },
    });
  };

export const alert_warning = (title, text) => {
    Swal.fire({
        icon: 'warning',
        title: title,
        text: text,
        background: '#fff',
        didOpen: () => {
            const popup = Swal.getPopup();
            popup.style.border = '2px solid #fff';
        },
    })
}

export const alert_error = (title, text) => {
    Swal.fire({
        icon: 'error',
        title: title,
        text: text,
        background: '#fff',
        didOpen: () => {
            const popup = Swal.getPopup();
            popup.style.border = '2px solid #fff';
        },
    })
}

export const alert_info = (title, text) => {
    Swal.fire({
        icon: 'info',
        title: title,
        text: text,
        background: '#fff',
        didOpen: () => {
            const popup = Swal.getPopup();
            popup.style.border = '2px solid #fff';
        },
    })
}

// alert response

export const alert_delete = async (title, text) => {
    let isConfirmed = false;
    await Swal.fire({
        icon: 'question',
        title: title,
        text: text,
        background: '#fff',
        didOpen: () => {
            const popup = Swal.getPopup();
            popup.style.border = '2px solid #fff';
        },
        showCancelButton: true,
        showConfirmButton: true,
        reverseButtons: true,
    }).then((result) => {
        isConfirmed = result.isConfirmed;
    })
    return isConfirmed;
}

export const alert_noti = (title, text) => {
    const formattedText = text.replace(/\n/g, "<br>");
    Swal.fire({
      icon: "info",
      title: title,
      html: `<div style="line-height:30px;text-align:center;">${formattedText}</div>`,
      background: "#fff",
      width: 700,
      didOpen: () => {
        const popup = Swal.getPopup();
        popup.style.border = "2px solid #fff";
      },
    });
  };

  export const alert_medicine = (medicineDetails) => {
    const tableHTML = `
    <table class="table table-bordered">
    <thead>
      <tr>
        <th>Tên Thuốc</th>
        <th>Thời Điểm</th>
        <th>Liều Lượng</th>
        <th>Số Lượng</th>
      </tr>
    </thead>
    <tbody>
      ${medicineDetails
        .map(
          (medicine) => `
            <tr>
              <td>${medicine.name}</td>
              <td>${medicine.frequency}</td>
              <td>${medicine.doses}</td>
              <td>${medicine.note}</td>
            </tr>
          `
        )
        .join('')}
    </tbody>
  </table>
    `;
  
    Swal.fire({
      title: 'Đơn Thuốc',
      html: tableHTML,
      showCloseButton: true,
      showConfirmButton: false,
      background: '#fff',
      width: 500,
      didOpen: () => {
        const popup = Swal.getPopup();
        popup.style.border = '2px solid #fff';
      },
    });
  };
  