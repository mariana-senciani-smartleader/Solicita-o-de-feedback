/**
 * Returns a high-resolution generated photo for any person name.
 * Uses a pool of 10 AI-generated headshots and assigns deterministically by name hash.
 */
const PHOTO_POOL = [
  "/assets/avatar-bruno-delorence.png",
  "/assets/avatar-ana-costa.png",
  "/assets/avatar-carlos-mendes.png",
  "/assets/avatar-fernanda-lima.png",
  "/assets/avatar-rafael-souza.png",
  "/assets/avatar-juliana-rocha.png",
  "/assets/avatar-pedro-alves.png",
  "/assets/avatar-camila-torres.png",
  "/assets/avatar-diego-ferreira.png",
  "/assets/avatar-mariana-oliveira.png",
];

function hashName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = ((h << 5) - h + name.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export const avatar = (name: string): string => {
  return PHOTO_POOL[hashName(name) % PHOTO_POOL.length];
};
