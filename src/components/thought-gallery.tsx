"use client";

/* eslint-disable @next/next/no-img-element -- Keep unknown image dimensions at their intrinsic aspect ratio. */
import { useEffect, useRef, useState } from "react";

type Photo = { src: string; alt: string };

export function ThoughtGallery({ images }: { images: Photo[] }) {
  const [selected, setSelected] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (selected === null) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!dialog.open) dialog.showModal();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selected]);

  function close() {
    dialogRef.current?.close();
    setSelected(null);
  }

  return (
    <>
      <div className="thought-images" data-single={images.length === 1}>
        {images.map((image, index) => (
          <button
            className="thought-image"
            key={image.src}
            type="button"
            onClick={() => setSelected(index)}
            aria-label={`预览：${image.alt}`}
          >
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              draggable={false}
            />
          </button>
        ))}
      </div>
      <dialog
        ref={dialogRef}
        className="image-preview"
        aria-label="图片预览"
        onClose={() => setSelected(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        onKeyDown={(event) => {
          if (selected === null) return;
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            setSelected(
              (selected +
                (event.key === "ArrowRight" ? 1 : -1) +
                images.length) %
                images.length,
            );
          }
        }}
      >
        <button
          className="preview-close"
          type="button"
          onClick={close}
          aria-label="关闭图片预览"
        >
          ×
        </button>
        {selected !== null && (
          <img
            src={images[selected].src}
            alt={images[selected].alt}
            draggable={false}
          />
        )}
        {images.length > 1 && selected !== null && (
          <div className="preview-controls">
            <button
              type="button"
              onClick={() =>
                setSelected((selected - 1 + images.length) % images.length)
              }
              aria-label="上一张"
            >
              ←
            </button>
            <span>
              {selected + 1} / {images.length}
            </span>
            <button
              type="button"
              onClick={() => setSelected((selected + 1) % images.length)}
              aria-label="下一张"
            >
              →
            </button>
          </div>
        )}
      </dialog>
    </>
  );
}
