import p5 from "p5";
import { useEffect, useRef } from "react";

export default function VideoPlayer({ videoUrl }) {
  const p5ContainerRef = useRef();

  useEffect(() => {
    const p5Instance = new p5((p) => {
      sketch(p, videoUrl);
    }, p5ContainerRef.current);

    return () => {
      p5Instance.remove();
    };
  }, [videoUrl]);

  return <div className="inline flex-row" ref={p5ContainerRef} />;
}

function sketch(p, videoUrl) {
  let playIcon;
  let pauseIcon;
  let video;
  let isVideoPlaying = false;

  const btnBottomMargin = 12;

  let btnRadius;
  let btnCx;
  let btnCy;

  const btnColor = p.color(79, 27, 190, 200);
  const btnHoverColor = p.color(79, 27, 190);

  p.preload = function () {
    playIcon = p.loadImage("/icons/play.png");
    pauseIcon = p.loadImage("/icons/pause.png");
  };

  p.setup = function () {
    p.createCanvas(720, 480);

    btnRadius = 30;
    btnCx = p.width / 2.0;
    btnCy = p.height - btnRadius - btnBottomMargin;

    video = p.createVideo(videoUrl, () => {
      video.hide();
    });

    p.noStroke();
  };

  p.draw = function () {
    p.background(0);
    p.ellipseMode(p.CENTER);

    const vidSize = calculateVidSize(video, p);
    const vidPos = calculateVidLocation(vidSize, p);

    p.image(video, vidPos.x, vidPos.y, vidSize.width, vidSize.height);

    drawBtn(btnCx, btnCy, btnRadius);
  };

  p.mouseClicked = function () {
    const d = p.dist(p.mouseX, p.mouseY, btnCx, btnCy);
    if (d < btnRadius) {
      if (isVideoPlaying) {
        video.pause();
      } else {
        video.play();
      }
      isVideoPlaying = !isVideoPlaying;
    }
  };

  function drawBtn(cx, cy, r) {
    const d = p.dist(p.mouseX, p.mouseY, cx, cy);

    if (d < r) {
      p.fill(btnHoverColor);
    } else {
      p.fill(btnColor);
    }
    p.ellipse(cx, cy, r * 2);

    if (isVideoPlaying) {
      p.image(
        pauseIcon,
        cx - btnRadius / 2,
        cy - btnRadius / 2,
        btnRadius,
        btnRadius
      );
    } else {
      p.image(
        playIcon,
        cx - btnRadius / 2,
        cy - btnRadius / 2,
        btnRadius,
        btnRadius
      );
    }
  }
}

function calculateVidSize(video, p) {
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

function calculateVidLocation(vidSize, p) {
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
