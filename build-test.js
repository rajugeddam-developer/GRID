import { build } from 'vite';

async function runBuild() {
    try {
        console.log("Starting Vite Build...");
        await build();
        console.log("Build successful!");
    } catch (e) {
        console.error("Build failed:", e);
    }
}

runBuild();
