import React, { Suspense, useCallback, useEffect, useState } from 'react'
import '../../styles/reels.css'
import axios from 'axios'

const ReelFeed = React.lazy(() => import('../../components/ReelFeed'))

const Saved = () => {
  const [videos, setVideos] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/food/save`, {
        withCredentials: true
      })
      .then((response) => {
        const savedFoods =
          response.data.savedFoods?.map((item) => ({
            _id: item.food._id,
            video: item.food.video,
            description: item.food.description,
            likeCount: item.food.likeCount,
            savesCount: item.food.savesCount,
            commentsCount: item.food.commentsCount,
            foodPartner: item.food.foodPartner,
            streamUrl: item.food.streamUrl
          })) ?? []

        setVideos(savedFoods)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  /* Remove from saved (optimistic + rollback) */
  const removeSaved = useCallback(async (item) => {
    // optimistic: remove immediately
    setVideos((prev) => prev.filter((v) => v._id !== item._id))

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/food/save`,
        { foodId: item._id },
        { withCredentials: true }
      )
    } catch {
      // rollback if API fails
      setVideos((prev) => [...prev, item])
    }
  }, [])

  return (
    <Suspense fallback={null}>
      <ReelFeed
        items={videos}
        onSave={removeSaved}
        emptyMessage="No saved videos yet."
        isLoading={isLoading}
      />
    </Suspense>
  )
}

export default Saved
