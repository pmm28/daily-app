export const MOOD_EM = { happy: '😊', neutral: '😐', sad: '😢', tired: '😴', angry: '😡' }
export const MOOD_LBL = { happy: 'Happy', neutral: 'Okay', sad: 'Sad', tired: 'Tired', angry: 'Angry' }
export const CAT_LBL = { study: 'Study', exercise: 'Exercise', relax: 'Relax' }
export const TP_EM = { morning: '🌅', noon: '☀️', afternoon: '🌤', night: '🌙', late: '🌌' }
export const TP_LBL = { morning: 'Morning', noon: 'Noon', afternoon: 'Afternoon', night: 'Night', late: 'Late night' }
export const TP_ORDER = { morning: 1, noon: 2, afternoon: 3, night: 4, late: 5 }
export const DAYS_L = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
export const DAYS_S = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
export const MONTHS_L = ['January','February','March','April','May','June','July','August','September','October','November','December']
export const MONTHS_S = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export const pad = (n) => String(n).padStart(2, '0')
export const todayKey = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}` }
export const dateToKey = (d) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
export const keyToDate = (k) => { const [y,m,d] = k.split('-'); return new Date(+y,+m-1,+d) }
export const isFutureDate = (key) => { const t = keyToDate(key); const n = new Date(); t.setHours(0,0,0,0); n.setHours(0,0,0,0); return t > n }
