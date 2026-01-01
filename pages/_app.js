import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-dark-800 border-b border-dark-700 shadow-xl backdrop-blur-sm">
        <div className="container py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent rounded-lg flex items-center justify-center">
              <span className="text-dark-900 font-bold text-xl">L</span>
            </div>
            <div>
              <div className="text-xl font-bold bg-gradient-to-r from-primary-400 to-accent bg-clip-text text-transparent">LocalLeads</div>
              <div className="text-xs text-gray-400">Lead Generation Pro</div>
            </div>
          </div>
          <nav className="flex gap-6 text-sm">
            <a href="/" className="text-gray-300 hover:text-accent transition-colors">Home</a>
            <a href="/find" className="text-gray-300 hover:text-accent transition-colors">🔍 Find Leads</a>
            <a href="/bulk" className="text-gray-300 hover:text-accent transition-colors">Send Bulk</a>
            <a href="/leads" className="text-gray-300 hover:text-accent transition-colors">Leads</a>
            <a href="/analytics" className="text-gray-300 hover:text-accent transition-colors">Analytics</a>
          </nav>
        </div>
      </header>

      <main className="container py-10 flex-1">
        <Component {...pageProps} />
      </main>

      <footer className="border-t border-dark-700 bg-dark-800 mt-12">
        <div className="container py-6 text-sm text-gray-400 text-center">
          © {new Date().getFullYear()} LocalLeads — Built with care by Peter
        </div>
      </footer>
    </div>
  )
}
