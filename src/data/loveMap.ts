export type LoveMapPointId = "B" | "L";
export type LoveMapActionId = "missile" | "teleport";

export type LoveMapPoint = {
  id: LoveMapPointId;
  label: string;
  person: string;
  location: string;
  left: string;
  top: string;
  x: number;
  y: number;
  glow: string;
};

export const loveMapCopy = {
  eyebrow: "feature 03",
  title: "Карта любви B ↔ L",
  description:
    "Корсика и Армения, связанные линией, для которой расстояние не имеет значения. 💞",
  defaultBadge: "world view",
  defaultTitle: "Հեռավորությունը միայն զարդարանք է։",
  defaultText: "Выбери действие ниже и нажми на B или L на карте.",
  readyHintBadge: "interactive map",
  readyHintTitle: "Выбери следующий шаг",
  readyHintText:
    "Активируй действие любви ниже, затем нажми на B или L прямо на карте.",
  missileArmedBadge: "ракета любви активирована",
  missileArmedTitle: "Требуется выбор цели",
  missileArmedText:
    "Нажми на B или L, и сердечная ракета будет отправлена с другой стороны.",
  missileDeliveredBadge: "попадание подтверждено",
  teleportArmedBadge: "Сократить расстояние",
  teleportArmedTitle: "Сократить расстояние",
  teleportArmedText:
    "Нажми на B или L, и другая сторона телепортируется туда, нарушая географию с блеском и искрами.",
  teleportDeliveredBadge: "расстояние устранено",
  onlyLunaBadge: "мир под защитой",
  onlyLunaTitle: "Остаётся только Луна",
  onlyLunaText:
    "Все соперничающие метки удалены с поверхности мира.",
  restoreWorldBadge: "драматическая перезагрузка",
  restoreWorldTitle: "Мир восстановлен",
  restoreWorldText:
    "Соперничающие метки восстановлены. Исключительно в театральных целях.",
  pickActionFirstBadge: "не активировано",
  pickActionFirstTitle: "Сначала выбери действие",
  pickActionFirstText:
    "Выбери ракету любви или телепортацию, затем нажми на одну из двух точек.",
  actionsTitle: "Действия на карте",
  sendMissile: "Отправить ракету любви",
  teleport: "Телепортироваться к другому",
  onlyLuna: "Остаётся только Луна",
  restoreWorld: "Восстановить мир",
  backToDashboard: "Back to dashboard",
};

export const LOVE_MAP_POINTS: Record<LoveMapPointId, LoveMapPoint> = {
  B: {
    id: "B",
    label: "B",
    person: "Baptiste",
    location: "Corsica",
    left: "46.2%",
    top: "39.6%",
    x: 462,
    y: 206,
    glow: "#ff6fb5",
  },
  L: {
    id: "L",
    label: "L",
    person: "Luna",
    location: "Armenia",
    left: "69%",
    top: "35.8%",
    x: 690,
    y: 186,
    glow: "#8b6cff",
  },
};

export const LOVE_MAP_ROUTE_PATH = "M462 206 Q572 102 690 186";

export const LOVE_MAP_ACTIONS = [
  {
    id: "missile" as const,
    icon: "💘",
    title: "Ракета любви",
    description:
      "Отправь сердечную ракету с одной стороны на другую и позволь ей взорваться чувствами при столкновении.",
  },
  {
    id: "teleport" as const,
    icon: "🫧",
    title: "Телепортация",
    description:
      "Полностью игнорируй карту и сверни расстояние в милый светящийся короткий путь.",
  },
];

export const LOVE_MAP_RIVALS = [
  { id: "r1", left: "12%", top: "23%" },
  { id: "r2", left: "21%", top: "67%" },
  { id: "r3", left: "33%", top: "18%" },
  { id: "r4", left: "57%", top: "63%" },
  { id: "r5", left: "78%", top: "26%" },
  { id: "r6", left: "85%", top: "70%" },
  { id: "r7", left: "63%", top: "18%" },
  { id: "r8", left: "41%", top: "74%" },
];