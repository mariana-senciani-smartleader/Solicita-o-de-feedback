import { useState } from "react";

const EMOJI_CATEGORIES = [
  {
    id: "smileys", emoji: "😊", label: "Smileys",
    list: ["😀","😃","😄","😁","😆","😅","🤣","😂","🙂","🙃","😉","😊","😇","🥰","😍","🤩","😘","😋","😛","😜","🤪","😎","🤓","🧐","🤔","🤗","🤭","🤫","😏","😒","🙄","😬","😐","😑","😮","😲","😳","🥺","😢","😭","😱","😡","😤","🤬","😈","👿","💀","🤡","😷","🤒","🤢","🤧","🥴","😵","🤯","🥳"],
  },
  {
    id: "hands", emoji: "👍", label: "Gestos",
    list: ["👋","🤚","✋","🖖","👌","🤌","🤏","✌️","🤞","🤟","🤘","🤙","👈","👉","👆","👇","👍","👎","✊","👊","🤛","🤜","👏","🙌","🤲","🙏","💪","🤳","✍️","💅","🫶","🫵"],
  },
  {
    id: "nature", emoji: "🌿", label: "Natureza",
    list: ["🌸","🌺","🌻","🌹","🌷","🌼","🍀","☘️","🌿","🍃","🍂","🍁","🌱","🌲","🌳","🌴","🌵","🍄","🌊","💧","🌍","🌎","🌏","🌙","⭐","🌟","⚡","🔥","💥","❄️","🌈","☀️","🐶","🐱","🐭","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐸","🐵","🦋","🐝","🌺"],
  },
  {
    id: "food", emoji: "🍕", label: "Comida",
    list: ["🍎","🍊","🍋","🍌","🍉","🍇","🍓","🫐","🍒","🍑","🥭","🥝","🍅","🥑","🌽","🥕","🍕","🍔","🍟","🌭","🌮","🍣","🍜","🍝","🍦","🎂","🍰","🧁","🍩","🍪","🍫","🍬","🍭","☕","🍵","🍺","🍷","🥂","🧃","🥤"],
  },
  {
    id: "activities", emoji: "⚽", label: "Atividades",
    list: ["⚽","🏀","🏈","⚾","🎾","🏐","🎱","🏆","🥇","🥈","🥉","🎮","🕹️","🎯","🎲","🎨","🎭","🎬","🎤","🎧","🎵","🎶","🎸","🥁","🎻","🎺","🪗","🎊","🎉","🎈","🎁","🎀","🏅","🎖️","🏋️"],
  },
  {
    id: "symbols", emoji: "❤️", label: "Símbolos",
    list: ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❣️","💕","💞","💓","💗","💖","💘","💝","✅","❌","⚠️","💯","✨","💫","🎉","🎊","💡","📣","🔔","🔑","💌","📱","💻","🖥️","📷","📞","🔊","💬","📢","🙌","👑","🌟"],
  },
];

interface Props {
  onSelect: (emoji: string) => void;
}

const EmojiPicker = ({ onSelect }: Props) => {
  const [activeCategory, setActiveCategory] = useState("smileys");

  const current = EMOJI_CATEGORIES.find(c => c.id === activeCategory) ?? EMOJI_CATEGORIES[0];

  return (
    <div style={{ width: 300, fontFamily: "Inter, sans-serif" }}>

      {/* Category tabs */}
      <div style={{ display: "flex", gap: 2, padding: "10px 10px 6px", borderBottom: "1px solid #F2F4F7" }}>
        {EMOJI_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            title={cat.label}
            style={{
              flex: 1, height: 30, borderRadius: 6, border: "none",
              background: activeCategory === cat.id ? "#EFF8FF" : "transparent",
              outline: activeCategory === cat.id ? "1.5px solid #B2DDFF" : "none",
              cursor: "pointer", fontSize: 17,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => { if (activeCategory !== cat.id) e.currentTarget.style.background = "#F5F5F5"; }}
            onMouseLeave={e => { if (activeCategory !== cat.id) e.currentTarget.style.background = "transparent"; }}
          >
            {cat.emoji}
          </button>
        ))}
      </div>

      {/* Category label */}
      <div style={{ padding: "8px 12px 4px" }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#98A2B3", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {current.label}
        </span>
      </div>

      {/* Emoji grid */}
      <div style={{ padding: "0 8px 10px", maxHeight: 192, overflowY: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 1 }}>
          {current.list.map((emoji, i) => (
            <button
              key={i}
              onClick={() => onSelect(emoji)}
              title={emoji}
              style={{
                width: 34, height: 34, borderRadius: 6, border: "none",
                background: "transparent", cursor: "pointer", fontSize: 20,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.1s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#F5F5F5")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmojiPicker;
