import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { Link } from 'react-router-dom'

const ReelFeed = ({
  items = [],
  onLike,
  onSave,
  emptyMessage = 'No videos yet.',
  isLoading = false,
  onEndReached
}) => {
  const videoRefs = useRef(new Map())
  const feedRef = useRef(null)
  const sentinelRef = useRef(null)

  const [activeId, setActiveId] = useState(null)
  const [loadedIds, setLoadedIds] = useState(() => new Set())
  const [bufferingIds, setBufferingIds] = useState(() => new Set())
  const [errorIds, setErrorIds] = useState(() => new Set())

  const indexById = useMemo(
    () => new Map(items.map((item, index) => [item._id, index])),
    [items]
  )

  /* Initial preload */
  useEffect(() => {
    if (!items.length) return
    if (!activeId || !indexById.has(activeId)) {
      const initialIds = items.slice(0, 3).map((i) => i._id)
      setActiveId(items[0]._id)
      setLoadedIds(new Set(initialIds))
    }
  }, [items, activeId, indexById])

  /* Play / pause based on visibility */
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
            setLoadedIds((prev) => new Set(prev).add(id))
            video.play().catch(() => {})
          } else {
            video.pause()
          }
        })
      },
      {
        root: feedRef.current ?? null,
        threshold: [0, 0.25, 0.6, 0.9, 1]
      }
    )

    videoRefs.current.forEach((vid) => observer.observe(vid))
    return () => observer.disconnect()
  }, [items])

  /* Preload nearby videos */
  useEffect(() => {
    if (!activeId) return
    const index = indexById.get(activeId)
    if (index === undefined) return

    const preloadIds = items
      .slice(Math.max(index - 1, 0), index + 3)
      .map((item) => item._id)

    setLoadedIds((prev) => {
      const next = new Set(prev)
      preloadIds.forEach((id) => next.add(id))
      return next
    })
  }, [activeId, items, indexById])

  /* Infinite scroll */
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

  const setVideoRef = useCallback(
    (id) => (el) => {
      if (!el) {
        videoRefs.current.delete(id)
        return
      }
      videoRefs.current.set(id, el)
    },
    []
  )

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
    video.play().catch(() => {})
  }, [])

  return (
    <div className="reels-page">
      <div className="reels-feed" ref={feedRef} role="list">
        {isLoading && items.length === 0 && (
          <div className="reel-skeleton-list" aria-hidden>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="reel reel-skeleton" />
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
              {!shouldLoad && <div className="reel-placeholder" />}

              <video
                ref={setVideoRef(item._id)}
                className="reel-video"
                data-id={item._id}
                src={shouldLoad ? item.streamUrl || item.video : undefined}
                poster={item.poster}
                muted
                playsInline
                loop
                preload={shouldLoad ? 'metadata' : 'none'}
                onWaiting={() => markBuffering(item._id)}
                onPlaying={() => clearBuffering(item._id)}
                onCanPlay={() => clearBuffering(item._id)}
                onError={() => markError(item._id)}
              />

              <div className="reel-overlay">
                <div className="reel-overlay-gradient" />

                {(isBuffering || hasError) && (
                  <div className="reel-status">
                    {hasError ? (
                      <>
                        <span>Video failed to load.</span>
                        <button
                          className="reel-retry"
                          onClick={() => retryVideo(item._id)}
                        >
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
                      className="reel-action"
                      onClick={onLike ? () => onLike(item) : undefined}
                    >
                      ❤️
                    </button>
                    <div className="reel-action__count">
                      {item.likeCount ?? item.likesCount ?? item.likes ?? 0}
                    </div>
                  </div>

                  <div className="reel-action-group">
                    <button
                      className="reel-action"
                      onClick={onSave ? () => onSave(item) : undefined}
                    >
                      🔖
                    </button>
                    <div className="reel-action__count">
                      {item.savesCount ?? item.bookmarks ?? item.saves ?? 0}
                    </div>
                  </div>

                  <div className="reel-action-group">
                    <button className="reel-action">💬</button>
                    <div className="reel-action__count">
                      {item.commentsCount ??
                        (Array.isArray(item.comments)
                          ? item.comments.length
                          : 0)}
                    </div>
                  </div>
                </div>

                <div className="reel-content">
                  <p className="reel-description">{item.description}</p>
                  {item.foodPartner && (
                    <Link
                      className="reel-btn"
                      to={`/food-partner/${item.foodPartner}`}
                    >
                      Visit store
                    </Link>
                  )}
                </div>
              </div>
            </section>
          )
        })}

        <div ref={sentinelRef} className="reel-sentinel" />

        {isLoading && items.length > 0 && (
          <div className="reel-loading">Loading more reels…</div>
        )}
      </div>
    </div>
  )
}

export default memo(ReelFeed)
