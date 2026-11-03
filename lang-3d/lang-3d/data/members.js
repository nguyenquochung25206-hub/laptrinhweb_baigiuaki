/* =====================================================================
   DỮ LIỆU 6 THÀNH VIÊN  –  ĐÂY LÀ FILE DUY NHẤT BẠN CẦN SỬA
   ---------------------------------------------------------------------
   name   : tên hiển thị trên bảng tên
   avatar : ảnh đại diện  -> bỏ ảnh vào assets/avatars/ rồi ghi đúng tên file
   url    : web cá nhân    -> bỏ web vào members/thanhvienX/ (hoặc dán link https://...)
   color  : màu nhân vật   (0xRRGGBB)
   animal : con vật  -> duck | bear | cat | rabbit | frog
   trait  : đặc điểm -> glasses | hat | wings | backpack | ears | bow
   text   : dòng mô tả hiện trong thẻ thông tin
   ===================================================================== */
const members=[
 {name:"Nguyễn Thị Mỹ Hương",avatar:"assets/avatars/1.jpg",url:"members/thanhvien1/index.html",color:0xffd93b,animal:"duck",  trait:"glasses", text:"Vịt vàng đeo kính"},
 {name:"Ngô Quỳnh Hương",avatar:"assets/avatars/2.jpg",url:"members/thanhvien2/index.html",color:0xf7f7f7,animal:"bear",  trait:"hat",     text:"Gấu trắng đội mũ"},
 {name:"Trần Thị Thúy Nga",avatar:"assets/avatars/3.jpg",url:"members/thanhvien3/index.html",color:0xff8fc7,animal:"cat",   trait:"wings",   text:"Mèo hồng có cánh nhỏ"},
 {name:"Đỗ NGọc Duy",avatar:"assets/avatars/4.jpg",url:"members/thanhvien4/index.html",color:0x4aa3ff,animal:"bear",  trait:"backpack",text:"Gấu xanh đeo balo"},
 {name:"Nguyễn Quốc Hưng",avatar:"assets/avatars/5.jpg",url:"members/thanhvien5/index.html",color:0xa87bff,animal:"rabbit",trait:"ears",    text:"Thỏ tím tai dài"},
 {name:"Võ Nhật Tường",avatar:"assets/avatars/6.jpg",url:"members/thanhvien6/index.html",color:0x57d65a,animal:"frog",  trait:"bow",     text:"Ếch xanh thắt nơ"},
];

// Thông tin chung của trang web
const SITE={
  title:"gioi thieu 6 thanh vien",
  subtitle:"Bấm vào nhân vật để xem portfolio"
};
