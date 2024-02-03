import { GalleryProvider } from "./GalleryContext"
import GalleryPending from "./GalleryPending"

const App = () => {
  return (
    <GalleryProvider>
      <GalleryPending />
    </GalleryProvider>
  )
}

export default App