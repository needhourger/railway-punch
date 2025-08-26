import BrandTitle from './components/brand-title'

export default function App(): React.JSX.Element {
  return (
    <div className="h-screen w-screen flex flex-col px-10 py-8">
      <div className="w-full flex justify-center items-center">
        <BrandTitle />
      </div>
    </div>
  )
}
