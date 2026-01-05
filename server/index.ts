import { spawn } from "child_process";

async function startFlask() {
  console.log("Starting Flask server...");
  const flask = spawn("python3", ["main.py"], {
    stdio: "inherit",
    env: { ...process.env, PORT: "5000" }
  });

  flask.on("close", (code) => {
    console.log(`Flask server exited with code ${code}`);
    process.exit(code || 0);
  });
}

startFlask();
