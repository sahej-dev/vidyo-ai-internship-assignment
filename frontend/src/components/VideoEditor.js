import p5 from "p5";
import { useEffect, useRef, useState } from "react";

import { calculateVidLocation, calculateVidSize } from "../utils";

export default function VideoEditor({
  videoUrl,
  watermarkState,
  setWatermarkState,
}) {
  const p5ContainerRef = useRef();
  const [watermarkImage, setWatermarkImage] = useState(null);
  // const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  // const [video, setVideo] = useState(null);

  useEffect(() => {
    const p5Instance = new p5((p) => {
      // console.log(video);
      const v = p.createVideo(videoUrl, () => {
        v.hide();
      });
      // if (!deepCompare(v, video)) setVideo(v);

      // if (video)
      sketch(p, videoUrl, {
        // video,
        watermarkState,
        setWatermarkState,
        watermarkImage,
        setWatermarkImage,
        // isVideoPlaying,
        // setIsVideoPlaying,
      });
    }, p5ContainerRef.current);

    return () => {
      p5Instance.remove();
    };
  }, [
    // video,
    videoUrl,
    watermarkState,
    setWatermarkState,
    watermarkImage,
    // isVideoPlaying,
    // setIsVideoPlaying,
  ]);

  return <div className="inline flex-row" ref={p5ContainerRef} />;
}

function sketch(
  p,
  videoUrl,
  {
    // video,
    watermarkState,
    setWatermarkState,
    watermarkImage,
    setWatermarkImage,
    // isVideoPlaying,
    // setIsVideoPlaying,
  }
) {
  let playIcon;
  let pauseIcon;
  let video;
  // let watermarkImage;

  let isVideoPlaying = false;
  let isDragging = false;
  let watermarkPos = {
    x: p.width / 2,
    y: p.height / 2,
  };

  let btn = {
    radius: 30,
    cx: 0,
    cy: 0,
    bottomMargin: 12,
  };
  // let btnRadius;
  // let btnCx;
  // let btnCy;

  const btnColor = p.color(79, 27, 190, 200);
  const btnHoverColor = p.color(79, 27, 190);

  p.preload = function () {
    playIcon = p.loadImage("/icons/play.png");
    pauseIcon = p.loadImage("/icons/pause.png");
  };

  p.setup = function () {
    p.createCanvas(720, 480);

    video = p.createVideo(videoUrl, () => {
      video.play();
      video.pause();
      video.hide();

      initWatermarkImageInput(
        p,
        watermarkImage,
        setWatermarkImage,
        watermarkState,
        setWatermarkState,
        watermarkPos,
        video
      );
    });

    initButton(p, btn);

    p.noStroke();
  };

  p.draw = function () {
    p.background(255);
    p.ellipseMode(p.CENTER);

    drawVideo(p, video);

    if (watermarkImage) {
      watermarkImage.hide();

      p.fill(0, 0, 0, 0);
      p.image(watermarkImage, watermarkPos.x, watermarkPos.y);

      if (
        isHoveringRect(
          p,
          watermarkPos.x,
          watermarkPos.y,
          watermarkImage.width,
          watermarkImage.height
        )
      ) {
        p.strokeWeight(2);
        p.stroke(0, 255, 255);
        p.cursor(p.HAND);

        if (isDragging) {
          watermarkPos = {
            x: p.mouseX - watermarkImage.width / 2,
            y: p.mouseY - watermarkImage.height / 2,
          };
        }
      } else {
        p.cursor(p.DEFAULT);
        p.noStroke();
      }

      p.rect(
        watermarkPos.x,
        watermarkPos.y,
        watermarkImage.width,
        watermarkImage.height
      );
    }

    p.noStroke();
    drawBtn(btn);
  };

  p.mouseClicked = function () {
    // console.log("VID", video);
    handlePlayPauseClicked(btn, video);
  };

  p.mousePressed = function () {
    if (watermarkImage) setIsDraggingIfApplicable(watermarkPos);
  };

  p.mouseReleased = function () {
    if (isDragging) {
      console.log(watermarkPos.x / p.min(video.width, p.width));

      setWatermarkState((prevState) => {
        return {
          ...prevState,
          x: watermarkPos.x / p.min(video.width, p.width),
          y: watermarkPos.y / p.min(video.height, p.height),
        };
      });
    }
    isDragging = false;
  };

  function drawBtn({ cx, cy, radius }) {
    const d = p.dist(p.mouseX, p.mouseY, cx, cy);

    if (d < radius) {
      p.fill(btnHoverColor);
    } else {
      p.fill(btnColor);
    }
    p.ellipse(cx, cy, radius * 2);

    const icon = isVideoPlaying ? pauseIcon : playIcon;

    p.image(icon, cx - radius / 2, cy - radius / 2, radius, radius);
  }

  function handlePlayPauseClicked({ cx, cy, radius }, video) {
    const d = p.dist(p.mouseX, p.mouseY, cx, cy);
    // console.log(cx, cy, radius, d);

    if (d < radius && video) {
      // console.log(isVideoPlaying);
      if (isVideoPlaying) {
        video.pause();
      } else {
        video.play();
      }
      isVideoPlaying = !isVideoPlaying;
      // setIsVideoPlaying((prevState) => {
      //   return !prevState;
      // });
    }
  }

  function setIsDraggingIfApplicable(watermarkPos) {
    if (
      isHoveringRect(
        p,
        watermarkPos.x,
        watermarkPos.y,
        watermarkImage.width,
        watermarkImage.height
      )
    ) {
      console.log("set draggin");
      isDragging = true;
    }
  }
}

function initWatermarkImageInput(
  p,
  watermarkImage,
  setWatermarkImage,
  watermarkState,
  setWatermarkState,
  watermarkPos,
  video
) {
  const parentEle = document.getElementById("watermarkUpload");
  if (!parentEle) return;

  let imageInput = p.createFileInput((file) => {
    const img = p.createImg(file.data, "watermark image");
    setWatermarkImage(img);

    if (img) {
      console.log("scale", img.width / p.min(video.width, p.width));
      setWatermarkState((prevState) => {
        return {
          ...prevState,
          fileData: file.data,
          scale: img.width / p.min(video.width, p.width),
        };
      });
    } else {
      setWatermarkState((prevState) => {
        return {
          ...prevState,
          fileData: file.data,
        };
      });
    }

    // watermarkImage = p.createImg(file.data, "watermark image");
    // watermarkImage.hide();
  });

  if (!watermarkState.fileData) {
    imageInput.elt.onchange = (e) => {
      setWatermarkState((prevState) => {
        return {
          ...prevState,
          file: e.target.files[0],
        };
      });
    };
  } else {
    watermarkImage = p.createImg(watermarkState.fileData, "watermark image");
    console.log("loaded", p.min(video.width, p.width));
    console.log("loaded", watermarkState.x);
    watermarkPos.x = watermarkState.x * p.min(video.width, p.width);
    watermarkPos.y = watermarkState.y * p.min(video.height, p.height);
    watermarkImage.hide();
  }
  imageInput.parent("watermarkUpload");
  imageInput.elt.accept = "image/*";
  imageInput.class(
    "file-input file-input-bordered file-input-sm w-full max-w-sm"
  );
}

function initButton(p, btn) {
  btn.cx = p.width / 2.0;
  btn.cy = p.height - btn.radius - btn.bottomMargin;
}

function drawVideo(p, video) {
  const vidSize = calculateVidSize(p, video);
  const vidPos = calculateVidLocation(p, vidSize);

  p.image(video, vidPos.x, vidPos.y, vidSize.width, vidSize.height);
}

function isHoveringRect(p, x, y, w, h) {
  return x < p.mouseX && p.mouseX < x + w && y < p.mouseY && p.mouseY < y + h;
}
