"use client";

import { useState, useEffect, useRef } from "react";

// Types
type PermType = "eyelash" | "under";
type Coverage = "none" | "slight" | "heavy";
type Thickness = "thin" | "thick";
type Direction = "down" | "average" | "up";

interface Result {
  curl: string;
  rodDirection: string;
  size: string;
  directionTip?: string;
  note: string;
}

// Decision matrix
function getResult(
  coverage: Coverage,
  thickness: Thickness,
  direction: Direction
): Result {
  const directionTip =
    coverage !== "none"
      ? "롯드의 앞머리쪽 두께가 많이 얇은 롯드를 사용 할 경우 역방향으로 시술하세요."
      : undefined;

  const rodDir = coverage === "none" ? "정방향" : "정방향 / 역방향";

  // Curl
  let curl: string;
  if (direction === "down") {
    curl = thickness === "thin" ? "물방울 C컬 / L컬" : "물방울 C컬";
  } else {
    curl = thickness === "thin" ? "모든 컬 가능" : "C컬 롯드 모두 가능";
  }

  // Size
  let size: string;
  if (direction === "down") {
    if (coverage === "heavy" && thickness === "thin") {
      size = "물방울 C컬 - 다운, L컬 - 업";
    } else {
      size = "사이즈 다운";
    }
  } else if (direction === "average") {
    size = "정사이즈";
  } else {
    size = "사이즈 업";
  }

  // Note
  let note: string;
  if (coverage === "none") {
    if (direction === "down") {
      if (thickness === "thin") {
        note =
          "극하향모는 뿌리 부분이 많이 처져있어 롯드를 타이트하게 사용해야 컬이 잘 나와요!";
      } else {
        note =
          "극하향모는 뿌리가 처져있어 롯드를 타이트하게 사용해야 컬이 잘 나와요!";
      }
    } else if (direction === "average") {
      if (thickness === "thin") {
        note = "뿌리 덮임이 없는 눈은 자유로운 컬 선택이 가능해요!";
      } else {
        note =
          "롱래쉬인 경우에는 컬 상관없이 모든 롯드 사용 가능해요!";
      }
    } else {
      if (thickness === "thin") {
        note =
          "극상향모는 뿌리가 들려있어 롯드를 넉넉하게 사용해야 눈두덩에 닿지 않아요!";
      } else {
        note =
          "롱래쉬인 경우에는 컬 상관없이 모든 롯드 사용 가능해요!";
      }
    }
  } else if (coverage === "slight") {
    if (direction === "down") {
      if (thickness === "thin") {
        note =
          "뿌리가 처져있다면? 컬이 루즈하게 나오므로 사이즈를 타이트하게 사용하세요!";
      } else {
        note =
          "뿌리가 처져있어 컬이 루즈하게 나오므로 사이즈를 타이트하게 사용하세요!";
      }
    } else if (direction === "average") {
      if (thickness === "thin") {
        note = "롯드 방향만 주의해주세요!";
      } else {
        note = "";
      }
    } else {
      note =
        "뿌리가 들려있어 컬이 과하게 나오므로 사이즈를 넉넉하게 사용하세요!";
    }
  } else {
    // heavy
    if (direction === "down") {
      note = "이 눈매는 잘 나오는 컬과 사이즈가 정해져 있어요.";
    } else if (direction === "average") {
      if (thickness === "thin") {
        note =
          "모든 컬이 가능하지만 되도록이면 롯드의 하단 두께가 통통하게 디자인 된 롯드를 선택하세요!";
      } else {
        note =
          "눈두덩 두께가 두꺼우므로 공간감이 많은 C컬 사용해야 안전합니다.";
      }
    } else {
      if (thickness === "thin") {
        note =
          "모든 컬이 가능하지만 되도록이면 롯드의 하단 두께가 통통하게 디자인 된 롯드를 선택하세요!";
      } else {
        note =
          "눈두덩 두께가 두꺼우므로 공간감이 많은 C컬 사용해야 안전합니다.";
      }
    }
  }

  return { curl, rodDirection: rodDir, size, directionTip, note };
}

const coverageLabels: Record<Coverage, string> = {
  none: "덮인 곳 없음",
  slight: "조금 덮임",
  heavy: "많이 덮임",
};

const thicknessLabels: Record<Thickness, string> = {
  thin: "얇음",
  thick: "두꺼움",
};

const directionLabels: Record<Direction, string> = {
  down: "극하향",
  average: "평균",
  up: "극상향",
};

const underCoverageLabels: Record<Coverage, string> = {
  none: "평범 눈매",
  slight: "",
  heavy: "주의 눈매",
};

export default function Diagnosis() {
  const [permType, setPermType] = useState<PermType | null>(null);
  const [coverage, setCoverage] = useState<Coverage | null>(null);
  const [thickness, setThickness] = useState<Thickness | null>(null);
  const [direction, setDirection] = useState<Direction | null>(null);

  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const isUnderPerm = permType === "under";

  let currentStep: number;
  if (isUnderPerm) {
    currentStep = coverage === null ? 1 : 2;
  } else {
    currentStep =
      coverage === null ? 1 : thickness === null ? 2 : direction === null ? 3 : 4;
  }

  const totalSteps = isUnderPerm ? 1 : 3;
  const progress = ((Math.min(currentStep, totalSteps + 1) - 1) / totalSteps) * 100;

  const eyelashDone =
    permType === "eyelash" &&
    coverage !== null &&
    thickness !== null &&
    direction !== null;
  const allSelected = eyelashDone;

  const result =
    permType === "eyelash" && coverage !== null && thickness !== null && direction !== null
      ? getResult(coverage, thickness, direction)
      : null;

  useEffect(() => {
    if (currentStep === 2 && step2Ref.current) {
      step2Ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (currentStep === 3 && step3Ref.current) {
      step3Ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (currentStep === 4 && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentStep]);

  const selectPermType = (type: PermType) => {
    setPermType(type);
    setCoverage(null);
    setThickness(null);
    setDirection(null);
  };

  const reset = () => {
    setPermType(null);
    setCoverage(null);
    setThickness(null);
    setDirection(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removeCoverage = () => {
    setCoverage(null);
    setThickness(null);
    setDirection(null);
  };

  const removeThickness = () => {
    setThickness(null);
    setDirection(null);
  };

  const removeDirection = () => {
    setDirection(null);
  };

  const goBack = () => {
    if (direction !== null) {
      setDirection(null);
    } else if (thickness !== null) {
      setThickness(null);
    } else if (coverage !== null) {
      setCoverage(null);
    } else {
      setPermType(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="text-center flex flex-col gap-2">
        <p className="text-pink text-sm font-semibold tracking-wider">
          수수스튜디오뷰티
        </p>
        <h1 className="text-2xl font-bold text-white"><span className="text-pink">롯드 선정</span> 진단기</h1>
        <p className="text-sm text-zinc-400">
          눈매와 속눈썹 상태에 맞는 최적의 롯드를 추천해드려요
        </p>
      </div>

      {/* Progress bar */}
      {permType !== null && (
        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-pink rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Selected tags */}
      {permType !== null && (coverage || thickness || direction) && (
        <div className="flex flex-wrap gap-2">
          {permType === "under" && coverage && (
            <Tag label={underCoverageLabels[coverage]} onRemove={removeCoverage} />
          )}
          {permType === "eyelash" && coverage && (
            <Tag label={coverageLabels[coverage]} onRemove={removeCoverage} />
          )}
          {permType === "eyelash" && thickness && (
            <Tag label={thicknessLabels[thickness]} onRemove={removeThickness} />
          )}
          {permType === "eyelash" && direction && (
            <Tag label={directionLabels[direction]} onRemove={removeDirection} />
          )}
        </div>
      )}

      {/* Perm type selection (first screen) */}
      {permType === null && (
        <div className="flex flex-col gap-4 mt-2">
          <div>
            <h2 className="text-lg font-bold text-white text-center">
              어떤 시술을 진단할까요?
            </h2>
            <p className="text-sm text-zinc-400 text-center mt-1">
              시술 종류를 선택해주세요
            </p>
          </div>
          <button
            type="button"
            onClick={() => selectPermType("eyelash")}
            className="w-full py-6 rounded-2xl bg-zinc-900 border-2 border-zinc-800 active:border-pink active:bg-zinc-800/80 cursor-pointer text-center"
            style={{ WebkitUserSelect: "none", userSelect: "none" }}
          >
            <span className="text-2xl">👁</span>
            <p className="font-bold text-white text-lg mt-2">속눈썹펌</p>
            <p className="text-xs text-zinc-400 mt-1">윗속눈썹 컬링 시술</p>
          </button>
          <button
            type="button"
            onClick={() => selectPermType("under")}
            className="w-full py-6 rounded-2xl bg-zinc-900 border-2 border-zinc-800 active:border-pink active:bg-zinc-800/80 cursor-pointer text-center"
            style={{ WebkitUserSelect: "none", userSelect: "none" }}
          >
            <span className="text-2xl">👀</span>
            <p className="font-bold text-white text-lg mt-2">언더펌</p>
            <p className="text-xs text-zinc-400 mt-1">아래속눈썹 컬링 시술</p>
          </button>
        </div>
      )}

      {/* STEP 1 - 속눈썹펌 */}
      {permType === "eyelash" && currentStep >= 1 && !allSelected && coverage === null && (
        <div className="flex flex-col gap-4">
          <BackButton onClick={goBack} />
          <div>
            <p className="text-pink text-xs font-bold mb-1">STEP 1</p>
            <h2 className="text-lg font-bold text-white">
              속눈썹 뿌리가
              <br />
              얼마나 덮여있나요?
            </h2>
          </div>
          <OptionCard
            emoji="👁"
            label="덮인 곳 없음"
            desc="뿌리가 모두 잘 보임"
            onClick={() => setCoverage("none")}
          />
          <OptionCard
            emoji="👁"
            label="조금 덮임"
            desc="앞머리만, 또는 전체적으로 1mm정도 덮여있음"
            onClick={() => setCoverage("slight")}
          />
          <OptionCard
            emoji="😑"
            label="많이 덮임"
            desc="뿌리가 2mm 이상 많이 덮어있는 눈"
            onClick={() => setCoverage("heavy")}
          />
        </div>
      )}

      {/* STEP 1 - 언더펌 */}
      {permType === "under" && currentStep >= 1 && !allSelected && coverage === null && (
        <div className="flex flex-col gap-4">
          <BackButton onClick={goBack} />
          <div>
            <p className="text-pink text-xs font-bold mb-1">STEP 1</p>
            <h2 className="text-lg font-bold text-white">
              눈매 형태는
              <br />
              어떤가요?
            </h2>
          </div>
          <OptionCard
            emoji="👁"
            label="평범 눈매"
            desc="정면 - 뿌리부분 잘 보임 / 측면 - 뿌리 방향이 정면으로 향함"
            onClick={() => setCoverage("none")}
          />
          <OptionCard
            emoji="⚠️"
            label="주의 눈매 (애교살/안검내반)"
            desc="정면 - 속눈썹 잘 안보임 / 측면 - 뿌리 방향이 천장으로 향함"
            onClick={() => setCoverage("heavy")}
          />
        </div>
      )}

      {/* STEP 2 - 속눈썹펌 */}
      {permType === "eyelash" && currentStep >= 2 && !allSelected && thickness === null && (
        <div ref={step2Ref} className="flex flex-col gap-4">
          <BackButton onClick={goBack} />
          <div>
            <p className="text-pink text-xs font-bold mb-1">STEP 2</p>
            <h2 className="text-lg font-bold text-white">
              눈두덩 두께는 어떤가요?
            </h2>
          </div>
          <OptionCard
            emoji="🪶"
            label="얇음"
            desc="눈두덩 두께가 1mm 이하로 얇은 두께"
            onClick={() => setThickness("thin")}
          />
          <OptionCard
            emoji="💪"
            label="두꺼움"
            desc="눈두덩 두께가 2mm 이상 통통한 두께"
            onClick={() => setThickness("thick")}
          />
        </div>
      )}

      {/* STEP 2 - 언더펌 평범눈매 */}
      {permType === "under" && coverage === "none" && currentStep >= 2 && (
        <div ref={step2Ref} className="flex flex-col gap-4">
          <BackButton onClick={goBack} />
          <div>
            <p className="text-pink text-xs font-bold mb-1">STEP 2</p>
            <h2 className="text-lg font-bold text-white">
              추천 롯드를 확인해주세요
            </h2>
          </div>
          <div className="rounded-xl px-4 py-3" style={{ backgroundColor: "rgba(255, 45, 120, 0.08)" }}>
            <p className="text-sm text-pink font-bold">컬 상관없음 / 정사이즈</p>
          </div>
          <InfoCard
            emoji="⬇️"
            label="바짝!! 내려주세요"
            desc="U컬, L컬 롯드 중 선택"
          />
          <InfoCard
            emoji="〰️"
            label="둥글, 자연스러운게 좋아요"
            desc="C컬 롯드 중 선택"
          />
          <div className="rounded-xl bg-zinc-900 px-4 py-3">
            <p className="text-sm text-zinc-300">
              💡 <span className="text-pink font-bold">언더래쉬가 길거나, 애교살 있는/심한 사람 C컬 OK</span>
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="w-full py-4 rounded-full border-2 border-pink text-pink font-bold text-lg text-center cursor-pointer active:bg-pink active:text-white mt-2"
            style={{ WebkitUserSelect: "none", userSelect: "none" }}
          >
            다시 진단하기
          </button>
        </div>
      )}

      {/* STEP 2 - 언더펌 주의 눈매 */}
      {permType === "under" && coverage === "heavy" && currentStep >= 2 && (
        <div ref={step2Ref} className="flex flex-col gap-4">
          <BackButton onClick={goBack} />
          <div>
            <p className="text-pink text-xs font-bold mb-1">STEP 2</p>
            <h2 className="text-lg font-bold text-white">
              추천 롯드를 확인해주세요
            </h2>
          </div>
          <div className="rounded-xl px-4 py-3" style={{ backgroundColor: "rgba(255, 45, 120, 0.08)" }}>
            <p className="text-sm text-pink font-bold">
              C컬, L컬만 /{" "}
              <span
                style={{
                  textDecoration: "underline wavy",
                  textDecorationColor: "#ff2d78",
                  textUnderlineOffset: "4px",
                }}
              >
                사이즈 다운
              </span>
            </p>
          </div>
          <InfoCard
            emoji="👁"
            label="안검내반만"
            desc="물방울 C컬, L컬 사용 가능"
          />
          <InfoCard
            emoji="✨"
            label="안검내반 + 애교살"
            desc="만능 C컬 or 로만사 C컬 역방향"
          />
          <div className="rounded-xl bg-zinc-900 px-4 py-3">
            <p className="text-sm text-zinc-300">
              ⚠️ <span className="text-pink font-bold">안검내반은 U컬 사용 X</span>
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="w-full py-4 rounded-full border-2 border-pink text-pink font-bold text-lg text-center cursor-pointer active:bg-pink active:text-white mt-2"
            style={{ WebkitUserSelect: "none", userSelect: "none" }}
          >
            다시 진단하기
          </button>
        </div>
      )}

      {/* STEP 3 - 속눈썹펌 */}
      {permType === "eyelash" && currentStep >= 3 && !allSelected && direction === null && (
        <div ref={step3Ref} className="flex flex-col gap-4">
          <BackButton onClick={goBack} />
          <div>
            <p className="text-pink text-xs font-bold mb-1">STEP 3</p>
            <h2 className="text-lg font-bold text-white">
              속눈썹 뿌리의 방향은?
            </h2>
          </div>
          <OptionCard
            emoji="⬇️"
            label="극하향"
            desc="속눈썹 뿌리가 바닥을 보고 자라는 형태"
            onClick={() => setDirection("down")}
          />
          <OptionCard
            emoji="➡️"
            label="평균"
            desc="일반적인 속눈썹 뿌리 방향"
            onClick={() => setDirection("average")}
          />
          <OptionCard
            emoji="⬆️"
            label="극상향"
            desc="속눈썹 뿌리가 거의 정면을 보고 자라는 형태"
            onClick={() => setDirection("up")}
          />
        </div>
      )}

      {/* Result - 속눈썹펌 */}
      {permType === "eyelash" && allSelected && result && (
        <div ref={resultRef} className="flex flex-col gap-5">
          <div className="text-center">
            <h2 className="text-xl font-bold text-white">✨ 추천 결과</h2>
            <p className="text-sm text-zinc-400 mt-1">
              선택하신 조건에 맞는 롯드 추천이에요
            </p>
          </div>

          {/* Result table */}
          <div className="border border-pink rounded-xl overflow-hidden">
            <ResultRow label="추천 컬" value={result.curl} />
            <ResultRow label="롯드 방향" value={result.rodDirection} />
            <ResultRow label="추천 사이즈" value={result.size} isLast />
          </div>

          {/* Direction tip */}
          {result.directionTip && (
            <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(255, 45, 120, 0.05)" }}>
              <p className="text-yellow text-sm font-bold mb-2">
                💡 <span className="text-pink">롯드 방향 참고</span>
              </p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {result.directionTip}
              </p>
            </div>
          )}

          {/* Note */}
          {result.note && (
            <div className="bg-zinc-900 rounded-xl p-4">
              <p className="text-pink text-sm font-bold mb-2">🔍 참고사항</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {result.note}
              </p>
            </div>
          )}

          {/* Disclaimer */}
          <div className="text-xs text-zinc-600 leading-relaxed space-y-2">
            <p>
              * 위의 추천 결과는 길이 상관없이 모두 적용하고, 극손상모의 경우
              적용 제외합니다. (극손상모는 선택법 상이)
            </p>
          </div>

          {/* Reset button */}
          <button
            type="button"
            onClick={reset}
            className="w-full py-4 rounded-full border-2 border-pink text-pink font-bold text-lg text-center cursor-pointer active:bg-pink active:text-white"
            style={{ WebkitUserSelect: "none", userSelect: "none" }}
          >
            다시 진단하기
          </button>

        </div>
      )}

    </div>
  );
}

function InfoCard({
  emoji,
  label,
  desc,
}: {
  emoji: string;
  label: string;
  desc: string;
}) {
  return (
    <div className="w-full text-left p-4 rounded-xl bg-zinc-900 border border-zinc-800">
      <div className="flex items-start gap-3">
        <span className="text-lg">{emoji}</span>
        <div>
          <p className="font-bold text-white">{label}</p>
          <p className="text-sm text-zinc-400 mt-0.5">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="self-start flex items-center gap-1.5 pl-1.5 pr-3 py-1.5 rounded-full bg-pink text-white text-sm font-bold cursor-pointer active:opacity-70"
      style={{ WebkitUserSelect: "none", userSelect: "none" }}
    >
      <span className="text-sm leading-none">⬅️</span>
      <span>이전 단계</span>
    </button>
  );
}

function Tag({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink text-white text-sm font-medium cursor-pointer active:opacity-70"
      style={{ WebkitUserSelect: "none", userSelect: "none" }}
    >
      {label}
      <span className="text-white/70">×</span>
    </button>
  );
}

function OptionCard({
  emoji,
  label,
  desc,
  onClick,
}: {
  emoji: string;
  label: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left p-4 rounded-xl bg-zinc-900 border border-zinc-800 active:border-pink active:bg-zinc-800/80 cursor-pointer"
      style={{ WebkitUserSelect: "none", userSelect: "none" }}
    >
      <div className="flex items-start gap-3">
        <span className="text-lg">{emoji}</span>
        <div>
          <p className="font-bold text-white">{label}</p>
          <p className="text-sm text-zinc-400 mt-0.5">{desc}</p>
        </div>
      </div>
    </button>
  );
}

function ResultRow({
  label,
  value,
  isLast = false,
}: {
  label: string;
  value: string;
  isLast?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between px-5 py-4 ${
        !isLast ? "border-b border-zinc-800" : ""
      }`}
    >
      <span className="text-sm text-zinc-400">{label}</span>
      <span className="text-sm font-bold text-pink">{value}</span>
    </div>
  );
}
