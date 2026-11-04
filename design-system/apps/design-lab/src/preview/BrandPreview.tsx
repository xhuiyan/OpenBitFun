import { StarMateAppIcon, StarMateSolidMark, StarMateBrandMotion, StarMateMark, SubagentHatch } from "@starmate/ui/brand";
import { SUBAGENT_AVATAR_CATALOG } from "../assets/subagentAvatars";
import { VoiceParticlePreview } from "../components/VoiceCallPreview";

export function BrandPreview({ name, state = "playing", active = true }: { name: string; state?: string; active?: boolean }) {
  const playing = active && state !== "paused" && state !== "reduced-motion";
  switch (name) {
    case "StarMateSolidMark":
      return <div className="lab-brand-solid-stage"><StarMateSolidMark size={160} /></div>;
    case "StarMateAppIcon":
      return <StarMateAppIcon size={128} />;
    case "StarMateMark":
      return <StarMateMark motion={state === "static" ? "none" : "breathe"} active={playing} size={120} />;
    case "StarMateBrandMotion":
      if (["construction", "counter-rotate", "paused", "reduced-motion"].includes(state)) {
        return <div style={{ display: "flex", alignItems: "center", gap: "var(--openbitfun-space-4)" }}>
          {[10, 12, 14, 16, 24, 32].map(size => (
            <StarMateBrandMotion key={size} variant={state === "counter-rotate" ? "counter-rotate" : "construction"} active={playing} size={size} />
          ))}
        </div>;
      }
      return <StarMateBrandMotion active={playing} size={160} />;
    case "SubagentHatch":
      return <SubagentHatch phase={state === "ready" ? "ready" : state === "stopped" ? "stopped" : "incubating"} active={playing} size={96}>
        <img src={SUBAGENT_AVATAR_CATALOG[0]!.src} width={96} height={96} alt="" />
      </SubagentHatch>;
    case "VoiceParticleLogo":
      return <VoiceParticlePreview active={playing} />;
    default:
      return null;
  }
}

export function brandCodeSample(name: string): string {
  const usage = name === "StarMateSolidMark" || name === "StarMateAppIcon"
    ? `<${name} size={128} label="OpenBitFun" />`
    : name === "StarMateMark"
    ? '<StarMateMark size={120} motion="breathe" active={isLoading} />'
    : name === "StarMateBrandMotion"
      ? '<StarMateBrandMotion variant="construction" size={16} active={isLoading} />'
      : name === "SubagentHatch"
        ? '<SubagentHatch phase={isCreated ? "ready" : "incubating"} size={32}>\n  {avatar}\n</SubagentHatch>'
        : '<VoiceParticleLogo active={isCallActive} readAudio={readAudio} />';
  return `import { ${name} } from "@starmate/ui/brand";\nimport "@starmate/ui/styles.css";\n\n${usage}`;
}
