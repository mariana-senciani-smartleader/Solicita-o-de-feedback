interface PostMediaPhotoProps {
  src: string;
  alt?: string;
  onClick?: () => void;
}

const PostMediaPhoto = ({ src, alt = "Post image", onClick }: PostMediaPhotoProps) => (
  <div style={{ marginBottom: 16, cursor: onClick ? "pointer" : undefined }} onClick={onClick}>
    <img
      src={src}
      alt={alt}
      style={{ borderRadius: 10, width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block", transition: "opacity 0.15s" }}
      onMouseEnter={e => { if (onClick) e.currentTarget.style.opacity = "0.92"; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
    />
  </div>
);

export default PostMediaPhoto;
