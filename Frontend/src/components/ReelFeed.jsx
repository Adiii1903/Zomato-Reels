import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

// Reusable feed for vertical reels
// Props:
// - items: Array of video items { _id, video, description, likeCount, savesCount, commentsCount, comments, foodPartner }
// - onLike: (item) => void | Promise<void>
// - onSave: (item) => void | Promise<void>
// - emptyMessage: string
// - isLoading: boolean
// - onEndReached: () => void
const ReelFeed = ({ items = [], onLike, onSave, emptyMessage = 'No videos yet.', isLoading = false, onEndReached }) => {
  const videoRefs = useRef(new Map())
  const feedRef = useRef(null)
  const sentinelRef = useRef(null)
  const [activeId, setActiveId] = useState(null)
  const [loadedIds, setLoadedIds] = useState(() => new Set())
  const [bufferingIds, setBufferingIds] = useState(() => new Set())
  const [errorIds, setErrorIds] = useState(() => new Set())

  const indexById = useMemo(() => new Map(items.map((item, index) => [item._id, index])), [items])

  useEffect(() => {
    if (items.length === 0) return
    if (!activeId || !indexById.has(activeId)) {
      setActiveId(items[0]._id)
      setLoadedIds(new Set([items[0]._id, items[1]?._id].filter(Boolean)))
    }
  }, [items, activeId, indexById])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target
          if (!(video instanceof HTMLVideoElement)) return
          const id = video.dataset.id
          if (!id) return
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            setActiveId(id)
            setLoadedIds((prev) => {
              const next = new Set(prev)
              next.add(id)
              return next
            })
            video.play().catch(() => { /* ignore autoplay errors */ })
          } else {
            video.pause()
          }
        })
      },
      { root: feedRef.current, threshold: [0, 0.25, 0.6, 0.9, 1] }
    )

    videoRefs.current.forEach((vid) => observer.observe(vid))
    return () => observer.disconnect()
  }, [items])

  useEffect(() => {
    if (!activeId) return
    const index = indexById.get(activeId)
    if (index === undefined) return
    const nextIds = items.slice(index, index + 3).map((item) => item._id)
    setLoadedIds((prev) => {
      const next = new Set(prev)
      nextIds.forEach((id) => next.add(id))
      return next
    })
  }, [activeId, items, indexById])

  useEffect(() => {
    if (!onEndReached || !sentinelRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoading) {
            onEndReached()
          }
        })
      },
      { root: feedRef.current, rootMargin: '120px' }
    )
    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [onEndReached, isLoading])

  const setVideoRef = useCallback((id) => (el) => {
    if (!el) { videoRefs.current.delete(id); return }
    videoRefs.current.set(id, el)
  }, [])

  const markBuffering = useCallback((id) => {
    setBufferingIds((prev) => new Set(prev).add(id))
  }, [])

  const clearBuffering = useCallback((id) => {
    setBufferingIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }, [])

  const markError = useCallback((id) => {
    setErrorIds((prev) => new Set(prev).add(id))
  }, [])

  const retryVideo = useCallback((id) => {
    const video = videoRefs.current.get(id)
    if (!video) return
    setErrorIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
    setLoadedIds((prev) => new Set(prev).add(id))
    video.load()
    video.play().catch(() => { /* ignore autoplay errors */ })
  }, [])

  return (
    <div className="reels-page">
      <div className="reels-feed" role="list" ref={feedRef}>
        {isLoading && items.length === 0 && (
          <div className="reel-skeleton-list" aria-hidden="true">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="reel reel-skeleton" />
            ))}
          </div>
        )}

        {!isLoading && items.length === 0 && (
          <div className="empty-state">
            <p>{emptyMessage}</p>
          </div>
        )}

        {items.map((item) => {
          const shouldLoad = loadedIds.has(item._id)
          const isBuffering = bufferingIds.has(item._id)
          const hasError = errorIds.has(item._id)
          return (
          <section key={item._id} className="reel" role="listitem">
            <video
              ref={setVideoRef(item._id)}
              className="reel-video"
              data-id={item._id}
              src={shouldLoad ? (item.streamUrl || item.video) : undefined}
              poster={item.poster}
              muted
              playsInline
              loop
              preload={shouldLoad ? "metadata" : "none"}
              onWaiting={() => markBuffering(item._id)}
              onPlaying={() => clearBuffering(item._id)}
              onError={() => markError(item._id)}
            />

            <div className="reel-overlay">
              <div className="reel-overlay-gradient" aria-hidden="true" />
              {(isBuffering || hasError) && (
                <div className="reel-status">
                  {hasError ? (
                    <>
                      <span>Video failed to load.</span>
                      <button type="button" className="reel-retry" onClick={() => retryVideo(item._id)}>
                        Retry
                      </button>
                    </>
                  ) : (
                    <span>Buffering...</span>
                  )}
                </div>
              )}
              <div className="reel-actions">
                <div className="reel-action-group">
                  <button
                    onClick={onLike ? () => onLike(item) : undefined}
                    className="reel-action"
                    aria-label="Like"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
                    </svg>
                  </button>
                  <div className="reel-action__count">{item.likeCount ?? item.likesCount ?? item.likes ?? 0}</div>
                </div>

                <div className="reel-action-group">
                  <button
                    className="reel-action"
                    onClick={onSave ? () => onSave(item) : undefined}
                    aria-label="Bookmark"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
                    </svg>
                  </button>
                  <div className="reel-action__count">{item.savesCount ?? item.bookmarks ?? item.saves ?? 0}</div>
                </div>

                <div className="reel-action-group">
                  <button className="reel-action" aria-label="Comments">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                    </svg>
                  </button>
                  <div className="reel-action__count">{item.commentsCount ?? (Array.isArray(item.comments) ? item.comments.length : 0)}</div>
                </div>
              </div>

              <div className="reel-content">
                <p className="reel-description" title={item.description}>{item.description}</p>
                {item.foodPartner && (
                  <Link className="reel-btn" to={"/food-partner/" + item.foodPartner} aria-label="Visit store">Visit store</Link>
                )}
              </div>
            </div>
          </section>
        )})}
        <div ref={sentinelRef} className="reel-sentinel" />
        {isLoading && items.length > 0 && (
          <div className="reel-loading">Loading more reels…</div>
        )}
      </div>
    </div>
  )
}

export default memo(ReelFeed)
