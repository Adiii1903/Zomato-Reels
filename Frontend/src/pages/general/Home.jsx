import React, { Suspense, useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import '../../styles/reels.css'

const ReelFeed = React.lazy(() => import('../../components/ReelFeed'))

const Home = () => {
  const [videos, setVideos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [cursor, setCursor] = useState(null)
  const [hasMore, setHasMore] = useState(true)

  const fetchVideos = useCallback(
    async (options = {}) => {
      if (options.append && (!hasMore || isLoading)) return

      setIsLoading(true)
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/food`,
          {
            withCredentials: true,
            params: {
              limit: 6,
              cursor: options.append ? cursor : null
            }
          }
        )

        const newItems = response.data.foodItems ?? []

        setVideos((prev) =>
          options.append ? [...prev, ...newItems] : newItems
        )
        setCursor(response.data.nextCursor)
        setHasMore(Boolean(response.data.nextCursor))
      } catch {
        // optional: show toast / error UI
      } finally {
        setIsLoading(false)
      }
    },
    [cursor, hasMore, isLoading]
  )

  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  /* LIKE (optimistic + rollback) */
  const likeVideo = useCallback(async (item) => {
    // optimistic update
    setVideos((prev) =>
      prev.map((v) =>
        v._id === item._id
          ? { ...v, likeCount: (v.likeCount ?? 0) + 1 }
          : v
      )
    )

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/food/like`,
        { foodId: item._id },
        { withCredentials: true }
      )

      // server says "unliked" → rollback
      if (!response.data.like) {
        setVideos((prev) =>
          prev.map((v) =>
            v._id === item._id
              ? {
                  ...v,
                  likeCount: Math.max(0, (v.likeCount ?? 1) - 1)
                }
              : v
          )
        )
      }
    } catch {
      // rollback on error
      setVideos((prev) =>
        prev.map((v) =>
          v._id === item._id
            ? {
                ...v,
                likeCount: Math.max(0, (v.likeCount ?? 1) - 1)
              }
            : v
        )
      )
    }
  }, [])

  /* SAVE (optimistic + rollback) */
  const saveVideo = useCallback(async (item) => {
    // optimistic update
    setVideos((prev) =>
      prev.map((v) =>
        v._id === item._id
          ? { ...v, savesCount: (v.savesCount ?? 0) + 1 }
          : v
      )
    )

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/food/save`,
        { foodId: item._id },
        { withCredentials: true }
      )

      // server says "unsaved" → rollback
      if (!response.data.save) {
        setVideos((prev) =>
          prev.map((v) =>
            v._id === item._id
              ? {
                  ...v,
                  savesCount: Math.max(0, (v.savesCount ?? 1) - 1)
                }
              : v
          )
        )
      }
    } catch {
      // rollback on error
      setVideos((prev) =>
        prev.map((v) =>
          v._id === item._id
            ? {
                ...v,
                savesCount: Math.max(0, (v.savesCount ?? 1) - 1)
              }
            : v
        )
      )
    }
  }, [])

  return (
    <Suspense fallback={null}>
      <ReelFeed
        items={videos}
        onLike={likeVideo}
        onSave={saveVideo}
        emptyMessage="No videos available."
        isLoading={isLoading}
        onEndReached={() => fetchVideos({ append: true })}
      />
    </Suspense>
  )
}

export default Home
