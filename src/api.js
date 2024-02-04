import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:3000"
})

export const getImages = async () => {
  const { data } = await api.get("/list")
  return data
}
