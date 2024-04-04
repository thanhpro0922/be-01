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
