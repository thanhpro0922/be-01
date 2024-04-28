// Button status
const buttonsStatus = document.querySelectorAll("[button-status]");
// nếu lớn hơn 0 thì mới chạy, ý là có thì mới chạy, ko cs thì khỏi chạy đỡ tốn time
if (buttonsStatus.length > 0) {
    // phải dùng new URL mới dùng được các hàm searchParams các kiểu
    let url = new URL(window.location.href);
    buttonsStatus.forEach((button) => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");

            if (status) {
                //searchParams là phần sau dấu ? trên link
                url.searchParams.set("status", status);
            } else {
                url.searchParams.delete("status");
            }
            window.location.href = url.href;
        });
    });
}

// Form search
const fromSearch = document.querySelector("#form-search"); //get ra thằng id form-search

if (fromSearch) {
    let url = new URL(window.location.href);
    fromSearch.addEventListener("submit", (e) => {
        e.preventDefault(); //chặn sự kiện mặc định của form
        const keyword = e.target.elements.keyword.value;
        if (keyword) {
            //searchParams là phần sau dấu ? trên link
            url.searchParams.set("keyword", keyword);
        } else {
            url.searchParams.delete("keyword");
        }
        window.location.href = url.href;
    });
}

// Pagination
const buttonPagination = document.querySelectorAll("[button-pagination]");
if (buttonPagination) {
    let url = new URL(window.location.href);
    buttonPagination.forEach((button) => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination");
            url.searchParams.set("page", page);
            window.location.href = url.href;
        });
    });
}

// Checkbox Multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
    const inputId = checkboxMulti.querySelectorAll("input[name='id']");
    //đây là logic của check all
    inputCheckAll.addEventListener("click", () => {
        if (inputCheckAll.checked) {
            inputId.forEach((input) => {
                input.checked = true;
            });
        } else {
            inputId.forEach((input) => {
                input.checked = false;
            });
        }
    });
    // đây là logic vd khi click đủ hết thì nó tự click vào checkall, và bỏ ra cx vậy
    inputId.forEach((input) => {
        input.addEventListener("click", () => {
            const countChecked = checkboxMulti.querySelectorAll(
                "input[name='id']:checked"
            ).length;
            if (countChecked.length == inputId.length) {
                inputCheckAll.checked = true;
            } else {
                inputCheckAll.checked = false;
            }
        });
    });
}

// Form Change Multi

const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault(); //nhắc lại là dùng để ngăn hành vi mặc định, dùng cái này để khỏi load lại trang mõi khi submit
        const checkboxMulti = document.querySelector("[checkbox-multi]");
        const inputChecked = checkboxMulti.querySelectorAll(
            "input[name='id']:checked"
        );

        const typeChange = e.target.elements.type.value;

        if (typeChange == "delete-all") {
            const isConfirm = confirm(
                "Bạn có chắc chắn muốn xóa những sản phẩm này?"
            );
            if (!isConfirm) {
                // nếu user ấn hủy thì sẽ return (ko làm gì cả)
                return;
            }
        }
        if (inputChecked.length > 0) {
            let ids = [];
            const inputIds = formChangeMulti.querySelector("input[name='ids']");
            inputChecked.forEach((input) => {
                const id = input.value; // do value là thuộc tính mặc đinh nên . cx đc ko thì dùng getAttribute

                if (typeChange == "change-position") {
                    const position = input
                        .closest("tr")
                        .querySelector("input[name='position']").value;
                    ids.push(`${id}-${position}`);
                } else {
                    ids.push(id);
                }
            });
            inputIds.value = ids.join(", "); // do ô input k ấy được array nên phải chuyển qua string
            formChangeMulti.submit();
        } else {
            alert("Vui lòng chọn ít nhất một bản ghi!");
        }
    });
}

// End Form Change Multi

// Show Alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time"));
    const closeAlert = showAlert.querySelector("[close-alert]");
    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    }, time);

    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden");
    });
}
// End Show Alert

// Upload Image
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
    const uploadImageInput = document.querySelector("[upload-image-input]");
    const uploadImagePreview = document.querySelector("[upload-image-preview]");

    uploadImageInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            uploadImagePreview.src = URL.createObjectURL(file);
            const closePreview = document.querySelector("[upload-image-close]");
            closePreview.classList.add("showClosePreview");
            closePreview.classList.remove("image-preview-hidden");
            closePreview.addEventListener("click", () => {
                uploadImageInput.value = "";
                uploadImagePreview.src = "";
                closePreview.classList.remove("showClosePreview");
                closePreview.classList.add("image-preview-hidden");
            });
        }
    });
}

// sort

const sort = document.querySelector("[sort]");
if (sort) {
    let url = new URL(window.location.href);
    const sortSelect = sort.querySelector("[sort-select]");
    const sortClear = sort.querySelector("[sort-clear]");
    //săp xếp
    sortSelect.addEventListener("change", (e) => {
        const value = e.target.value;
        const [sortKey, sortValue] = value.split("-");
        url.searchParams.set("sortKey", sortKey);
        url.searchParams.set("sortValue", sortValue);

        window.location.href = url.href;
    });

    //clear sắp xếp
    sortClear.addEventListener("click", () => {
        url.searchParams.delete("sortKey");
        url.searchParams.delete("sortValue");

        window.location.href = url.href;
    });
    // thêm selected cho option
    const sortKey = url.searchParams.get("sortKey");
    const sortValue = url.searchParams.get("sortValue");
    if (sortKey && sortValue) {
        const stringSort = `${sortKey}-${sortValue}`;
        const optionSelected = sortSelect.querySelector(
            `option[value="${stringSort}"]`
        );
        optionSelected.selected = true;
    }
}
//end sort
