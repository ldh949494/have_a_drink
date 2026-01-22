const moodPhrases = {
  微醺自在: ["轻松", "舒展", "慢慢放松"],
  元气爆棚: ["明亮", "跳跃", "充满活力"],
  松弛疗愈: ["柔和", "安静", "像云一样"],
  夜色浪漫: ["迷人", "柔软", "微微心动"],
  灵感涌动: ["锋利", "清晰", "充满灵感"],
  暖心治愈: ["温暖", "圆润", "像拥抱一样"],
};

const tasteNotes = {
  清爽微酸: "入口清亮，酸度轻柔，带一点清新的尾韵。",
  果香甜润: "果味饱满，甜度柔和，像咬下一口熟果。",
  花草清香: "香气清透，花草味层层展开。",
  醇厚微苦: "结构扎实，微苦平衡，回味更长。",
  辛香刺激: "香料感明显，刺激感更立体。",
  奶香柔滑: "口感柔软顺滑，像甜品般轻盈。",
};

const mixTips = [
  "先选 1 种基酒，再选 2-3 种辅助风味，层次会更清晰。",
  "加入酸味或气泡可以让甜感更干净。",
  "想要更突出香气，可以加一抹草本或柑橘皮。",
  "用苦味材料收尾，能让整杯酒更有记忆点。",
];

const nameSeeds = [
  "暮光",
  "灵感",
  "海风",
  "月光",
  "火花",
  "微醺",
  "柔光",
  "暮色",
  "晨曦",
  "星幕",
];

const posterThemes = {
  微醺自在: {
    name: "haze",
    palettes: [
      { bg: ["#f7d7b5", "#d3efe8"], accent: "#f07c54", ink: "#1c1a27" },
      { bg: ["#f4e1d2", "#dfe9f0"], accent: "#e07a5f", ink: "#24324b" },
    ],
  },
  元气爆棚: {
    name: "spark",
    palettes: [
      { bg: ["#ffe8a8", "#f3d5ef"], accent: "#8b4a6b", ink: "#2a1e24" },
      { bg: ["#ffe1b3", "#ffd4d4"], accent: "#ff6b6b", ink: "#2c1d1d" },
    ],
  },
  松弛疗愈: {
    name: "cloud",
    palettes: [
      { bg: ["#d6f5f0", "#f7f4d9"], accent: "#5a9c8b", ink: "#22332f" },
      { bg: ["#d9e7ff", "#e7f4f1"], accent: "#4b8cb3", ink: "#1e2a34" },
    ],
  },
  夜色浪漫: {
    name: "night",
    palettes: [
      { bg: ["#2b1d3b", "#b56c6c"], accent: "#f3b562", ink: "#f7f0e8" },
      { bg: ["#2a1f2d", "#8b4a6b"], accent: "#f0c987", ink: "#f4e9df" },
    ],
  },
  灵感涌动: {
    name: "wave",
    palettes: [
      { bg: ["#cfe2ff", "#f4e4c9"], accent: "#3c7a89", ink: "#1d2330" },
      { bg: ["#d0f2ff", "#f7e0c3"], accent: "#2d6f7f", ink: "#1b2530" },
    ],
  },
  暖心治愈: {
    name: "warm",
    palettes: [
      { bg: ["#f3c6c6", "#f4f0d9"], accent: "#c46b5a", ink: "#2d1f2d" },
      { bg: ["#f6d2b8", "#f7ecd0"], accent: "#bf6d4a", ink: "#3a2a2a" },
    ],
  },
};

const mixBtn = document.getElementById("mixBtn");
const resetBtn = document.getElementById("resetBtn");
const saveBtn = document.getElementById("saveBtn");
const posterBtn = document.getElementById("posterBtn");
const editBtn = document.getElementById("editBtn");
const mocktailToggle = document.getElementById("mocktailToggle");
const classicToggle = document.getElementById("classicToggle");
const recipeList = document.getElementById("recipeList");
const stepList = document.getElementById("stepList");
const glassType = document.getElementById("glassType");
const savedList = document.getElementById("savedList");
const drinkName = document.getElementById("drinkName");
const drinkTagline = document.getElementById("drinkTagline");
const flavorNote = document.getElementById("flavorNote");
const mixTip = document.getElementById("mixTip");
const posterModal = document.getElementById("posterModal");
const posterCanvas = document.getElementById("posterCanvas");
const closePoster = document.getElementById("closePoster");
const downloadPoster = document.getElementById("downloadPoster");
const downloadSvg = document.getElementById("downloadSvg");
const copyPosterText = document.getElementById("copyPosterText");

const STORAGE_KEY = "mood-mix-recipes";
let latestRecipe = null;
let isEditing = false;

const collectChecked = (name) => {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(
    (item) => item.value
  );
};

const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const setCanvasSize = (canvas, width, height) => {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const ctx = canvas.getContext("2d");
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  return ctx;
};

const collectSelections = () => ({
  spirit: collectChecked("spirit"),
  mixer: collectChecked("mixer"),
  fruit: collectChecked("fruit"),
  herb: collectChecked("herb"),
  sweet: collectChecked("sweet"),
  bitters: collectChecked("bitters"),
  texture: collectChecked("texture"),
  garnish: collectChecked("garnish"),
});

const classicCombos = {
  金酒: { mixer: ["汤力水"], citrus: ["青柠汁"], herb: ["薄荷"], bitters: ["橙味苦精"], garnish: ["橙皮"] },
  伏特加: { mixer: ["蔓越莓汁"], citrus: ["青柠汁"], herb: ["薄荷"], garnish: ["青柠轮"] },
  白朗姆: { mixer: ["苏打水"], citrus: ["青柠汁"], sweet: ["黑糖"], garnish: ["薄荷叶"] },
  黑朗姆: { mixer: ["菠萝汁"], citrus: ["青柠汁"], sweet: ["黑糖"], garnish: ["樱桃"] },
  龙舌兰: { mixer: ["橙汁"], citrus: ["青柠汁"], garnish: ["盐边"] },
  波本: { mixer: ["苏打水"], sweet: ["枫糖"], bitters: ["安格式苦精"], garnish: ["橙皮"] },
  威士忌: { mixer: ["苏打水"], sweet: ["蜂蜜"], bitters: ["安格式苦精"], garnish: ["橙皮"] },
  干邑: { mixer: ["橙汁"], citrus: ["柠檬汁"], sweet: ["蜂蜜"], garnish: ["柠檬片"] },
  梅酒: { mixer: ["苏打水"], citrus: ["青柠汁"], garnish: ["青柠轮"] },
  清酒: { mixer: ["茉莉冷泡茶"], citrus: ["青柠汁"], garnish: ["薄荷叶"] },
  雪莉: { mixer: ["汤力水"], bitters: ["橙味苦精"], garnish: ["橙皮"] },
  苦艾酒: { mixer: ["苏打水"], citrus: ["柠檬汁"], herb: ["薄荷"], garnish: ["柠檬片"] },
};

const mocktailDefaults = {
  清爽微酸: { mixer: ["苏打水"], citrus: ["青柠汁"], herb: ["薄荷"], garnish: ["青柠轮"] },
  果香甜润: { mixer: ["菠萝汁", "橙汁"], sweet: ["蜂蜜"], fruit: ["芒果"], garnish: ["樱桃"] },
  花草清香: { mixer: ["茉莉冷泡茶"], citrus: ["青柠汁"], herb: ["罗勒"], garnish: ["可食用花"] },
  醇厚微苦: { mixer: ["冷萃咖啡"], sweet: ["黑糖"], garnish: ["橙皮"] },
  辛香刺激: { mixer: ["姜汁汽水"], citrus: ["青柠汁"], herb: ["辣椒"], garnish: ["青柠轮"] },
  奶香柔滑: { mixer: ["椰奶"], sweet: ["香草糖浆"], fruit: ["椰子"], garnish: ["肉桂棒"] },
};

const mergeUnique = (base, additions) => {
  const set = new Set(base);
  additions.forEach((item) => set.add(item));
  return Array.from(set);
};

const applyClassicSuggestions = (selectionMap, taste, isMocktail) => {
  const autoAdded = [];
  const updated = { ...selectionMap };

  if (isMocktail) {
    const preset = mocktailDefaults[taste];
    if (!preset) return { updated, autoAdded };
    if (updated.mixer.length === 0 && preset.mixer) {
      updated.mixer = mergeUnique(updated.mixer, preset.mixer);
      autoAdded.push(...preset.mixer);
    }
    if (
      preset.citrus &&
      !updated.mixer.some((item) => item.includes("柠檬") || item.includes("青柠"))
    ) {
      updated.mixer = mergeUnique(updated.mixer, preset.citrus);
      autoAdded.push(...preset.citrus);
    }
    if (updated.sweet.length === 0 && preset.sweet) {
      updated.sweet = mergeUnique(updated.sweet, preset.sweet);
      autoAdded.push(...preset.sweet);
    }
    if (updated.fruit.length === 0 && preset.fruit) {
      updated.fruit = mergeUnique(updated.fruit, preset.fruit);
      autoAdded.push(...preset.fruit);
    }
    if (updated.herb.length === 0 && preset.herb) {
      updated.herb = mergeUnique(updated.herb, preset.herb);
      autoAdded.push(...preset.herb);
    }
    if (updated.garnish.length === 0 && preset.garnish) {
      updated.garnish = mergeUnique(updated.garnish, preset.garnish);
      autoAdded.push(...preset.garnish);
    }
    if (updated.mixer.length === 0 && updated.fruit.length === 0) {
      updated.mixer = ["苏打水"];
      autoAdded.push("苏打水");
    }
    return { updated, autoAdded };
  }

  if (updated.spirit.length === 0) return { updated, autoAdded };
  const spirit = updated.spirit[0];
  const preset = classicCombos[spirit];
  if (!preset) return { updated, autoAdded };

  if (updated.mixer.length === 0 && preset.mixer) {
    updated.mixer = mergeUnique(updated.mixer, preset.mixer);
    autoAdded.push(...preset.mixer);
  }
  if (
    preset.citrus &&
    !updated.mixer.some((item) => item.includes("柠檬") || item.includes("青柠"))
  ) {
    updated.mixer = mergeUnique(updated.mixer, preset.citrus);
    autoAdded.push(...preset.citrus);
  }
  if (updated.herb.length === 0 && preset.herb) {
    updated.herb = mergeUnique(updated.herb, preset.herb);
    autoAdded.push(...preset.herb);
  }
  if (updated.sweet.length === 0 && preset.sweet) {
    updated.sweet = mergeUnique(updated.sweet, preset.sweet);
    autoAdded.push(...preset.sweet);
  }
  if (updated.bitters.length === 0 && preset.bitters) {
    updated.bitters = mergeUnique(updated.bitters, preset.bitters);
    autoAdded.push(...preset.bitters);
  }
  if (updated.garnish.length === 0 && preset.garnish) {
    updated.garnish = mergeUnique(updated.garnish, preset.garnish);
    autoAdded.push(...preset.garnish);
  }

  return { updated, autoAdded };
};

const buildRecipe = (selectionMap, taste, intensity, isMocktail) => {
  const {
    spirit,
    mixer,
    fruit,
    herb,
    sweet,
    bitters,
    texture,
    garnish,
  } = selectionMap;

  const totalCount =
    spirit.length +
    mixer.length +
    fruit.length +
    herb.length +
    sweet.length +
    bitters.length +
    texture.length +
    garnish.length;

  if (totalCount === 0) {
    return ["选择至少一种材料开始创作。"];
  }

  const carbonatedMixers = ["苏打水", "汤力水", "姜汁汽水", "起泡酒"];
  const citrusJuice = ["青柠汁", "柠檬汁"];
  const juices = ["菠萝汁", "西柚汁", "蔓越莓汁", "苹果汁", "橙汁"];
  const teaCoffee = ["茉莉冷泡茶", "红茶", "冷萃咖啡"];
  const creamy = ["椰奶"];

  const isCarbonated = mixer.some((item) => carbonatedMixers.includes(item));
  const citrus = mixer.filter((item) => citrusJuice.includes(item));
  const nonCarbonatedMixers = mixer.filter(
    (item) => !carbonatedMixers.includes(item) && !citrusJuice.includes(item)
  );

  const profile = isMocktail
    ? { base: 0, citrus: 25, sweet: 15, nonCarbonated: 120, nonCarbonatedFizz: 80, carbonated: 110 }
    : {
        轻盈: { base: 30, citrus: 20, sweet: 15, nonCarbonated: 90, nonCarbonatedFizz: 60, carbonated: 90 },
        平衡: { base: 45, citrus: 20, sweet: 15, nonCarbonated: 75, nonCarbonatedFizz: 45, carbonated: 75 },
        强劲: { base: 60, citrus: 15, sweet: 10, nonCarbonated: 60, nonCarbonatedFizz: 30, carbonated: 60 },
      }[intensity];

  const tasteAdjust = {
    清爽微酸: { citrus: 5, sweet: -5 },
    果香甜润: { sweet: 5 },
    花草清香: {},
    醇厚微苦: { sweet: -5 },
    辛香刺激: { base: 5 },
    奶香柔滑: { nonCarbonated: 15 },
  }[taste] || {};

  const baseVolume = !isMocktail && spirit.length ? profile.base + (tasteAdjust.base || 0) : 0;
  let citrusVolume = citrus.length ? profile.citrus + (tasteAdjust.citrus || 0) : 0;
  let sweetVolume = sweet.length ? profile.sweet + (tasteAdjust.sweet || 0) : 0;
  let nonCarbonatedVolume = nonCarbonatedMixers.length
    ? (isCarbonated ? profile.nonCarbonatedFizz : profile.nonCarbonated) + (tasteAdjust.nonCarbonated || 0)
    : 0;
  let carbonatedVolume = isCarbonated ? profile.carbonated : 0;

  citrusVolume = Math.max(0, citrusVolume);
  sweetVolume = Math.max(0, sweetVolume);
  nonCarbonatedVolume = Math.max(0, nonCarbonatedVolume);
  carbonatedVolume = Math.max(0, carbonatedVolume);

  if (spirit.length === 0 || isMocktail) {
    nonCarbonatedVolume += 30;
    carbonatedVolume += isCarbonated ? 15 : 0;
    citrusVolume = Math.max(citrusVolume, 15);
  }

  const distributeVolume = (total, items) => {
    if (items.length === 0 || total <= 0) return [];
    const minTotal = items.length * 5;
    const normalizedTotal = Math.max(total, minTotal);
    const base = Math.floor(normalizedTotal / items.length / 5) * 5;
    let remainder = normalizedTotal - base * items.length;
    return items.map((item, index) => {
      const extra = remainder >= 5 ? 5 : 0;
      remainder -= extra;
      return { item, volume: base + extra };
    });
  };

  const lines = [];

  distributeVolume(baseVolume, spirit).forEach(({ item, volume }) => {
    lines.push(`${volume}ml ${item}`);
  });

  distributeVolume(citrusVolume, citrus).forEach(({ item, volume }) => {
    lines.push(`${volume}ml ${item}`);
  });

  distributeVolume(sweetVolume, sweet).forEach(({ item, volume }) => {
    lines.push(`${volume}ml ${item}`);
  });

  const prioritizedMixers = [
    ...nonCarbonatedMixers.filter((item) => juices.includes(item)),
    ...nonCarbonatedMixers.filter((item) => teaCoffee.includes(item)),
    ...nonCarbonatedMixers.filter((item) => creamy.includes(item)),
    ...nonCarbonatedMixers.filter(
      (item) => !juices.includes(item) && !teaCoffee.includes(item) && !creamy.includes(item)
    ),
  ];

  distributeVolume(nonCarbonatedVolume, prioritizedMixers).forEach(({ item, volume }) => {
    lines.push(`${volume}ml ${item}`);
  });

  distributeVolume(carbonatedVolume, mixer.filter((item) => carbonatedMixers.includes(item))).forEach(
    ({ item, volume }) => {
      lines.push(`${volume}ml ${item}（最后补气）`);
    }
  );

  if (fruit.length) {
    lines.push(`新鲜水果：${fruit.join("、")}（轻压出香）`);
  }
  if (herb.length) {
    lines.push(`草本香气：${herb.join("、")}（拍打或轻压）`);
  }
  if (texture.includes("蛋白泡沫")) {
    lines.push("1 个蛋白（或 20ml 蛋白液）");
  }
  if (bitters.length) {
    bitters.forEach((item) => {
      lines.push(`2 dash ${item}`);
    });
  }
  if (texture.includes("碎冰")) {
    lines.push("适量碎冰");
  }
  if (texture.includes("冰沙")) {
    lines.push("适量冰沙");
  }
  if (garnish.length) {
    lines.push(`装饰：${garnish.join("、")}`);
  }

  return lines;
};

const buildSteps = (selectionMap, taste, intensity, isMocktail) => {
  const { spirit, mixer, fruit, herb, sweet, bitters, texture, garnish } = selectionMap;
  if (
    spirit.length +
      mixer.length +
      fruit.length +
      herb.length +
      sweet.length +
      bitters.length +
      texture.length +
      garnish.length ===
    0
  ) {
    return ["先选择材料，再生成调酒步骤。"];
  }

  const steps = ["提前冰镇杯子 2-3 分钟，准备足量透明冰块。"];
  if (garnish.includes("盐边") || garnish.includes("糖边")) {
    steps.push("用柠檬/青柠润杯口，裹上盐边或糖边，保持杯壁干净。");
  }
  if (fruit.length || herb.length) {
    const herbText = herb.length ? `拍打${herb.join("、")}` : "";
    const fruitText = fruit.length ? `轻压${fruit.join("、")}` : "";
    steps.push(`在调酒壶中${[herbText, fruitText].filter(Boolean).join("，")}释放香气。`);
  }
  if (sweet.length) {
    steps.push(`加入甜味材料（${sweet.join("、")}），搅拌至充分融合。`);
  }
  if (spirit.length && !isMocktail) {
    steps.push(`用量杯加入基酒（${spirit.join("、")}），总量控制在 45-60ml。`);
  } else {
    steps.push("无酒精版本：以混合饮品为主体，保持酸甜平衡。");
  }
  const nonCarbonatedMixers = mixer.filter(
    (item) => !["苏打水", "汤力水", "姜汁汽水", "起泡酒"].includes(item)
  );
  if (nonCarbonatedMixers.length) {
    steps.push(`加入非气泡混合物（${nonCarbonatedMixers.join("、")}）。`);
  }
  if (bitters.length) {
    steps.push(`加入苦味材料（${bitters.join("、")}）1-2 dash。`);
  }

  const hasJuiceOrDairy = mixer.some(
    (item) => item.includes("汁") || item.includes("茶") || item.includes("咖啡") || item.includes("奶")
  );
  const hasFoam = texture.includes("蛋白泡沫");
  const hasBlend = texture.includes("冰沙");
  const hasBubble =
    texture.includes("气泡") ||
    mixer.includes("汤力水") ||
    mixer.includes("苏打水") ||
    mixer.includes("起泡酒") ||
    mixer.includes("姜汁汽水");

  if (hasBlend) {
    steps.push("加入碎冰或冰沙，搅拌机打匀 10-15 秒后倒入杯中。");
  } else if (hasFoam) {
    steps.push("先干摇 10 秒起泡，再加满冰块湿摇 12-15 秒。");
  } else if (hasJuiceOrDairy || sweet.length || fruit.length) {
    steps.push("加满冰块用力摇匀 12-15 秒，双重过滤入杯。");
  } else {
    steps.push("加冰搅拌 20-30 秒至充分冰镇，过滤入杯。");
  }

  if (hasBubble) {
    steps.push("注入气泡类饮品至八分满，轻轻搅拌 1-2 圈。");
  }

  if (garnish.length) {
    steps.push(`装饰杯口或酒面（${garnish.join("、")}），出杯。`);
  } else {
    steps.push("轻点柑橘皮或香草，完成出杯。");
  }

  if (taste === "醇厚微苦" || intensity === "强劲") {
    steps.push("建议慢饮，感受酒体厚度与回味。");
  }

  return steps;
};

const recommendGlass = ({ mixer, texture, bitters }, taste, intensity) => {
  if (texture.includes("冰沙")) {
    return "飓风杯/大容量杯：适合冰沙与果香层次。";
  }
  if (mixer.includes("起泡酒")) {
    return "香槟杯：保留细腻气泡与香气。";
  }
  if (
    texture.includes("气泡") ||
    mixer.includes("汤力水") ||
    mixer.includes("苏打水") ||
    mixer.includes("姜汁汽水")
  ) {
    return "高球杯：适合气泡型与清爽长饮。";
  }
  if (taste === "奶香柔滑" || texture.includes("蛋白泡沫")) {
    return "古典鸡尾酒杯（Coupe）：突出细腻泡沫与奶香。";
  }
  if (intensity === "强劲" || bitters.length) {
    return "岩石杯：更适合厚重酒体与苦味收尾。";
  }
  return "马天尼杯：适合清亮、层次利落的风格。";
};

const loadSaved = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const saveAll = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const renderSavedList = () => {
  const items = loadSaved();
  savedList.innerHTML = "";
  if (items.length === 0) {
    const li = document.createElement("li");
    li.textContent = "暂无保存的配方。";
    savedList.appendChild(li);
    return;
  }
  items.forEach((item, index) => {
    const li = document.createElement("li");
    const title = document.createElement("span");
    title.textContent = `${item.name} · ${item.tagline}`;
    const btn = document.createElement("button");
    btn.className = "ghost";
    btn.textContent = "载入";
    btn.addEventListener("click", () => applySaved(index));
    li.appendChild(title);
    li.appendChild(btn);
    savedList.appendChild(li);
  });
};

const applySaved = (index) => {
  const items = loadSaved();
  const item = items[index];
  if (!item) return;
  mocktailToggle.checked = Boolean(item.isMocktail);
  setMocktailMode(mocktailToggle.checked);
  document.querySelectorAll('input[type="checkbox"]').forEach((input) => {
    input.checked = false;
  });
  if (item.selections) {
    Object.entries(item.selections).forEach(([key, values]) => {
      values.forEach((value) => {
        const input = document.querySelector(`input[name="${key}"][value="${value}"]`);
        if (input) input.checked = true;
      });
    });
  }
  document.getElementById("mood").value = item.mood;
  document.getElementById("taste").value = item.taste;
  document.getElementById("intensity").value = item.intensity;
  handleMix();
};

const buildPosterText = (recipe) => {
  const list = recipe.recipeLines.slice(0, 6).join(" / ");
  return `${recipe.name}\n${recipe.tagline}\n杯型：${recipe.glass}\n材料：${list}\n步骤：${recipe.steps.slice(0, 4).join("；")}\n风味：${recipe.flavor}\n#MoodMixLab`;
};

const analyzeRecipe = (selectionMap, taste, isMocktail) => {
  const notes = [];
  if (!isMocktail && selectionMap.spirit.length > 1) {
    notes.push("专业校验：建议只选 1 种基酒，避免风味冲突。");
  }
  if (!isMocktail && selectionMap.spirit.length === 0) {
    notes.push("专业校验：未选择基酒，将生成无酒精版本。");
  }
  if (selectionMap.mixer.length === 0 && selectionMap.fruit.length === 0) {
    notes.push("专业校验：建议至少加入一种混合饮品或水果来提供主体。");
  }
  if (taste === "清爽微酸" && !selectionMap.mixer.some((item) => item.includes("柠檬") || item.includes("青柠"))) {
    notes.push("专业校验：清爽微酸建议加入 15-20ml 柠檬/青柠汁。");
  }
  if (taste === "果香甜润" && selectionMap.sweet.length === 0) {
    notes.push("专业校验：果香甜润建议加入 10-15ml 糖浆或蜂蜜。");
  }
  return notes;
};

const captureRecipeFromUI = () => {
  const recipeLines = Array.from(recipeList.querySelectorAll("li"))
    .map((li) => li.textContent.trim())
    .filter(Boolean);
  const steps = Array.from(stepList.querySelectorAll("li"))
    .map((li) => li.textContent.trim())
    .filter(Boolean);

  return {
    name: drinkName.textContent.trim(),
    tagline: drinkTagline.textContent.trim(),
    glass: glassType.textContent.trim(),
    flavor: flavorNote.textContent.trim(),
    recipeLines,
    steps,
    mood: document.getElementById("mood").value,
    taste: document.getElementById("taste").value,
    intensity: document.getElementById("intensity").value,
  };
};

const setEditingState = (state) => {
  isEditing = state;
  const resultCard = document.querySelector(".result-card");
  resultCard.classList.toggle("is-editing", state);
  [drinkName, drinkTagline, flavorNote, glassType].forEach((el) => {
    el.setAttribute("contenteditable", state ? "true" : "false");
  });
  recipeList.querySelectorAll("li").forEach((li) => {
    li.setAttribute("contenteditable", state ? "true" : "false");
  });
  stepList.querySelectorAll("li").forEach((li) => {
    li.setAttribute("contenteditable", state ? "true" : "false");
  });
  editBtn.textContent = state ? "完成编辑" : "编辑配方";
};

const drawIllustrations = (ctx, width, height, palette, theme) => {
  ctx.save();
  ctx.globalAlpha = 0.8;
  if (theme === "spark") {
    ctx.fillStyle = palette.accent;
    ctx.beginPath();
    ctx.moveTo(width * 0.14, height * 0.18);
    ctx.lineTo(width * 0.18, height * 0.08);
    ctx.lineTo(width * 0.22, height * 0.18);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = palette.ink;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width * 0.75, height * 0.2);
    ctx.lineTo(width * 0.86, height * 0.12);
    ctx.lineTo(width * 0.9, height * 0.22);
    ctx.stroke();
  } else if (theme === "cloud") {
    ctx.fillStyle = palette.accent;
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.arc(width * 0.18, height * 0.16, 26, 0, Math.PI * 2);
    ctx.arc(width * 0.22, height * 0.14, 22, 0, Math.PI * 2);
    ctx.arc(width * 0.26, height * 0.16, 26, 0, Math.PI * 2);
    ctx.fill();
  } else if (theme === "night") {
    ctx.fillStyle = palette.accent;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(width * 0.86, height * 0.16, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = palette.ink;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(width * 0.14, height * 0.22, 10, 0, Math.PI * 2);
    ctx.stroke();
  } else if (theme === "wave") {
    ctx.strokeStyle = palette.accent;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(width * 0.08, height * 0.2);
    ctx.bezierCurveTo(width * 0.2, height * 0.1, width * 0.34, height * 0.3, width * 0.48, height * 0.2);
    ctx.stroke();
  } else if (theme === "warm") {
    ctx.fillStyle = palette.accent;
    ctx.globalAlpha = 0.45;
    ctx.beginPath();
    ctx.ellipse(width * 0.2, height * 0.18, 48, 22, 0.2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = palette.accent;
    ctx.beginPath();
    ctx.ellipse(width * 0.12, height * 0.18, 36, 18, 0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = palette.ink;
  ctx.globalAlpha = 0.12;
  ctx.beginPath();
  ctx.arc(width * 0.78, height * 0.72, 90, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

const buildPosterSVG = (recipe, palette, theme) => {
  const list = recipe.recipeLines.slice(0, 6);
  const steps = recipe.steps.slice(0, 4);
  const svgShapes = [];

  if (theme === "spark") {
    svgShapes.push(
      `<polygon points="100,160 130,80 160,160" fill="${palette.accent}" opacity="0.8" />`,
      `<path d="M560 150 L640 90 L680 170" stroke="${palette.ink}" stroke-width="3" fill="none" />`
    );
  } else if (theme === "cloud") {
    svgShapes.push(
      `<circle cx="140" cy="150" r="26" fill="${palette.accent}" opacity="0.4" />`,
      `<circle cx="180" cy="140" r="22" fill="${palette.accent}" opacity="0.4" />`,
      `<circle cx="220" cy="150" r="26" fill="${palette.accent}" opacity="0.4" />`
    );
  } else if (theme === "night") {
    svgShapes.push(
      `<circle cx="620" cy="150" r="40" fill="${palette.accent}" opacity="0.5" />`,
      `<circle cx="120" cy="190" r="10" fill="none" stroke="${palette.ink}" stroke-width="2" />`
    );
  } else if (theme === "wave") {
    svgShapes.push(
      `<path d="M80 190 C150 110 250 260 340 190" stroke="${palette.accent}" stroke-width="6" fill="none" />`
    );
  } else if (theme === "warm") {
    svgShapes.push(
      `<ellipse cx="160" cy="170" rx="48" ry="22" fill="${palette.accent}" opacity="0.45" />`
    );
  } else {
    svgShapes.push(
      `<ellipse cx="90" cy="170" rx="36" ry="18" fill="${palette.accent}" opacity="0.8" />`
    );
  }

  svgShapes.push(
    `<circle cx="560" cy="700" r="90" fill="${palette.ink}" opacity="0.12" />`
  );

  const recipeText = list
    .map((line, index) => `<text x="60" y="${360 + index * 32}" font-size="24">• ${line}</text>`)
    .join("");
  const stepText = steps
    .map((step, index) => `<text x="60" y="${620 + index * 32}" font-size="24">${index + 1}. ${step}</text>`)
    .join("");

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="960" viewBox="0 0 720 960">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${palette.bg[0]}" />
      <stop offset="100%" stop-color="${palette.bg[1]}" />
    </linearGradient>
  </defs>
  <rect width="720" height="960" fill="url(#bg)" />
  ${svgShapes.join("\n")}
  <text x="48" y="80" font-family="Fraunces, 'Noto Serif SC', serif" font-size="42" font-weight="700" fill="${palette.ink}">心情调酒模拟器</text>
  <text x="48" y="160" font-family="'Noto Serif SC', serif" font-size="56" font-weight="600" fill="${palette.ink}">${recipe.name}</text>
  <text x="48" y="210" font-family="'Space Grotesk','Noto Sans SC', sans-serif" font-size="28" font-weight="500" fill="${palette.ink}">${recipe.tagline}</text>
  <text x="48" y="260" font-family="'Space Grotesk','Noto Sans SC', sans-serif" font-size="24" font-weight="500" fill="${palette.ink}">杯型推荐：${recipe.glass}</text>
  <text x="48" y="320" font-family="'Noto Sans SC', sans-serif" font-size="28" font-weight="600" fill="${palette.ink}">配方比例</text>
  <g font-family="'Noto Sans SC', sans-serif" fill="${palette.ink}">
    ${recipeText}
  </g>
  <text x="48" y="580" font-family="'Noto Sans SC', sans-serif" font-size="28" font-weight="600" fill="${palette.ink}">调酒步骤</text>
  <g font-family="'Noto Sans SC', sans-serif" fill="${palette.ink}">
    ${stepText}
  </g>
  <text x="48" y="900" font-family="'Noto Sans SC', sans-serif" font-size="22" fill="rgba(28,26,39,0.7)">Mood Mix Lab · 理性饮酒</text>
</svg>
  `;
};

const drawPoster = (recipe) => {
  const width = 720;
  const height = 960;
  const ctx = setCanvasSize(posterCanvas, width, height);
  const theme = posterThemes[recipe.mood] || posterThemes["微醺自在"];
  const palette = randomPick(theme.palettes);

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, palette.bg[0]);
  gradient.addColorStop(1, palette.bg[1]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  drawIllustrations(ctx, width, height, palette, theme.name);

  ctx.fillStyle = palette.ink;
  ctx.font = "700 42px 'Fraunces', serif";
  ctx.fillText("心情调酒模拟器", 48, 80);

  ctx.font = "600 56px 'Noto Serif SC', serif";
  ctx.fillText(recipe.name, 48, 160);

  ctx.font = "500 28px 'Space Grotesk', sans-serif";
  ctx.fillText(recipe.tagline, 48, 210);

  ctx.font = "500 24px 'Space Grotesk', sans-serif";
  ctx.fillText(`杯型推荐：${recipe.glass}`, 48, 260);

  ctx.font = "600 28px 'Noto Sans SC', sans-serif";
  ctx.fillText("配方比例", 48, 320);
  ctx.font = "400 24px 'Noto Sans SC', sans-serif";
  recipe.recipeLines.slice(0, 6).forEach((line, index) => {
    ctx.fillText(`• ${line}`, 60, 360 + index * 32);
  });

  ctx.font = "600 28px 'Noto Sans SC', sans-serif";
  ctx.fillText("调酒步骤", 48, 580);
  ctx.font = "400 24px 'Noto Sans SC', sans-serif";
  recipe.steps.slice(0, 4).forEach((step, index) => {
    ctx.fillText(`${index + 1}. ${step}`, 60, 620 + index * 32);
  });

  ctx.font = "400 22px 'Noto Sans SC', sans-serif";
  ctx.fillStyle = "rgba(28, 26, 39, 0.7)";
  ctx.fillText("Mood Mix Lab · 理性饮酒", 48, height - 60);

  downloadPoster.href = posterCanvas.toDataURL("image/png");
  const svg = buildPosterSVG(recipe, palette, theme.name);
  downloadSvg.href = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const openPoster = () => {
  if (!latestRecipe && recipeList.children.length === 0) {
    alert("请先生成你的专属调酒。");
    return;
  }
  const current = latestRecipe ? { ...latestRecipe, ...captureRecipeFromUI() } : captureRecipeFromUI();
  drawPoster(current);
  posterModal.classList.add("is-open");
  posterModal.setAttribute("aria-hidden", "false");
};

const closePosterModal = () => {
  posterModal.classList.remove("is-open");
  posterModal.setAttribute("aria-hidden", "true");
};

const handleMix = () => {
  const resultCard = document.querySelector(".result-card");
  const mood = document.getElementById("mood").value;
  const taste = document.getElementById("taste").value;
  const intensity = document.getElementById("intensity").value;
  const isMocktail = mocktailToggle.checked;

  let selectionMap = collectSelections();
  if (isMocktail) {
    selectionMap.spirit = [];
  }

  let autoAdded = [];
  if (classicToggle.checked) {
    const classicResult = applyClassicSuggestions(selectionMap, taste, isMocktail);
    selectionMap = classicResult.updated;
    autoAdded = classicResult.autoAdded;
  }

  const selections = [
    ...selectionMap.spirit,
    ...selectionMap.mixer,
    ...selectionMap.fruit,
    ...selectionMap.herb,
    ...selectionMap.sweet,
    ...selectionMap.bitters,
    ...selectionMap.texture,
    ...selectionMap.garnish,
  ];

  const name = `${randomPick(nameSeeds)} · ${mood}`;
  const moodDesc = randomPick(moodPhrases[mood] || ["温柔"]);
  const recipe = buildRecipe(selectionMap, taste, intensity, isMocktail);
  const steps = buildSteps(selectionMap, taste, intensity, isMocktail);
  const hasSelections = selections.length > 0;
  const glass = hasSelections
    ? recommendGlass(selectionMap, taste, intensity)
    : "请选择材料后再推荐杯型。";

  recipeList.innerHTML = "";
  recipe.forEach((line) => {
    const li = document.createElement("li");
    li.textContent = line;
    recipeList.appendChild(li);
  });

  stepList.innerHTML = "";
  steps.forEach((step) => {
    const li = document.createElement("li");
    li.textContent = step;
    stepList.appendChild(li);
  });

  glassType.textContent = glass;
  drinkName.textContent = name;
  const tagline = `${isMocktail ? "无酒精" : intensity + "酒感"} · ${taste}`;
  drinkTagline.textContent = tagline;
  flavorNote.textContent = `${tasteNotes[taste]} 气质偏向${moodDesc}，适合${mood}时刻。`;
  const checkNotes = analyzeRecipe(selectionMap, taste, isMocktail);
  if (autoAdded.length) {
    mixTip.textContent = `已按经典搭配补充：${autoAdded.join("、")}。`;
  } else if (checkNotes.length) {
    mixTip.textContent = checkNotes[0];
  } else {
    mixTip.textContent = randomPick(mixTips);
  }

  latestRecipe = hasSelections
    ? {
        name,
        tagline,
        mood,
        taste,
        intensity,
        isMocktail,
        selections: selectionMap,
        recipeLines: recipe,
        steps,
        glass,
        flavor: flavorNote.textContent,
      }
    : null;

  resultCard.classList.remove("result-card--active");
  void resultCard.offsetWidth;
  resultCard.classList.add("result-card--active");
  if (isEditing) setEditingState(true);
};

const handleReset = () => {
  document.querySelectorAll('input[type="checkbox"]').forEach((input) => {
    input.checked = false;
  });
  recipeList.innerHTML = "";
  stepList.innerHTML = "";
  drinkName.textContent = "等待灵感注入...";
  drinkTagline.textContent = "选择材料后，生成专属配方。";
  flavorNote.textContent = "等你来混合心情与口味。";
  mixTip.textContent = "添加 2-3 类材料会更有层次。";
  glassType.textContent = "等待灵感确定杯型。";
  latestRecipe = null;
  setEditingState(false);
  document.querySelector(".result-card").classList.remove("result-card--active");
};

mixBtn.addEventListener("click", handleMix);
resetBtn.addEventListener("click", handleReset);
editBtn.addEventListener("click", () => {
  if (!latestRecipe && recipeList.children.length === 0) {
    alert("请先生成你的专属调酒。");
    return;
  }
  setEditingState(!isEditing);
});
saveBtn.addEventListener("click", () => {
  if (!latestRecipe && recipeList.children.length === 0) {
    alert("请先生成你的专属调酒。");
    return;
  }
  const current = latestRecipe ? { ...latestRecipe, ...captureRecipeFromUI() } : captureRecipeFromUI();
  const items = loadSaved();
  items.unshift({ ...current, savedAt: Date.now() });
  saveAll(items.slice(0, 10));
  renderSavedList();
});

const setMocktailMode = (enabled) => {
  document.querySelectorAll('input[name="spirit"]').forEach((input) => {
    input.disabled = enabled;
    if (enabled) input.checked = false;
  });
};

mocktailToggle.addEventListener("change", () => {
  setMocktailMode(mocktailToggle.checked);
});

posterBtn.addEventListener("click", openPoster);
closePoster.addEventListener("click", closePosterModal);
posterModal.addEventListener("click", (event) => {
  if (event.target === posterModal) closePosterModal();
});
copyPosterText.addEventListener("click", async () => {
  if (!latestRecipe) return;
  const text = buildPosterText(latestRecipe);
  try {
    await navigator.clipboard.writeText(text);
    copyPosterText.textContent = "已复制";
  } catch {
    window.prompt("复制下面的配方文案：", text);
    copyPosterText.textContent = "已生成文案";
  }
  setTimeout(() => {
    copyPosterText.textContent = "复制配方文案";
  }, 1500);
});

renderSavedList();
setMocktailMode(mocktailToggle.checked);
