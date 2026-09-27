export type HeroPhase = "arrival" | "reveal" | "handoff";

export interface HeroProgressPayload {
	progress: number;
	cameraProgress: number;
	phase: HeroPhase;
	direction: -1 | 0 | 1;
}

export interface HeroSceneReadyPayload {
	webgl: boolean;
	reducedMotion: boolean;
}

export interface HeroChapterPayload {
	chapter: "hero";
	progress?: number;
}
