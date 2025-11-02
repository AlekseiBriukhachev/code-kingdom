import {
    challengeResponse,
    codeSubmissionResponse,
    gameStateResponse,
    moduleResponse,
} from "./responses";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const apiServiceMock = {
    get: async (url) => {
        console.log("[Mock API GET]", url);
        await delay(300); // simulate network delay

        if (url.startsWith("/game-state/")) {
            return gameStateResponse;
        }

        if (url.startsWith("/modules")) {
            return moduleResponse;
        }

        if (url.startsWith("/challenge")) {
            return challengeResponse;
        }

        return { message: "Unknown GET endpoint" };
    },

    post: async (url, body) => {
        console.log("[Mock API POST]", url, body);
        await delay(300);

        if (url === "/challenge/submit") {
            return codeSubmissionResponse;
        }

        return { success: false, message: "Unknown POST endpoint" };
    },
};