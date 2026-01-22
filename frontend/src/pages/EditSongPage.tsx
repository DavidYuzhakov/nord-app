import { useParams } from "react-router-dom"

export default function EditSongPage() {
  const { id } = useParams()

  return (
    <div>EditSongPage { id}</div>
  )
}
