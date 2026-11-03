/* AUDIO: nhạc nền tạo bằng WebAudio, nút bật/tắt, âm lượng */
// ---------- Âm thanh (nhạc nền tạo bằng WebAudio) ----------
let ac,master,timer=null,step=0;const pent=[261.63,293.66,329.63,392,440,523.25,587.33],mel=[0,2,4,2,5,4,2,0,2,4,5,4,2,1,0,-1];
function note(f,d,v,t){const o=ac.createOscillator(),g=ac.createGain(),n=ac.currentTime;o.type=t;o.frequency.value=f;g.gain.setValueAtTime(0,n);g.gain.linearRampToValueAtTime(v,n+.02);g.gain.exponentialRampToValueAtTime(.001,n+d);o.connect(g);g.connect(master);o.start();o.stop(n+d)}
function tick(){const m=mel[step%16];if(m>=0)note(pent[m],.5,.5,'triangle');if(step%4===0)note([130.8,98,110,98][(step>>2)%4],1,.45,'sine');step++}
function music(on){if(on){if(!ac){ac=new (window.AudioContext||window.webkitAudioContext)();master=ac.createGain();master.connect(ac.destination)}ac.resume();master.gain.value=$('vol').value;clearInterval(timer);timer=setInterval(tick,320);$('snd').textContent='🔊'}else{clearInterval(timer);timer=null;$('snd').textContent='🔇'}}
$('snd').onclick=()=>music(!timer);$('vol').oninput=e=>{if(master)master.gain.value=e.target.value};

