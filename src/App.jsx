import { GalleryProvider } from "./GalleryContext"
import { GalleryHome } from "./GalleryHome"
import GalleryPending from "./GalleryPending"
import { BrowserRouter, Routes, Route } from "react-router-dom"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <GalleryHome />
        } />

        <Route path="/gallery" element={
          <GalleryProvider>
            <GalleryPending />
          </GalleryProvider>
        } />
      </Routes >
    </BrowserRouter>
  )
}

export default App