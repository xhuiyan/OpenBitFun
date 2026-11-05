/** Opt-in StarMate identity and motion, separate from generic UI controls. */
export { StarMateSolidMark, StarMateAppIcon, type StarMateArtworkProps } from "./brand/StarMateArtwork";
export { StarMateMark, type StarMateMarkProps } from "./brand/StarMateMark";
export { StarMateBrandMotion, type StarMateBrandMotionProps } from "./brand/StarMateBrandMotion";
export { VoiceParticleLogo, type VoiceParticleLogoProps, type VoiceParticleAudio, type VoiceParticleAudioReader } from "./brand/VoiceParticleLogo";

export * from "./brand/subagent/subagentMotion";
export { createSubagentMotionPlayer, type SubagentMotionPlayer } from "./brand/subagent/subagentMotionPlayer";
export { useSubagentAvatarMotion } from "./brand/subagent/useSubagentAvatarMotion";
export { SubagentHatch, type SubagentHatchProps } from "./brand/subagent/SubagentHatch";
export type { SubagentHatchPhase } from "./brand/subagent/subagentHatchMotion";
