const topics = [
  { id: "arithmetic", name: "Arithmetic: Addition, Subtraction, Multiplication", scope: "Arithmetic" },
  { id: "fractions", name: "Fractions, Decimals, and Percents", scope: "Number Sense" },
  { id: "prealgebra", name: "Pre-Algebra Equations", scope: "Algebra" },
  { id: "algebra", name: "Algebra I/II", scope: "Algebra" },
  { id: "geometry", name: "Geometry", scope: "Geometry" },
  { id: "trigonometry", name: "Trigonometry", scope: "Trig" },
  { id: "precalculus", name: "Precalculus", scope: "Precalculus" },
  { id: "calc1", name: "Calculus I: Limits, Derivatives, Integrals", scope: "Calculus I" },
  { id: "calc2", name: "Calculus II: Series, Techniques, Polar", scope: "Calculus II" },
  { id: "calc3", name: "Calculus III: Vectors and Multivariable", scope: "Calculus III" },
  { id: "mixed", name: "Mixed Challenge", scope: "Full Range" },
];

const state = {
  topic: "arithmetic",
  difficulty: "easy",
  count: 6,
  showSteps: true,
  showAnswers: true,
};

const topicSelect = document.querySelector("#topic");
const countInput = document.querySelector("#count");
const countValue = document.querySelector("#countValue");
const setTitle = document.querySelector("#setTitle");
const statLevel = document.querySelector("#statLevel");
const statCount = document.querySelector("#statCount");
const statScope = document.querySelector("#statScope");
const problemList = document.querySelector("#problemList");
const stepsToggle = document.querySelector("#stepsToggle");
const answersToggle = document.querySelector("#answersToggle");

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (items) => items[rand(0, items.length - 1)];
const clean = (value) => Number.parseFloat(value.toFixed(4)).toString();
const signed = (value) => `${value >= 0 ? "+" : "-"} ${Math.abs(value)}`;
const nzero = (min, max) => {
  let value = 0;
  while (value === 0) value = rand(min, max);
  return value;
};

const m = (value) => `<span class="math">${value}</span>`;
const sup = (value) => `<sup>${value}</sup>`;
const sub = (value) => `<sub>${value}</sub>`;
const frac = (top, bottom) => `<span class="frac"><span>${top}</span><span>${bottom}</span></span>`;
const root = (value) => `<span class="radic">√</span><span class="overbar">${value}</span>`;
const vec = (...values) => `⟨${values.join(", ")}⟩`;
const point = (x, y) => `(${x}, ${y})`;

function gcd(a, b) {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

function simplifyFraction(n, d) {
  const sign = d < 0 ? -1 : 1;
  n *= sign;
  d *= sign;
  const factor = gcd(n, d);
  const top = n / factor;
  const bottom = d / factor;
  return bottom === 1 ? `${top}` : frac(top, bottom);
}

function term(coef, variable = "x", power = 1) {
  const abs = Math.abs(coef);
  const coeff = abs === 1 && power !== 0 ? "" : abs;
  if (power === 0) return `${abs}`;
  if (power === 1) return `${coeff}${variable}`;
  return `${coeff}${variable}${sup(power)}`;
}

function polyText(terms) {
  return terms
    .map(({ c, v = "x", p }, index) => {
      const body = term(c, v, p);
      if (index === 0) return c < 0 ? `-${body}` : body;
      return `${c < 0 ? " − " : " + "}${body}`;
    })
    .join("");
}

function arithmetic(difficulty) {
  const templates = ["basic", "order", "missing", "word", "powers"];
  const type = pick(difficulty === "easy" ? templates.slice(0, 4) : templates);
  const cap = difficulty === "easy" ? 20 : difficulty === "medium" ? 120 : 999;

  if (type === "order") {
    const a = rand(2, 12);
    const b = rand(2, 12);
    const c = rand(2, 9);
    return {
      problem: `Evaluate ${m(`${a} + ${b} × ${c}`)}.`,
      answer: m(a + b * c),
      steps: [m(`Multiply first: ${b} × ${c} = ${b * c}.`), m(`Then add: ${a} + ${b * c} = ${a + b * c}.`)],
    };
  }

  if (type === "missing") {
    const a = rand(4, cap);
    const b = rand(3, difficulty === "hard" ? 80 : 20);
    const answer = a + b;
    return {
      problem: `Find the missing number: ${m(`${a} + □ = ${answer}`)}.`,
      answer: m(b),
      steps: [m(`Subtract ${a} from both sides.`), m(`□ = ${answer} − ${a} = ${b}.`)],
    };
  }

  if (type === "word") {
    const boxes = rand(3, difficulty === "hard" ? 24 : 9);
    const each = rand(4, difficulty === "hard" ? 36 : 12);
    return {
      problem: `A teacher packs ${boxes} boxes with ${each} pencils in each box. How many pencils are there?`,
      answer: m(boxes * each),
      steps: [m(`${boxes} boxes × ${each} pencils = ${boxes * each} pencils.`)],
    };
  }

  if (type === "powers") {
    const base = rand(2, difficulty === "hard" ? 9 : 5);
    const power = rand(2, difficulty === "hard" ? 4 : 3);
    return {
      problem: `Evaluate ${m(`${base}${sup(power)}`)}.`,
      answer: m(base ** power),
      steps: [m(`${base}${sup(power)} means multiply ${base} by itself ${power} times.`), m(`Result: ${base ** power}.`)],
    };
  }

  const op = pick(difficulty === "easy" ? ["+", "−", "×"] : ["+", "−", "×", "÷"]);
  let a = rand(2, cap);
  let b = rand(2, difficulty === "hard" ? 99 : 20);
  if (op === "÷") {
    const q = rand(2, difficulty === "hard" ? 40 : 12);
    a = b * q;
  }
  const answer = op === "+" ? a + b : op === "−" ? a - b : op === "×" ? a * b : a / b;
  return {
    problem: `Compute ${m(`${a} ${op} ${b}`)}.`,
    answer: m(answer),
    steps: [m(`${a} ${op} ${b} = ${answer}.`)],
  };
}

function fractions(difficulty) {
  const type = pick(["fractionOps", "percentOf", "decimal", "convertPercent", "ratio"]);
  const max = difficulty === "easy" ? 8 : difficulty === "medium" ? 14 : 24;

  if (type === "percentOf") {
    const pct = pick(difficulty === "easy" ? [10, 20, 25, 50] : [12, 15, 18, 30, 35, 40, 75]);
    const whole = rand(20, difficulty === "hard" ? 500 : 160);
    return {
      problem: `Find ${m(`${pct}%`)} of ${m(whole)}.`,
      answer: m(clean((pct / 100) * whole)),
      steps: [m(`${pct}% = ${frac(pct, 100)}.`), m(`${frac(pct, 100)} × ${whole} = ${clean((pct / 100) * whole)}.`)],
    };
  }

  if (type === "decimal") {
    const n = rand(1, max);
    const d = pick([4, 5, 8, 10, 20]);
    return {
      problem: `Write ${m(frac(n, d))} as a decimal.`,
      answer: m(clean(n / d)),
      steps: [m(`Divide ${n} by ${d}.`), m(`${n} ÷ ${d} = ${clean(n / d)}.`)],
    };
  }

  if (type === "convertPercent") {
    const n = rand(1, max);
    const d = pick([4, 5, 8, 10, 20, 25]);
    return {
      problem: `Write ${m(frac(n, d))} as a percent.`,
      answer: m(`${clean((n / d) * 100)}%`),
      steps: [m(`Convert to decimal: ${n} ÷ ${d} = ${clean(n / d)}.`), m(`Multiply by 100: ${clean((n / d) * 100)}%.`)],
    };
  }

  if (type === "ratio") {
    const a = rand(2, max);
    const b = rand(2, max);
    const scale = rand(2, difficulty === "hard" ? 9 : 5);
    return {
      problem: `The ratio of red to blue tiles is ${m(`${a}:${b}`)}. If there are ${m(a * scale)} red tiles, how many blue tiles are there?`,
      answer: m(b * scale),
      steps: [m(`Scale factor: ${a * scale} ÷ ${a} = ${scale}.`), m(`Blue tiles: ${b} × ${scale} = ${b * scale}.`)],
    };
  }

  const a = rand(1, max);
  const b = rand(2, max);
  const c = rand(1, max);
  const d = rand(2, max);
  const op = pick(["+", "−", "×"]);
  const n = op === "+" ? a * d + c * b : op === "−" ? a * d - c * b : a * c;
  const den = op === "×" ? b * d : b * d;
  return {
    problem: `Simplify ${m(`${frac(a, b)} ${op} ${frac(c, d)}`)}.`,
    answer: m(simplifyFraction(n, den)),
    steps: op === "×"
      ? [m(`Multiply across: ${frac(`${a} × ${c}`, `${b} × ${d}`)} = ${frac(n, den)}.`), m(`Simplify: ${simplifyFraction(n, den)}.`)]
      : [m(`Use common denominator ${b * d}.`), m(`Combine: ${frac(n, den)}.`), m(`Simplify: ${simplifyFraction(n, den)}.`)],
  };
}

function prealgebra(difficulty) {
  const type = pick(["linear", "twoStep", "proportion", "inequality"]);
  const a = rand(2, difficulty === "hard" ? 12 : 8);
  const x = rand(-10, 15);
  const b = rand(-20, 20);

  if (type === "proportion") {
    const c = rand(2, 12);
    const d = rand(2, 12);
    const answer = a * d;
    return {
      problem: `Solve the proportion ${m(`${frac("x", a)} = ${frac(d, c)}`)}.`,
      answer: m(`x = ${simplifyFraction(a * d, c)}`),
      steps: [m(`Cross multiply: ${c}x = ${a} × ${d}.`), m(`x = ${simplifyFraction(answer, c)}.`)],
    };
  }

  if (type === "inequality") {
    const rhs = a * x + b;
    return {
      problem: `Solve ${m(`${a}x ${signed(b)} > ${rhs}`)}.`,
      answer: m(`x > ${x}`),
      steps: [m(`Subtract ${b}: ${a}x > ${rhs - b}.`), m(`Divide by ${a}: x > ${x}.`)],
    };
  }

  if (type === "twoStep") {
    const rhs = a * x + b;
    return {
      problem: `Solve for ${m("x")}: ${m(`${a}x ${signed(b)} = ${rhs}`)}.`,
      answer: m(`x = ${x}`),
      steps: [m(`Subtract ${b}: ${a}x = ${rhs - b}.`), m(`Divide by ${a}: x = ${x}.`)],
    };
  }

  return {
    problem: `Solve for ${m("x")}: ${m(`x ${signed(b)} = ${x + b}`)}.`,
    answer: m(`x = ${x}`),
    steps: [m(`Undo ${signed(b)} by using the inverse operation.`), m(`x = ${x}.`)],
  };
}

function algebra(difficulty) {
  const type = pick(["quadratic", "slope", "system", "exponents", "vertex"]);

  if (type === "slope") {
    const x1 = rand(-8, 8);
    const y1 = rand(-8, 8);
    const dx = nzero(-6, 6);
    const dy = nzero(-8, 8);
    return {
      problem: `Find the slope of the line through ${m(point(x1, y1))} and ${m(point(x1 + dx, y1 + dy))}.`,
      answer: m(simplifyFraction(dy, dx)),
      steps: [m(`m = ${frac("y₂ − y₁", "x₂ − x₁")}.`), m(`m = ${frac(`${y1 + dy} − ${y1}`, `${x1 + dx} − ${x1}`)} = ${simplifyFraction(dy, dx)}.`)],
    };
  }

  if (type === "system") {
    const x = rand(-5, 7);
    const y = rand(-5, 7);
    let a = rand(1, 6);
    let b = rand(1, 6);
    let c = rand(1, 6);
    let d = rand(1, 6);
    while (a * d - b * c === 0) {
      c = rand(1, 6);
      d = rand(1, 6);
    }
    return {
      problem: `Solve the system ${m(`${a}x + ${b}y = ${a * x + b * y}`)} and ${m(`${c}x + ${d}y = ${c * x + d * y}`)}.`,
      answer: m(`x = ${x}, y = ${y}`),
      steps: [m(`Use elimination or substitution.`), m(`The ordered pair that satisfies both equations is ${point(x, y)}.`)],
    };
  }

  if (type === "exponents") {
    const a = rand(2, 6);
    const b = rand(2, 6);
    return {
      problem: `Simplify ${m(`x${sup(a)} · x${sup(b)}`)}.`,
      answer: m(`x${sup(a + b)}`),
      steps: [m(`When multiplying like bases, add exponents.`), m(`${a} + ${b} = ${a + b}.`)],
    };
  }

  if (type === "vertex") {
    const h = rand(-5, 5);
    const k = rand(-8, 8);
    return {
      problem: `Identify the vertex of ${m(`y = (x ${signed(-h)})${sup(2)} ${signed(k)}`)}.`,
      answer: m(point(h, k)),
      steps: [m(`Vertex form is y = a(x − h)² + k.`), m(`Here h = ${h} and k = ${k}.`)],
    };
  }

  const r1 = nzero(-8, 8);
  const r2 = nzero(-8, 8);
  const b = -(r1 + r2);
  const c = r1 * r2;
  return {
    problem: `Factor and solve ${m(`x${sup(2)} ${signed(b)}x ${signed(c)} = 0`)}.`,
    answer: m(`x = ${r1}, ${r2}`),
    steps: [m(`Factor as (x ${signed(-r1)})(x ${signed(-r2)}) = 0.`), m(`Set each factor equal to 0.`)],
  };
}

function geometry(difficulty) {
  const type = pick(["triangleArea", "circle", "prism", "pythagorean", "angles", "similar", "distance", "surfaceArea"]);

  if (type === "angles") {
    const a = rand(25, 80);
    const b = rand(25, 80);
    return {
      problem: `Two angles in a triangle measure ${m(`${a}°`)} and ${m(`${b}°`)}. Find the third angle.`,
      answer: m(`${180 - a - b}°`),
      steps: [m(`Triangle angles sum to 180°.`), m(`180° − ${a}° − ${b}° = ${180 - a - b}°.`)],
    };
  }

  if (type === "similar") {
    const small = rand(3, 10);
    const big = small * rand(2, difficulty === "hard" ? 8 : 5);
    const side = rand(4, 12);
    return {
      problem: `Similar triangles have corresponding sides ${m(small)} and ${m(big)}. If another small side is ${m(side)}, find the matching large side.`,
      answer: m((big / small) * side),
      steps: [m(`Scale factor = ${big} ÷ ${small} = ${big / small}.`), m(`Large side = ${side} × ${big / small} = ${(big / small) * side}.`)],
    };
  }

  if (type === "distance") {
    const x1 = rand(-8, 8);
    const y1 = rand(-8, 8);
    const dx = pick([3, 4, 5, 6, 8]);
    const dy = pick([4, 6, 8, 12, 15]);
    const distSquared = dx * dx + dy * dy;
    return {
      problem: `Find the distance between ${m(point(x1, y1))} and ${m(point(x1 + dx, y1 + dy))}.`,
      answer: m(root(distSquared)),
      steps: [m(`Use d = √((x₂ − x₁)² + (y₂ − y₁)²).`), m(`d = √(${dx}${sup(2)} + ${dy}${sup(2)}) = ${root(distSquared)}.`)],
    };
  }

  if (type === "surfaceArea") {
    const l = rand(3, 12);
    const w = rand(3, 12);
    const h = rand(3, 12);
    const area = 2 * (l * w + l * h + w * h);
    return {
      problem: `Find the surface area of a rectangular prism with length ${m(l)}, width ${m(w)}, and height ${m(h)}.`,
      answer: m(`${area} square units`),
      steps: [m(`SA = 2lw + 2lh + 2wh.`), m(`SA = 2(${l}·${w}) + 2(${l}·${h}) + 2(${w}·${h}) = ${area}.`)],
    };
  }

  if (type === "circle") {
    const r = rand(3, difficulty === "hard" ? 18 : 10);
    return {
      problem: `Find the circumference and area of a circle with radius ${m(r)}. Leave answers in terms of ${m("π")}.`,
      answer: m(`C = ${2 * r}π, A = ${r * r}π`),
      steps: [m(`C = 2πr = ${2 * r}π.`), m(`A = πr² = ${r * r}π.`)],
    };
  }

  if (type === "prism") {
    const l = rand(4, 14);
    const w = rand(3, 12);
    const h = rand(5, 18);
    return {
      problem: `Find the volume of a rectangular prism with length ${m(l)}, width ${m(w)}, and height ${m(h)}.`,
      answer: m(`${l * w * h} cubic units`),
      steps: [m(`V = lwh.`), m(`V = ${l} × ${w} × ${h} = ${l * w * h}.`)],
    };
  }

  if (type === "pythagorean") {
    const triples = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [9, 40, 41]];
    const [a, b, c] = pick(triples);
    return {
      problem: `A right triangle has legs ${m(a)} and ${m(b)}. Find the hypotenuse.`,
      answer: m(c),
      steps: [m(`a² + b² = c².`), m(`${a}${sup(2)} + ${b}${sup(2)} = ${c * c}.`), m(`c = ${c}.`)],
    };
  }

  const base = rand(6, difficulty === "hard" ? 28 : 16);
  const height = rand(5, difficulty === "hard" ? 24 : 14);
  return {
    problem: `Find the area of a triangle with base ${m(base)} and height ${m(height)}.`,
    answer: m(`${clean((base * height) / 2)} square units`),
    steps: [m(`A = ${frac("1", "2")}bh.`), m(`A = ${frac("1", "2")}(${base})(${height}) = ${clean((base * height) / 2)}.`)],
  };
}

function trigonometry(difficulty) {
  const type = pick(["unitCircle", "rightTriangle", "identity", "radians"]);
  if (type === "rightTriangle") {
    const triples = [[3, 4, 5], [5, 12, 13], [8, 15, 17]];
    const [opp, adj, hyp] = pick(triples);
    const fn = pick(["sin", "cos", "tan"]);
    const ans = fn === "sin" ? frac(opp, hyp) : fn === "cos" ? frac(adj, hyp) : frac(opp, adj);
    return {
      problem: `In a right triangle, relative to angle ${m("θ")}, opposite = ${m(opp)}, adjacent = ${m(adj)}, hypotenuse = ${m(hyp)}. Find ${m(`${fn} θ`)}.`,
      answer: m(ans),
      steps: [m(`${fn} θ uses ${fn === "sin" ? "opposite/hypotenuse" : fn === "cos" ? "adjacent/hypotenuse" : "opposite/adjacent"}.`), m(`${fn} θ = ${ans}.`)],
    };
  }

  if (type === "identity") {
    const value = pick([frac("1", "2"), frac("√3", "2"), frac("√2", "2")]);
    return {
      problem: `If ${m(`sin θ = ${value}`)}, write ${m(`sin${sup(2)} θ + cos${sup(2)} θ`)}.`,
      answer: m("1"),
      steps: [m(`Use the Pythagorean identity.`), m(`sin²θ + cos²θ = 1.`)],
    };
  }

  if (type === "radians") {
    const angle = pick([30, 45, 60, 90, 120, 180, 270]);
    return {
      problem: `Convert ${m(`${angle}°`)} to radians.`,
      answer: m(angle === 180 ? "π" : `${simplifyFraction(angle, 180)}π`),
      steps: [m(`Multiply degrees by ${frac("π", "180")}.`), m(`${angle} × ${frac("π", "180")} = ${angle === 180 ? "π" : `${simplifyFraction(angle, 180)}π`}.`)],
    };
  }

  const angles = difficulty === "easy" ? [30, 45, 60] : [0, 30, 45, 60, 90, 120, 135, 150];
  const angle = pick(angles);
  const values = {
    0: ["0", "1"],
    30: [frac("1", "2"), frac("√3", "2")],
    45: [frac("√2", "2"), frac("√2", "2")],
    60: [frac("√3", "2"), frac("1", "2")],
    90: ["1", "0"],
    120: [frac("√3", "2"), `−${frac("1", "2")}`],
    135: [frac("√2", "2"), `−${frac("√2", "2")}`],
    150: [frac("1", "2"), `−${frac("√3", "2")}`],
  };
  const fn = pick(["sin", "cos"]);
  return {
    problem: `Evaluate ${m(`${fn}(${angle}°)`)} exactly.`,
    answer: m(fn === "sin" ? values[angle][0] : values[angle][1]),
    steps: [m(`Use the unit circle.`), m(`${fn} is the ${fn === "sin" ? "y" : "x"}-coordinate.`)],
  };
}

function precalculus(difficulty) {
  const type = pick(["functionValue", "log", "composition", "inverse", "asymptote"]);

  if (type === "log") {
    const base = rand(2, 5);
    const power = rand(2, difficulty === "hard" ? 5 : 4);
    return {
      problem: `Evaluate ${m(`log${sub(base)}(${base ** power})`)}.`,
      answer: m(power),
      steps: [m(`${base}${sup(power)} = ${base ** power}.`), m(`So log${sub(base)}(${base ** power}) = ${power}.`)],
    };
  }

  if (type === "composition") {
    const a = rand(2, 6);
    const b = rand(-5, 8);
    const x = rand(-4, 6);
    return {
      problem: `Let ${m(`f(x) = ${a}x ${signed(b)}`)} and ${m(`g(x) = x${sup(2)}`)}. Find ${m(`f(g(${x}))`)}.`,
      answer: m(a * x * x + b),
      steps: [m(`g(${x}) = ${x}${sup(2)} = ${x * x}.`), m(`f(${x * x}) = ${a}(${x * x}) ${signed(b)} = ${a * x * x + b}.`)],
    };
  }

  if (type === "inverse") {
    const a = rand(2, 8);
    const b = rand(-9, 9);
    return {
      problem: `Find the inverse of ${m(`f(x) = ${a}x ${signed(b)}`)}.`,
      answer: m(`f${sup("−1")}(x) = ${frac(`x ${signed(-b)}`, a)}`),
      steps: [m(`Set y = ${a}x ${signed(b)}.`), m(`Swap x and y, then solve for y.`)],
    };
  }

  if (type === "asymptote") {
    const h = rand(-6, 6);
    return {
      problem: `Find the vertical asymptote of ${m(`f(x) = ${frac("1", `x ${signed(-h)}`)}`)}.`,
      answer: m(`x = ${h}`),
      steps: [m(`Set the denominator equal to 0.`), m(`x ${signed(-h)} = 0, so x = ${h}.`)],
    };
  }

  const a = rand(2, difficulty === "hard" ? 6 : 4);
  const b = rand(1, 9);
  const x = rand(1, 4);
  return {
    problem: `If ${m(`f(x) = ${a}${sup("x")} + ${b}`)}, evaluate ${m(`f(${x})`)}.`,
    answer: m(a ** x + b),
    steps: [m(`f(${x}) = ${a}${sup(x)} + ${b}.`), m(`${a ** x} + ${b} = ${a ** x + b}.`)],
  };
}

function calc1(difficulty) {
  const type = pick(["powerDerivative", "productDerivative", "chainDerivative", "integral", "limit", "tangent"]);

  if (type === "productDerivative") {
    const a = rand(2, 7);
    return {
      problem: `Differentiate ${m(`f(x) = x${sup(2)} sin(${a}x)`)}.`,
      answer: m(`f′(x) = 2x sin(${a}x) + ${a}x${sup(2)} cos(${a}x)`),
      steps: [m(`Use the product rule.`), m(`Differentiate x² and sin(${a}x), then add the two products.`)],
    };
  }

  if (type === "chainDerivative") {
    const a = rand(2, 7);
    const p = rand(2, 5);
    return {
      problem: `Differentiate ${m(`y = (${a}x + 1)${sup(p)}`)}.`,
      answer: m(`y′ = ${a * p}(${a}x + 1)${sup(p - 1)}`),
      steps: [m(`Use the chain rule.`), m(`Bring down ${p}, reduce the power, and multiply by inner derivative ${a}.`)],
    };
  }

  if (type === "integral") {
    const c = rand(2, 9);
    const p = rand(1, difficulty === "hard" ? 6 : 4);
    return {
      problem: `Find ${m(`∫ ${c}x${sup(p)} dx`)}.`,
      answer: m(`${simplifyFraction(c, p + 1)}x${sup(p + 1)} + C`),
      steps: [m(`Increase the power to ${p + 1}.`), m(`Divide by the new power.`)],
    };
  }

  if (type === "limit") {
    const a = rand(1, 6);
    return {
      problem: `Evaluate ${m(`lim${sub(`x→${a}`)} ${frac(`x${sup(2)} − ${a * a}`, `x − ${a}`)}`)}.`,
      answer: m(2 * a),
      steps: [m(`Factor: x² − ${a * a} = (x − ${a})(x + ${a}).`), m(`Cancel and substitute: ${a} + ${a} = ${2 * a}.`)],
    };
  }

  if (type === "tangent") {
    const a = rand(1, 5);
    return {
      problem: `Find the slope of the tangent line to ${m(`y = x${sup(2)} + 3x`)} at ${m(`x = ${a}`)}.`,
      answer: m(2 * a + 3),
      steps: [m(`Derivative: y′ = 2x + 3.`), m(`At x = ${a}, slope = ${2 * a} + 3 = ${2 * a + 3}.`)],
    };
  }

  const c = rand(2, 8);
  const p = rand(difficulty === "easy" ? 2 : 3, difficulty === "hard" ? 7 : 5);
  return {
    problem: `Differentiate ${m(`f(x) = ${c}x${sup(p)}`)}.`,
    answer: m(`f′(x) = ${c * p}x${sup(p - 1)}`),
    steps: [m(`Use the power rule.`), m(`${c} · ${p} = ${c * p}, and ${p} − 1 = ${p - 1}.`)],
  };
}

function calc2(difficulty) {
  const type = pick(["parts", "series", "polar", "improper", "partialFraction", "arcLength"]);

  if (type === "improper") {
    const p = rand(2, 5);
    return {
      problem: `Determine whether ${m(`∫${sub("1")}${sup("∞")} ${frac("1", `x${sup(p)}`)} dx`)} converges.`,
      answer: m(`Converges to ${simplifyFraction(1, p - 1)}`),
      steps: [m(`This is a p-integral with p = ${p}.`), m(`Since p > 1, it converges.`)],
    };
  }

  if (type === "partialFraction") {
    const a = rand(2, 6);
    return {
      problem: `Decompose ${m(frac(`${a + 1}x + ${a}`, `x(x + 1)`))} into partial fractions.`,
      answer: m(`${frac(a, "x")} + ${frac("1", "x + 1")}`),
      steps: [m(`Write ${frac(`${a + 1}x + ${a}`, `x(x + 1)`)} = ${frac("A", "x")} + ${frac("B", "x + 1")}.`), m(`Solving gives A = ${a}, B = 1.`)],
    };
  }

  if (type === "arcLength") {
    const a = rand(2, 6);
    return {
      problem: `For the parametric curve ${m(`x = ${a}t, y = t${sup(2)}`)}, find ${m(frac("dy", "dx"))}.`,
      answer: m(frac("2t", a)),
      steps: [m(`${frac("dy", "dt")} = 2t and ${frac("dx", "dt")} = ${a}.`), m(`${frac("dy", "dx")} = ${frac("dy/dt", "dx/dt")} = ${frac("2t", a)}.`)],
    };
  }

  if (type === "parts") {
    const n = rand(2, difficulty === "hard" ? 7 : 5);
    return {
      problem: `Use integration by parts to find ${m(`∫ x e${sup(`${n}x`)} dx`)}.`,
      answer: m(`${frac(`e${sup(`${n}x`)}(${n}x − 1)`, n * n)} + C`),
      steps: [m(`Let u = x and dv = e${sup(`${n}x`)} dx.`), m(`Then du = dx and v = ${frac(`e${sup(`${n}x`)}`, n)}.`), m(`Apply uv − ∫v du.`)],
    };
  }

  if (type === "series") {
    const r = pick([2, 3, 4, 5]);
    return {
      problem: `Find the sum of ${m(`Σ${sub("n=0")}${sup("∞")} (${frac("1", r)})${sup("n")}`)}.`,
      answer: m(simplifyFraction(r, r - 1)),
      steps: [m(`Geometric ratio r = ${frac("1", r)}.`), m(`Sum = ${frac("1", `1 − ${frac("1", r)}`)} = ${simplifyFraction(r, r - 1)}.`)],
    };
  }

  const a = rand(2, 6);
  return {
    problem: `Find the area inside the polar curve ${m(`r = ${a}`)}.`,
    answer: m(`${a * a}π square units`),
    steps: [m(`r = ${a} is a circle of radius ${a}.`), m(`Area = πr² = ${a * a}π.`)],
  };
}

function calc3(difficulty) {
  const type = pick(["partial", "gradient", "cross", "directional", "doubleIntegral", "divergence"]);

  if (type === "directional") {
    const a = rand(2, 6);
    const b = rand(2, 6);
    return {
      problem: `Find the directional derivative of ${m(`f(x,y)= ${a}x${sup(2)} + ${b}y${sup(2)}`)} at ${m(point(1, 1))} in the unit direction ${m(vec(frac("3", "5"), frac("4", "5")))}.`,
      answer: m(simplifyFraction(6 * a + 8 * b, 5)),
      steps: [m(`∇f = ${vec(`${2 * a}x`, `${2 * b}y`)}.`), m(`At (1,1): ${vec(2 * a, 2 * b)}.`), m(`Dot with direction vector.`)],
    };
  }

  if (type === "doubleIntegral") {
    const a = rand(2, 7);
    const b = rand(2, 7);
    return {
      problem: `Evaluate ${m(`∫${sub("0")}${sup(a)} ∫${sub("0")}${sup(b)} x dy dx`)}.`,
      answer: m((b * a * a) / 2),
      steps: [m(`Inner integral: ∫ x dy = xy from 0 to ${b}, giving ${b}x.`), m(`Outer integral: ∫₀${sup(a)} ${b}x dx = ${clean((b * a * a) / 2)}.`)],
    };
  }

  if (type === "divergence") {
    const a = rand(2, 6);
    const b = rand(2, 6);
    return {
      problem: `Find the divergence of ${m(`F = ${vec(`${a}x`, `${b}y`, "z")}`)}.`,
      answer: m(a + b + 1),
      steps: [m(`div F = ∂/∂x(${a}x) + ∂/∂y(${b}y) + ∂/∂z(z).`), m(`${a} + ${b} + 1 = ${a + b + 1}.`)],
    };
  }

  if (type === "partial") {
    const a = rand(2, 7);
    const b = rand(2, 7);
    return {
      problem: `For ${m(`f(x,y) = ${a}x${sup(2)}y + ${b}xy${sup(3)}`)}, find ${m(frac("∂f", "∂x"))}.`,
      answer: m(`${2 * a}xy + ${b}y${sup(3)}`),
      steps: [m(`Treat y as a constant.`), m(`${frac("∂", "∂x")}(${a}x²y) = ${2 * a}xy.`), m(`${frac("∂", "∂x")}(${b}xy³) = ${b}y³.`)],
    };
  }

  if (type === "gradient") {
    const a = rand(2, 6);
    const b = rand(2, 6);
    return {
      problem: `Find ${m("∇f")} for ${m(`f(x,y,z) = ${a}x${sup(2)} + ${b}y${sup(2)} + z${sup(2)}`)}.`,
      answer: m(vec(`${2 * a}x`, `${2 * b}y`, "2z")),
      steps: [m(`Take one partial derivative for each variable.`), m(`∇f = ${vec(`${2 * a}x`, `${2 * b}y`, "2z")}.`)],
    };
  }

  const vectors = [[[1, 2, 3], [2, 1, 4]], [[3, -1, 2], [0, 5, 1]], [[2, 4, -1], [1, 0, 3]]];
  const [u, v] = pick(vectors);
  const cross = [
    u[1] * v[2] - u[2] * v[1],
    u[2] * v[0] - u[0] * v[2],
    u[0] * v[1] - u[1] * v[0],
  ];
  return {
    problem: `Find ${m("u × v")} for ${m(`u = ${vec(...u)}`)} and ${m(`v = ${vec(...v)}`)}.`,
    answer: m(vec(...cross)),
    steps: [m(`Use the 3D cross product determinant.`), m(`u × v = ${vec(...cross)}.`)],
  };
}

const generators = {
  arithmetic,
  fractions,
  prealgebra,
  algebra,
  geometry,
  trigonometry,
  precalculus,
  calc1,
  calc2,
  calc3,
};

function generateProblem(topic, difficulty) {
  if (topic === "mixed") {
    const available = Object.keys(generators);
    return generators[pick(available)](difficulty);
  }
  return generators[topic](difficulty);
}

function renderProblems() {
  const topic = topics.find((item) => item.id === state.topic);
  setTitle.textContent = topic.name;
  statLevel.textContent = state.difficulty[0].toUpperCase() + state.difficulty.slice(1);
  statCount.textContent = `${state.count}`;
  statScope.textContent = topic.scope;

  problemList.innerHTML = "";
  const fragment = document.createDocumentFragment();
  for (let i = 1; i <= state.count; i += 1) {
    const item = generateProblem(state.topic, state.difficulty);
    const card = document.createElement("article");
    card.className = "problem-card";
    card.innerHTML = `
      <div class="problem-main">
        <div class="problem-number">${i}</div>
        <div class="problem-text">${item.problem}</div>
      </div>
      <div class="answer-block ${state.showAnswers ? "" : "hidden"}">
        <strong>Answer</strong>
        ${item.answer}
      </div>
      <div class="steps-block ${state.showSteps ? "" : "hidden"}">
        <strong>Worked steps</strong>
        ${item.steps.map((step) => `<div>${step}</div>`).join("")}
      </div>
    `;
    fragment.appendChild(card);
  }
  problemList.appendChild(fragment);
}

function init() {
  topics.forEach((topic) => {
    const option = document.createElement("option");
    option.value = topic.id;
    option.textContent = topic.name;
    topicSelect.appendChild(option);
  });

  topicSelect.addEventListener("change", (event) => {
    state.topic = event.target.value;
    renderProblems();
  });

  document.querySelectorAll("[data-difficulty]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-difficulty]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      state.difficulty = button.dataset.difficulty;
      renderProblems();
    });
  });

  countInput.addEventListener("input", (event) => {
    state.count = Number(event.target.value);
    countValue.textContent = `${state.count}`;
    renderProblems();
  });

  stepsToggle.addEventListener("change", (event) => {
    state.showSteps = event.target.checked;
    renderProblems();
  });

  answersToggle.addEventListener("change", (event) => {
    state.showAnswers = event.target.checked;
    renderProblems();
  });

  document.querySelector("#generateBtn").addEventListener("click", renderProblems);
  document.querySelector("#printBtn").addEventListener("click", () => window.print());

  renderProblems();
}

init();
