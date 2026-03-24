export default function Toast({ msg, show }) {
  return (
    <div className={`fixed bottom-7 left-1/2 -translate-x-1/2 bg-ink text-ivory px-6 py-3 rounded-full text-sm font-medium shadow-xl whitespace-nowrap z-50 pointer-events-none transition-all duration-300 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
      {msg}
    </div>
  )
}
