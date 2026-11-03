document.addEventListener("DOMContentLoaded", function () {
    const ocean = document.createElement("div");
    ocean.id = "ocean-cursor-effects";
    document.body.appendChild(ocean);

    // SỨA ĐI THEO CHUỘT
    const cursorJelly = document.createElement("img");
    cursorJelly.src = "assets/images/jellyfish.png";
    cursorJelly.className = "cursor-jellyfish";
    cursorJelly.alt = "";
    ocean.appendChild(cursorJelly);

    let mouseX = innerWidth / 2;
    let mouseY = innerHeight / 2;
    let jellyX = mouseX;
    let jellyY = mouseY;

    document.addEventListener("mousemove", function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function moveJelly() {
        jellyX += (mouseX - jellyX) * 0.09;
        jellyY += (mouseY - jellyY) * 0.09;

        cursorJelly.style.left = jellyX + "px";
        cursorJelly.style.top = jellyY + "px";

        requestAnimationFrame(moveJelly);
    }

    moveJelly();

    // TẠO BONG BÓNG TỪ DƯỚI LÊN
    function createBubble() {
        const bubble = document.createElement("span");
        bubble.className = "ocean-bubble";

        const size = Math.random() * 25 + 8;
        const duration = Math.random() * 8 + 7;

        bubble.style.width = size + "px";
        bubble.style.height = size + "px";
        bubble.style.left = Math.random() * 100 + "%";
        bubble.style.animationDuration = duration + "s";

        ocean.appendChild(bubble);

        setTimeout(() => bubble.remove(), duration * 1000);
    }

    // TẠO ĐÀN SỨA TỪ DƯỚI LÊN
    function createJellyfish() {
        const jelly = document.createElement("div");
        jelly.className = "rising-jelly";

        const img = document.createElement("img");
        img.src = "assets/images/jellyfish.png";
        img.alt = "";

        const size = Math.random() * 200 + 100;
        const duration = Math.random() * 12 + 18;

        jelly.style.width = size + "px";
        jelly.style.left = Math.random() * 95 + "%";
        jelly.style.animationDuration = duration + "s";

        jelly.appendChild(img);
        ocean.appendChild(jelly);

        setTimeout(() => jelly.remove(), duration * 1000);
    }

    // Tạo sẵn một số bong bóng và sứa
    for (let i = 0; i < 20; i++) {
        setTimeout(createBubble, i * 300);
    }

    for (let i = 0; i < 10; i++) {
        setTimeout(createJellyfish, i * 1200);
    }

    // Tiếp tục sinh liên tục
    setInterval(createBubble, 500);
    setInterval(createJellyfish, 2500);
});