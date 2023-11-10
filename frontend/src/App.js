import { useState } from "react";

import VideoPlayer from "./components/VideoPlayer";
import LoadingIndicator from "./components/LoadingIndicator";
import { downloadFile } from "./utils";

function App() {
  const [chosenFile, setChosenFilePath] = useState(null);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [error, setError] = useState(null);

  function onDownloadAudioSubmit(event) {
    event.preventDefault();

    if (!chosenFile) {
      setError("A file must be chosen!");
      return;
    }

    setError(null);

    let data = new FormData();
    data.append("title", chosenFile.name);
    data.append("file", chosenFile);

    setIsProcessingAudio(true);

    fetch("http://127.0.0.1:8000/api/audio-tasks/", {
      method: "POST",
      body: data,
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        downloadFile(data.audio_file.file);
      })
      .catch((error) => {
        console.error("Error:::", error);
      })
      .finally(() => {
        setIsProcessingAudio(false);
      });
  }

  let videoPlayer = <p>Please select a video file!</p>;

  if (chosenFile) {
    const fileUrl = URL.createObjectURL(chosenFile);
    console.log(fileUrl);
    videoPlayer = <VideoPlayer videoUrl={fileUrl} />;
  }

  return (
    <div className="container m-auto grid gap-y-4">
      {error && <p className="text-error">Error: {error}</p>}
      {videoPlayer}
      <form className="grid gap-y-4">
        <div>
          <input
            type="file"
            accept="video/*"
            className="file-input file-input-bordered file-input-primary w-full max-w-sm"
            onChange={(e) => {
              setChosenFilePath(e.target.files[0]);
            }}
          />
        </div>

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
      </form>
    </div>
  );
}

export default App;
