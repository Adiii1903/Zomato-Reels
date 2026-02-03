import React, { Suspense, useCallback, useEffect, useState } from 'react'
import axios from 'axios';
import '../../styles/reels.css'

const ReelFeed = React.lazy(() => import('../../components/ReelFeed'))

const Home = () => {
    const [ videos, setVideos ] = useState([])
    const [ isLoading, setIsLoading ] = useState(true)
    const [ cursor, setCursor ] = useState(null)
    const [ hasMore, setHasMore ] = useState(true)
    const [ likedIds, setLikedIds ] = useState(() => new Set())
    const [ savedIds, setSavedIds ] = useState(() => new Set())
    // Autoplay behavior is handled inside ReelFeed

    const fetchVideos = useCallback(async (options = {}) => {
        if (options.append && (!hasMore || isLoading)) return
        setIsLoading(true)
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/food`, {
                withCredentials: true,
                params: {
                    limit: 6,
                    cursor: options.append ? cursor : null
                }
            })
            const newItems = response.data.foodItems ?? []
            setVideos((prev) => options.append ? [ ...prev, ...newItems ] : newItems)
            setCursor(response.data.nextCursor)
            setHasMore(Boolean(response.data.nextCursor))
        } catch {
            // noop: optionally handle error
        } finally {
            setIsLoading(false)
        }
    }, [ cursor, hasMore, isLoading ])

    useEffect(() => {
        fetchVideos()
    }, [ fetchVideos ])

    // Using local refs within ReelFeed; keeping map here for dependency parity if needed

    const likeVideo = useCallback(async (item) => {
        const wasLiked = likedIds.has(item._id)
        const nextDelta = wasLiked ? -1 : 1

        setLikedIds((prev) => {
            const next = new Set(prev)
            if (wasLiked) {
                next.delete(item._id)
            } else {
                next.add(item._id)
            }
            return next
        })

        setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: Math.max(0, (v.likeCount ?? 0) + nextDelta) } : v))

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/food/like`, { foodId: item._id }, {withCredentials: true})
            const isLiked = Boolean(response.data.like)
            if (isLiked === wasLiked) {
                setLikedIds((prev) => {
                    const next = new Set(prev)
                    if (wasLiked) {
                        next.add(item._id)
                    } else {
                        next.delete(item._id)
                    }
                    return next
                })
                setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: Math.max(0, (v.likeCount ?? 0) - nextDelta) } : v))
            }
        } catch {
            setLikedIds((prev) => {
                const next = new Set(prev)
                if (wasLiked) {
                    next.add(item._id)
                } else {
                    next.delete(item._id)
                }
                return next
            })
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: Math.max(0, (v.likeCount ?? 0) - nextDelta) } : v))
        }
    }, [ likedIds ])

    const saveVideo = useCallback(async (item) => {
        const wasSaved = savedIds.has(item._id)
        const nextDelta = wasSaved ? -1 : 1

        setSavedIds((prev) => {
            const next = new Set(prev)
            if (wasSaved) {
                next.delete(item._id)
            } else {
                next.add(item._id)
            }
            return next
        })

        setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: Math.max(0, (v.savesCount ?? 0) + nextDelta) } : v))

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/food/save`, { foodId: item._id }, { withCredentials: true })
            const isSaved = Boolean(response.data.save)
            if (isSaved === wasSaved) {
                setSavedIds((prev) => {
                    const next = new Set(prev)
                    if (wasSaved) {
                        next.add(item._id)
                    } else {
                        next.delete(item._id)
                    }
                    return next
                })
                setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: Math.max(0, (v.savesCount ?? 0) - nextDelta) } : v))
            }
        } catch {
            setSavedIds((prev) => {
                const next = new Set(prev)
                if (wasSaved) {
                    next.add(item._id)
                } else {
                    next.delete(item._id)
                }
                return next
            })
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: Math.max(0, (v.savesCount ?? 0) - nextDelta) } : v))
        }
    }, [ savedIds ])

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
