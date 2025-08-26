function App(): React.JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <div className="bg-[url('/assets/wavy-lines.svg')]">
      <div className="text-2xl font-bold text-green-400">test tailwindcss</div>
      <button onClick={ipcHandle}>Ping</button>
    </div>
  )
}

export default App
