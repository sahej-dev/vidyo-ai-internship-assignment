import Constants from "./constants";

export function downloadFile(relativePath) {
  const fileUrl = Constants.backend_base + relativePath;
  console.log("FILE DOWNLAOD::", fileUrl);

  require("downloadjs")(fileUrl);
}

export async function retryUntilJobComplete(route, cb) {
  const f = () => {
    console.log("calling f");
    fetch(Constants.backend_base + route)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (!data.complete_time) {
          setTimeout(f, 5000);
        } else {
          console.log("f result");
          cb(data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        cb(null, error);
      });
  };

  return f();
}

export function updateVideoFileDuration(file, setDuration) {
  const vid = document.createElement("video");
  vid.src = URL.createObjectURL(file);
  vid.ondurationchange = function () {
    setDuration(vid.duration);
  };
}

export function getDurationString(durationInSeconds) {
  return require("humanize-duration")(durationInSeconds * 1000, {
    round: true,
    language: "shortEn",
    languages: {
      shortEn: {
        y: () => "y",
        mo: () => "mo",
        w: () => "w",
        d: () => "d",
        h: () => "h",
        m: () => "m",
        s: () => "s",
        ms: () => "ms",
      },
    },
  });
}

export function calculateVidSize(p, video) {
  const vidAspectRatio = video.width / video.height;
  const canvasAspectRatio = p.width / p.height;

  let vidWidth, vidHeight;

  if (vidAspectRatio > canvasAspectRatio) {
    vidWidth = p.width;
    vidHeight = p.width / vidAspectRatio;
  } else {
    vidHeight = p.height;
    vidWidth = p.height * vidAspectRatio;
  }

  return {
    width: vidWidth,
    height: vidHeight,
  };
}

export function calculateVidLocation(p, vidSize) {
  let vidX, vidY;

  if (p.width === vidSize.width) {
    const heightDiff = p.height - vidSize.height;
    vidX = 0;
    vidY = heightDiff / 2.0;
  } else {
    const widthDiff = p.width - vidSize.width;
    vidX = widthDiff / 2.0;
    vidY = 0;
  }

  return {
    x: vidX,
    y: vidY,
  };
}
