document.addEventListener("DOMContentLoaded",()=>{
 const form=document.getElementById("contactForm"),status=document.getElementById("formStatus");if(!form||!status)return;
 form.addEventListener("submit",e=>{e.preventDefault();status.textContent="Biểu mẫu hợp lệ ở trình duyệt nhưng chưa gửi tin nhắn. Để nhận tin thật, cần kết nối dịch vụ biểu mẫu hoặc backend.";status.setAttribute("role","status")});
});
