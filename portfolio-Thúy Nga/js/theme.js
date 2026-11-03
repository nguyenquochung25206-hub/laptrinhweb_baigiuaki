document.addEventListener("DOMContentLoaded",()=>{
 const btn=document.getElementById("themeToggle"),icon=document.getElementById("themeIcon");
 if(localStorage.getItem("nga-theme")==="light")document.body.classList.add("light-theme");
 const update=()=>{if(icon)icon.textContent=document.body.classList.contains("light-theme")?"☀":"☾"};update();
 if(btn)btn.addEventListener("click",()=>{document.body.classList.toggle("light-theme");localStorage.setItem("nga-theme",document.body.classList.contains("light-theme")?"light":"dark");update()});
});
