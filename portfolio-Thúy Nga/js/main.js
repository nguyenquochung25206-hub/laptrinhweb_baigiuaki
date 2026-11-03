document.addEventListener("DOMContentLoaded",()=>{
 const toggle=document.getElementById("menuToggle"),menu=document.getElementById("navMenu");
 if(toggle&&menu){toggle.addEventListener("click",()=>{const open=menu.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open));toggle.setAttribute("aria-label",open?"Đóng menu":"Mở menu")});menu.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{menu.classList.remove("open");toggle.setAttribute("aria-expanded","false")}))}
 const year=document.getElementById("currentYear");if(year)year.textContent=new Date().getFullYear();
 const topBtn=document.getElementById("backToTop");const scroll=()=>{if(topBtn)topBtn.classList.toggle("visible",window.scrollY>420)};window.addEventListener("scroll",scroll,{passive:true});scroll();if(topBtn)topBtn.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
 const reveal=document.querySelectorAll(".reveal");if("IntersectionObserver"in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("show");observer.unobserve(e.target)}}),{threshold:.12});reveal.forEach(el=>observer.observe(el))}else reveal.forEach(el=>el.classList.add("show"));
 const typing=document.getElementById("typingText");if(typing){const words=["IT Student","Web Learner","Future Developer"];let wi=0,ci=words[0].length,del=true;function tick(){if(del){ci--;if(ci<=0){del=false;wi=(wi+1)%words.length}}else{ci++;if(ci>=words[wi].length){ci=words[wi].length;typing.textContent=words[wi];del=true;setTimeout(tick,1100);return}}typing.textContent=words[wi].slice(0,Math.max(0,ci));setTimeout(tick,del?55:85)}setTimeout(tick,1300)}
});

document.addEventListener("DOMContentLoaded",()=>{
 document.querySelectorAll(".skill-fill").forEach(el=>{const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){el.style.width=(el.dataset.level||0)+"%";observer.unobserve(el)}}));observer.observe(el)});
});

/* ===== SỨA BÁM THEO CHUỘT ===== */

(function () {
    const jelly = document.getElementById("cursor-jellyfish");

    if (!jelly) {
        console.log("Không tìm thấy sứa!");
        return;
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let jellyX = mouseX;
    let jellyY = mouseY;

    let hasMoved = false;

    document.addEventListener("mousemove", function (event) {
        mouseX = event.clientX;
        mouseY = event.clientY;

        if (!hasMoved) {
            jellyX = mouseX;
            jellyY = mouseY;
            hasMoved = true;
        }

        jelly.style.opacity = "1";
    });

    document.addEventListener("mouseleave", function () {
        jelly.style.opacity = "0";
    });

    document.addEventListener("mouseenter", function () {
        if (hasMoved) {
            jelly.style.opacity = "1";
        }
    });

    function followMouse() {
        jellyX += (mouseX - jellyX) * 0.12;
        jellyY += (mouseY - jellyY) * 0.12;

        jelly.style.left = jellyX + "px";
        jelly.style.top = jellyY + "px";

        requestAnimationFrame(followMouse);
    }

    followMouse();
})();

document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("oceanBubbles");

    if (!container) {
        console.log("Không tìm thấy oceanBubbles!");
        return;
    }

    function createBubble() {
        const bubble = document.createElement("span");

        const size = Math.random() * 35 + 15;
        const duration = Math.random() * 6 + 6;

        bubble.className = "bubble";
        bubble.style.width = size + "px";
        bubble.style.height = size + "px";
        bubble.style.left = Math.random() * 100 + "%";
        bubble.style.animationDuration = duration + "s";

        container.appendChild(bubble);

        setTimeout(function () {
            bubble.remove();
        }, duration * 1000);
    }

    for (let i = 0; i < 15; i++) {
        setTimeout(createBubble, i * 300);
    }

    setInterval(createBubble, 400);
});

// TẠO ĐÀN SỨA ĐẠI DƯƠNG
document.addEventListener("DOMContentLoaded", function () {
    const school = document.getElementById("jellyfish-school");

    if (!school) return;

    function createJellyfish() {
        const jelly = document.createElement("div");
        const img = document.createElement("img");

        jelly.className = "school-jelly";

        // Dùng chính ảnh sứa của bạn
        img.src = "assets/images/jellyfish.png";
        img.alt = "";

        // Kích thước ngẫu nhiên
        const size = Math.random() * 200 + 100;

        // Thời gian nổi lên
        const duration = Math.random() * 10 + 15;

        // Độ trong suốt
        const opacity = Math.random() * 0.3 + 0.5;

        jelly.style.setProperty("--size", size + "px");
        jelly.style.setProperty("--duration", duration + "s");
        jelly.style.setProperty("--opacity", opacity);

        // Vị trí xuất hiện
        jelly.style.left = Math.random() * 95 + "%";

        jelly.appendChild(img);
        school.appendChild(jelly);

        // Xóa sứa sau khi nổi khỏi màn hình
        setTimeout(function () {
            jelly.remove();
        }, duration * 1000);
    }

    // Tạo sứa ban đầu
    for (let i = 0; i < 12; i++) {
        setTimeout(createJellyfish, i * 900);
    }

    // Liên tục sinh sứa mới
    setInterval(createJellyfish, 1800);
});