// disableRightClick.ts
const devMode = import.meta.env.MODE === "development"; // Check if the environment is development mode

if (!devMode) {
    document.addEventListener('contextmenu', (event: MouseEvent) => {
        event.preventDefault();
    });
}
