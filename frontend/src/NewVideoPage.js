import { useState } from "react";

import VideoEditor from "./components/VideoEditor";
import LoadingIndicator from "./components/LoadingIndicator";
import {
  downloadFile,
  getDurationString,
  retryUntilJobComplete,
  updateVideoFileDuration,
} from "./utils";
import Constants from "./constants";

function NewVideoPage() {
  const [chosenFile, setChosenFile] = useState(null);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [isProcessingWatermark, setIsProcessingWatermark] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [video, setVideo] = useState(null);
  const [watermarkState, setWatermarkState] = useState({
    file: null,
    x: 0.5,
    y: 0.5,
    scale: 1,
    fileData: null,
  });
  const [audioJob, setAudioJob] = useState(null);
  const [watermarkJob, setWatermarkJob] = useState(null);
  const [duration, setDuration] = useState(null);

  function onChosenVideoChange(e) {
    console.log(e.target.files[0]);
    setChosenFile(e.target.files[0]);
    setIsProcessingWatermark(false);
    setIsUploading(false);
    setIsProcessingAudio(false);
    setVideo(null);
    setWatermarkState({
      file: null,
      x: 0.5,
      y: 0.5,
      scale: 1,
      fileData: null,
    });
    setWatermarkJob(null);
  }

  function uploadVideo(event) {
    event.preventDefault();

    if (video) return;

    let data = new FormData();
    data.append("title", chosenFile.name);
    data.append("file", chosenFile);

    setIsUploading(true);
    fetch(Constants.backend_base + "/api/videos/", {
      method: "POST",
      body: data,
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setVideo(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setIsUploading(false);
      });
  }

  function onDownloadAudioSubmit(event) {
    event.preventDefault();

    let data = new FormData();
    data.append("video", video.id);
    // data.append("file", chosenFile);

    setIsProcessingAudio(true);

    fetch(Constants.backend_base + "/api/audio-tasks/", {
      method: "POST",
      body: data,
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        retryUntilJobComplete(`/api/audio-tasks/${data.id}`, (data, error) => {
          if (error) {
            console.error(error);
          } else {
            setAudioJob(data);
          }

          setIsProcessingAudio(false);
        });
      })
      .catch((error) => {
        setIsProcessingAudio(false);
        console.error("Error:", error);
      });
  }

  function onWatermarkSubmit(event) {
    event.preventDefault();

    let data = new FormData();

    data.append("video", video.id);
    data.append("image_file", watermarkState.file);
    data.append("x_pos", watermarkState.x);
    data.append("y_pos", watermarkState.y);
    data.append("scale", watermarkState.scale);

    console.log("DATA", data);

    setIsProcessingWatermark(true);

    fetch(Constants.backend_base + "/api/watermark-tasks/", {
      method: "POST",
      body: data,
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        retryUntilJobComplete(
          `/api/watermark-tasks/${data.id}`,
          (data, error) => {
            if (error) {
              console.error(error);
            } else {
              setWatermarkJob(data);
            }

            setIsProcessingWatermark(false);
          }
        );
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsProcessingWatermark(false);
      });
  }

  let videoEditor = <p>Please select a video file!</p>;

  if (chosenFile) {
    const fileUrl = URL.createObjectURL(chosenFile);

    if (!chosenFile.duration) updateVideoFileDuration(chosenFile, setDuration);
    // console.log(fileUrl);
    videoEditor = (
      <VideoEditor
        videoUrl={fileUrl}
        watermarkState={watermarkState}
        setWatermarkState={setWatermarkState}
      />
    );
  }

  return (
    <div className="container m-auto grid gap-y-4">
      {videoEditor}
      {chosenFile && (
        <div className="grid grid-cols-4">
          <h2 className="text-lg col-span-3">{chosenFile.name}</h2>
          <p>{getDurationString(duration)}</p>
        </div>
      )}
      <form className="grid gap-y-4">
        <div className="flex-row">
          <input
            type="file"
            accept="video/*"
            className="file-input file-input-bordered file-input-primary w-full max-w-sm"
            onChange={onChosenVideoChange}
          />
          {chosenFile ? (
            <button
              onClick={uploadVideo}
              className="btn btn-primary max-w-xs ml-4"
            >
              {!video ? (
                <>
                  {isUploading ? (
                    <>
                      Uploading... <LoadingIndicator />
                    </>
                  ) : (
                    <>Upload Video</>
                  )}
                </>
              ) : (
                <>Done Uploading</>
              )}
            </button>
          ) : (
            <></>
          )}
        </div>
        <div id="buttons" className="grid grid-cols-3 items-center gap-4">
          {!audioJob && chosenFile && video ? (
            <button
              onClick={onDownloadAudioSubmit}
              className="btn btn-primary max-w-xs"
            >
              {isProcessingAudio ? (
                <>
                  Processing... <LoadingIndicator />
                </>
              ) : (
                <>Download Audio</>
              )}
            </button>
          ) : (
            <></>
          )}
          {audioJob && (
            <a
              className="btn btn-primary"
              href={audioJob.audio_file.file}
              target="_blank"
              rel="noopener noreferrer"
            >
              Play Extracted Audio
            </a>
          )}
          {chosenFile && video && !watermarkState.fileData ? (
            <div
              id="watermarkUpload"
              className="form-control inline-block max-w-xs"
            >
              <label className="label">
                <span className="label-text">
                  {watermarkState.file
                    ? "Change Watermark"
                    : "Choose Watermark"}
                </span>
              </label>
            </div>
          ) : (
            <></>
          )}
          {!watermarkJob && chosenFile && watermarkState.file && video ? (
            <button
              onClick={onWatermarkSubmit}
              className="btn btn-primary max-w-xs"
            >
              {isProcessingWatermark ? (
                <>
                  Processing... <LoadingIndicator />
                </>
              ) : (
                <>Download Watermarked</>
              )}
            </button>
          ) : (
            <></>
          )}
          {watermarkJob && (
            <a
              className="btn btn-primary"
              href={watermarkJob.watermarked_video.file}
              target="_blank"
              rel="noopener noreferrer"
            >
              View watermarked video
            </a>
          )}
        </div>
      </form>
    </div>
  );
}

export default NewVideoPage;
