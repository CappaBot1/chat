const url = "https://cappabot.com/api/chat";
const decoder = new TextDecoder();
const messages: string[] = [];

let input = "";

Deno.stdin.setRaw(true); // Enable raw mode to capture keystrokes immediately

// Function to clear the console and redraw messages + input prompt
function drawScreen() {
    console.clear();
    console.log(messages.toReversed().join("\n"));
    console.log("\n} " + input); // Use stored input
}

// Function to fetch messages every second and update display
async function pollMessages() {
    while (true) {
        const newMessages = await (await fetch(url)).json();
        if (JSON.stringify(newMessages) !== JSON.stringify(messages)) {
            messages.length = 0;
            messages.push(...newMessages);
            drawScreen();
        }
        await new Promise(resolve => setTimeout(resolve, 1000)); // Poll every 1 second
    }
}

// Function to handle user input
async function handleInput() {
    const inputBuffer: Uint8Array = new Uint8Array(1024);

    while (true) {
        const n = await Deno.stdin.read(inputBuffer);
        if (n === null) break;

        const chunk = decoder.decode(inputBuffer.subarray(0, n));

        for (const char of chunk) {
            if (char === "\r") { // Enter key pressed
                if (input.trim()) {
                    await fetch(url, { method: "POST", body: input.trim() });
                }
                input = "";
            } else if (char === "\x7f") { // Handle backspace
                if (input.length > 0) {
                    input = input.slice(0, -1);
                }
            } else { // Any other character
                input += char;
            }
            
        }
        drawScreen();

        // Exit if /exit
        if (input === "/exit") {
            console.log("bai :3");
            Deno.exit();
        }
    }
}

// Start polling and input handling
pollMessages();
handleInput();
