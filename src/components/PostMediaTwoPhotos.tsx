interface PostMediaTwoPhotosProps {
  images: string[];
}

const PostMediaTwoPhotos = ({ images }: PostMediaTwoPhotosProps) => (
  <div style={{ marginBottom: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
    {images.slice(0, 2).map((src, i) => (
      <img
        key={i}
        src={src}
        alt={`Post image ${i + 1}`}
        style={{ borderRadius: 10, width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block" }}
      />
    ))}
  </div>
);

export default PostMediaTwoPhotos;
