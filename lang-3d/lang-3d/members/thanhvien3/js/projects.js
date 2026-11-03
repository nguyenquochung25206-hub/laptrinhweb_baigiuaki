document.addEventListener("DOMContentLoaded",()=>{
 const cards=[...document.querySelectorAll("[data-project-card]")],buttons=[...document.querySelectorAll("[data-filter]")],search=document.getElementById("projectSearch"),empty=document.getElementById("emptyState");let filter="all";
 function update(){const term=(search?.value||"").trim().toLowerCase();let count=0;cards.forEach(card=>{const ok=(filter==="all"||card.dataset.category===filter)&&(card.dataset.search||card.textContent).toLowerCase().includes(term);card.hidden=!ok;if(ok)count++});if(empty)empty.style.display=count?"none":"block"}
 buttons.forEach(b=>b.addEventListener("click",()=>{filter=b.dataset.filter;buttons.forEach(x=>x.classList.toggle("active",x===b));update()}));if(search)search.addEventListener("input",update);update();
});
