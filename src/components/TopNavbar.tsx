/* ─── TopNavbar ─────────────────────────────────────────────────────────────
   Exact replica of Menu-superior from the SmartLeader Design System.
   Container: flex row | gap 32px | padding 13px 24px 13px 16px
   Height 66px | bg #101828 | border-bottom 1px solid #EF6820
─────────────────────────────────────────────────────────────────────────── */

const TopNavbar = () => (
  <div
    style={{
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      padding: "13px 24px 13px 16px",
      width: "100%",
      height: 66,
      background: "#101828",
      borderBottom: "1px solid #EF6820",
      flexShrink: 0,
    }}
  >
    {/* Left section: logo (flex 1 to push search to center) */}
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        flex: "1 1 0%",
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          padding: "4px 10px",
          width: 188,
          height: 42,
          flexShrink: 0,
        }}
      >
        <img
          src="/assets/logomarca.svg"
          alt="SmartLeader"
          style={{ width: 188, height: 42, display: "block" }}
        />
      </div>
    </div>

    {/* Center section: search bar (centralized) */}
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        flexShrink: 0,
      }}
    >
      <img
        src="/assets/search-bar.svg"
        alt="Pesquisar"
        style={{ width: 460, height: 34, display: "block" }}
      />
    </div>

    {/* Right section: action icons + avatar (flex 1 to push search to center) */}
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 16,
        flex: "1 1 0%",
        minWidth: 0,
      }}
    >
      <img
        src="/assets/action-icons.svg"
        alt="Actions"
        style={{ width: 138, height: 24, display: "block", flexShrink: 0 }}
      />
      <AvatarCircle />
    </div>
  </div>
);

/* ────────────────────────────────────────────────────────────────────────────
   Avatar – 32×32, border 1.33px solid #FAFAFA, full radius
──────────────────────────────────────────────────────────────────────────── */
const AvatarCircle = () => (
  <img
    src="/assets/avatar-bruno-delorence.png"
    alt="avatar"
    style={{
      width: 32,
      height: 32,
      borderRadius: "50%",
      border: "1.33px solid #FAFAFA",
      display: "block",
      objectFit: "cover",
      background: "#E9EAEB",
      flexShrink: 0,
    }}
  />
);

export default TopNavbar;
