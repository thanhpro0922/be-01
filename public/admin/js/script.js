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
            }
            else {
                url.searchParams.delete("status");
            }
            window.location.href = url.href;
        });
    });
}
