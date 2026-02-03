import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import '../../styles/create-food.css';
import { useNavigate } from 'react-router-dom';

const CreateFood = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState('');
  const [fileError, setFileError] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  /* Preview selected video */
  useEffect(() => {
    if (!videoFile) {
      setVideoURL('');
      return;
    }
    const url = URL.createObjectURL(videoFile);
    setVideoURL(url);
    return () => URL.revokeObjectURL(url);
  }, [videoFile]);

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setVideoFile(null);
      setFileError('');
      return;
    }
    if (!file.type.startsWith('video/')) {
      setFileError('Please select a valid video file.');
      return;
    }
    setFileError('');
    setVideoFile(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setFileError('Please drop a valid video file.');
      return;
    }
    setFileError('');
    setVideoFile(file);
  };

  const onDragOver = (e) => e.preventDefault();
  const openFileDialog = () => fileInputRef.current?.click();

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!videoFile) {
      setFormError('Please select a video before saving.');
      return;
    }

    if (!name.trim()) {
      setFormError('Please add a name for the food item.');
      return;
    }

    if (!import.meta.env.VITE_API_URL) {
      setFormError('Server configuration is missing. Please try again later.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('mama', videoFile);

    try {
      setIsSubmitting(true);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/food`,
        formData,
        { withCredentials: true }
      );

      navigate('/home');
    } catch (error) {
      console.error('Failed to save food', error);
      if (error.response?.status === 401) {
        setFormError('Please sign in as a food partner to upload.');
        setTimeout(() => navigate('/food-partner/login'), 800);
      } else {
        setFormError('Unable to save food right now. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = useMemo(
    () => !name.trim() || !videoFile || fileError || isSubmitting,
    [name, videoFile, fileError, isSubmitting]
  );

  return (
    <div className="create-food-page">
      <div className="create-food-card">
        <header className="create-food-header">
          <h1 className="create-food-title">Create Food</h1>
          <p className="create-food-subtitle">
            Upload a short video, give it a name, and add a description.
          </p>
        </header>

        <form className="create-food-form" onSubmit={onSubmit} encType="multipart/form-data">
          <div className="field-group">
            <label htmlFor="foodVideo">Food Video</label>
            <input
              id="foodVideo"
              ref={fileInputRef}
              className="file-input-hidden"
              type="file"
              accept="video/*"
              onChange={onFileChange}
            />

            <div
              className="file-dropzone"
              role="button"
              tabIndex={0}
              onClick={openFileDialog}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openFileDialog();
                }
              }}
              onDrop={onDrop}
              onDragOver={onDragOver}
            >
              <div className="file-dropzone-inner">
                <strong>Tap to upload</strong> or drag and drop
                <div className="file-hint">MP4, WebM, MOV • Up to ~100MB</div>
              </div>
            </div>

            {fileError && <p className="error-text">{fileError}</p>}

            {videoFile && (
              <div className="file-chip">
                <span className="file-chip-name">{videoFile.name}</span>
                <span className="file-chip-size">
                  {(videoFile.size / 1024 / 1024).toFixed(1)} MB
                </span>
                <div className="file-chip-actions">
                  <button type="button" className="btn-ghost" onClick={openFileDialog}>
                    Change
                  </button>
                  <button
                    type="button"
                    className="btn-ghost danger"
                    onClick={() => {
                      setVideoFile(null);
                      setFileError('');
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          {videoURL && (
            <div className="video-preview">
              <video
                className="video-preview-el"
                src={videoURL}
                controls
                playsInline
                preload="metadata"
              />
            </div>
          )}

          <div className="field-group">
            <label htmlFor="foodName">Name</label>
            <input
              id="foodName"
              type="text"
              placeholder="e.g., Spicy Paneer Wrap"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="foodDesc">Description</label>
            <textarea
              id="foodDesc"
              rows={4}
              placeholder="Write a short description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button className="btn-primary" type="submit" disabled={isDisabled}>
              {isSubmitting ? 'Saving…' : 'Save Food'}
            </button>
          </div>

          {formError && <p className="error-text">{formError}</p>}
        </form>
      </div>
    </div>
  );
};

export default CreateFood;
