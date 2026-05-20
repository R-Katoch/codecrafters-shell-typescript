import { createInterface } from "readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "$ ",
});

// TODO: Uncomment the code below to pass the first stage
rl.prompt();
rl.on("line", (input) => {
  if (input.startsWith("echo ")) {
    console.log(input.slice(5));
    rl.prompt();
    return;
  }
  if (input === "exit") {
    rl.close();
    return;
  }
  console.log(`${input}: command not found`);
  rl.prompt();
})