import React, { Suspense, useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import '../../styles/reels.css'

const ReelFeed = React.lazy(() => import('../../components/ReelFeed'))

const Home = () => {
  const [videos, setVideos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [cursor, setCursor] = useState(null)
  const [hasMore, setHasMore] = useState(true)

  const [likedIds, setLikedIds] = useState(() => new Set())
  const [savedIds, setSavedIds] = useState(() => new Set())

  /* Fetch videos (cursor-based pagination) */
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
        // optional: toast / error UI
      } finally {
        setIsLoading(false)
      }
    },
    [cursor, hasMore, isLoading]
  )

  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  /* LIKE (toggle + optimistic + rollback) */
  const likeVideo = useCallback(
    async (item) => {
      const wasLiked = likedIds.has(item._id)
      const delta = wasLiked ? -1 : 1

      setLikedIds((prev) => {
        const next = new Set(prev)
        wasLiked ? next.delete(item._id) : next.add(item._id)
        return next
      })

      setVideos((prev) =>
        prev.map((v) =>
          v._id === item._id
            ? { ...v, likeCount: Math.max(0, (v.likeCount ?? 0) + delta) }
            : v
        )
      )

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/food/like`,
          { foodId: item._id },
          { withCredentials: true }
        )

        if (Boolean(response.data.like) === wasLiked) {
          throw new Error('rollback')
        }
      } catch {
        // rollback
        setLikedIds((prev) => {
          const next = new Set(prev)
          wasLiked ? next.add(item._id) : next.delete(item._id)
          return next
        })

        setVideos((prev) =>
          prev.map((v) =>
            v._id === item._id
              ? {
                  ...v,
                  likeCount: Math.max(0, (v.likeCount ?? 0) - delta)
                }
              : v
          )
        )
      }
    },
    [likedIds]
  )
